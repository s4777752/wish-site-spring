import json
import os
import uuid
from typing import Any, Dict
from urllib.parse import urlencode

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
    """Создаёt платёжную ссылку CrocoPay (кнопка "Оплатить") или проверяет статус заказа.
    POST: инициировать платёж (amount, wish, wishIntensity, fullName) -> redirect_url
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
                    'body': json.dumps({'error': 'Не передан id заказа'}), 'isBase64Encoded': False}

        conn = psycopg2.connect(dsn)
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT order_ref, status, amount, currency, redirect_url FROM crocopay_orders WHERE order_ref = %s",
                (order_ref,)
            )
            row = cur.fetchone()
            cur.close()
        finally:
            conn.close()

        if not row:
            return {'statusCode': 404, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Заказ не найден'}), 'isBase64Encoded': False}

        result = {
            'order_ref': str(row[0]),
            'status': row[1],
            'amount': row[2],
            'currency': row[3],
            'redirect_url': row[4]
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

    if not amount or not isinstance(amount, (int, float)) or amount <= 0:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'amount обязателен и должен быть положительным числом'}), 'isBase64Encoded': False}

    order_ref = str(uuid.uuid4())
    amount_whole = int(round(amount))

    site_origin = os.environ.get('SITE_ORIGIN', 'https://wish-site-spring.poehali.dev')
    payload = {
        'client_id': client_id,
        'client_secret': client_secret,
        'amount': amount_whole,
        'currency': 'RUB',
        'successUrl': f'{site_origin}/?order_ref={order_ref}&payment=success',
        'cancelUrl': f'{site_origin}/?order_ref={order_ref}&payment=cancel',
        'callbackUrl': f'https://functions.poehali.dev/652bdfdb-3f58-47bc-bb03-1db877efbe6f?order_ref={order_ref}'
    }

    resp = requests.post(
        f'{CROCOPAY_HOST}/api/v2/initiate-payment',
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
        data=urlencode(payload),
        timeout=15
    )

    try:
        data = resp.json()
    except ValueError:
        return {'statusCode': 502, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Некорректный ответ от CrocoPay', 'raw': resp.text[:500]}), 'isBase64Encoded': False}

    if resp.status_code != 200 or data.get('status') != 'success':
        return {'statusCode': resp.status_code if resp.status_code != 200 else 502,
                'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': data.get('message', 'Ошибка создания платёжной ссылки')}), 'isBase64Encoded': False}

    redirect_url = data.get('redirect_url')

    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO crocopay_orders "
            "(order_ref, amount, currency, payment_option, status, wish, wish_intensity, full_name, redirect_url) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (order_ref, amount_whole, 'RUB', 'REDIRECT', 'Pending', wish, wish_intensity, full_name, redirect_url)
        )
        conn.commit()
        cur.close()
    finally:
        conn.close()

    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
            'body': json.dumps({
                'order_ref': order_ref,
                'redirect_url': redirect_url,
                'amount': amount_whole,
                'currency': 'RUB'
            }), 'isBase64Encoded': False}