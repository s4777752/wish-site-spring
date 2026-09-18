import json
import os
import uuid
from typing import Any, Dict

import psycopg2
import requests

CROCOPAY_HOST = 'https://crocopay.tech'


def cors_headers() -> Dict[str, str]:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Access-Control-Max-Age': '86400'
    }


def handler(event: dict, context) -> Dict[str, Any]:
    """Создаёт счёт H2H в CrocoPay или проверяет его статус по order_ref.
    POST: создать счёт (amount, wish, wishIntensity, fullName, paymentOption)
    GET: проверить статус (?id=order_ref)
    """
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    client_id = os.environ['CROCOPAY_CLIENT_ID'].strip()
    client_secret = os.environ['CROCOPAY_CLIENT_SECRET'].strip()
    dsn = os.environ['DATABASE_URL']

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        order_ref = params.get('id')
        if not order_ref:
            return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Не передан id счёта'}), 'isBase64Encoded': False}

        conn = psycopg2.connect(dsn)
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT order_ref, invoice_id, status, amount, currency, payment_option, "
                "requisite, bank_receiver, card_owner, expires_at FROM crocopay_orders WHERE order_ref = %s",
                (order_ref,)
            )
            row = cur.fetchone()
            cur.close()
        finally:
            conn.close()

        if not row:
            return {'statusCode': 404, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Счёт не найден'}), 'isBase64Encoded': False}

        result = {
            'order_ref': str(row[0]),
            'invoice_id': row[1],
            'status': row[2],
            'amount': row[3],
            'currency': row[4],
            'payment_option': row[5],
            'requisite': row[6],
            'bank_receiver': row[7],
            'card_owner': row[8],
            'expires_at': row[9].isoformat() if row[9] else None
        }
        return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps(result), 'isBase64Encoded': False}

    if method != 'POST':
        return {'statusCode': 405, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Метод не поддерживается'}), 'isBase64Encoded': False}

    body_str = event.get('body') or '{}'
    try:
        body = json.loads(body_str)
    except json.JSONDecodeError:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Некорректный JSON'}), 'isBase64Encoded': False}

    amount = body.get('amount')
    wish = body.get('wish', '')
    wish_intensity = body.get('wishIntensity')
    full_name = body.get('fullName', '')
    payment_option = body.get('paymentOption', 'TO_CARD')

    if not amount or not isinstance(amount, (int, float)) or amount <= 0:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'amount обязателен и должен быть положительным числом'}), 'isBase64Encoded': False}

    valid_options = {'TO_CARD', 'SBP', 'SBP_ALFA', 'SBP_TBANK', 'QR_NSPK'}
    if payment_option not in valid_options:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': f'paymentOption должен быть одним из {sorted(valid_options)}'}), 'isBase64Encoded': False}

    order_ref = str(uuid.uuid4())
    amount_kopecks = int(round(amount * 100))

    resp = requests.post(
        f'{CROCOPAY_HOST}/api/v2/h2h/invoices',
        headers={
            'Client-Id': client_id,
            'Client-Secret': client_secret,
            'Content-Type': 'application/json'
        },
        json={
            'amount': amount_kopecks,
            'currency': 'RUB',
            'payment_option': payment_option,
            'callback_url': f'https://functions.poehali.dev/652bdfdb-3f58-47bc-bb03-1db877efbe6f?order_ref={order_ref}'
        },
        timeout=15
    )

    try:
        data = resp.json()
    except ValueError:
        return {'statusCode': 502, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Некорректный ответ от CrocoPay', 'raw': resp.text[:500]}), 'isBase64Encoded': False}

    if resp.status_code != 200:
        return {'statusCode': resp.status_code, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': data.get('message', 'Ошибка создания счёта')}), 'isBase64Encoded': False}

    requisite = data.get('card', '')
    bank_receiver = data.get('bank_receiver', '')
    card_owner = data.get('card_owner', '')
    expires_at = data.get('expires_at')
    invoice_id = data.get('id')
    status = data.get('status', 'Pending')

    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO crocopay_orders "
            "(order_ref, invoice_id, amount, currency, payment_option, status, wish, wish_intensity, "
            "full_name, requisite, bank_receiver, card_owner, expires_at) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (order_ref, invoice_id, amount_kopecks, 'RUB', payment_option, status, wish, wish_intensity,
             full_name, requisite, bank_receiver, card_owner, expires_at)
        )
        conn.commit()
        cur.close()
    finally:
        conn.close()

    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
            'body': json.dumps({
                'order_ref': order_ref,
                'invoice_id': invoice_id,
                'status': status,
                'amount': amount_kopecks,
                'currency': 'RUB',
                'payment_option': payment_option,
                'requisite': requisite,
                'bank_receiver': bank_receiver,
                'card_owner': card_owner,
                'expires_at': expires_at
            }), 'isBase64Encoded': False}