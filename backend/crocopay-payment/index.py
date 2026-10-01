import json
import os
import uuid
from typing import Dict, Any

import psycopg2
import requests

CROCOPAY_HOST = 'https://crocopay.tech'
WEBHOOK_URL = 'https://functions.poehali.dev/9ee637a1-48dc-48b2-a120-6e6c0569976a'
ALLOWED_PAYMENT_OPTIONS = {'TO_CARD', 'SBP'}


def get_db_connection():
    dsn = os.environ['DATABASE_URL']
    schema = os.environ.get('MAIN_DB_SCHEMA')
    if schema:
        return psycopg2.connect(dsn, options=f'-c search_path={schema}', connect_timeout=3)
    return psycopg2.connect(dsn, connect_timeout=3)


def cors_headers() -> Dict[str, str]:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
        'Access-Control-Max-Age': '86400'
    }


def create_payment_link(body: Dict[str, Any]) -> Dict[str, Any]:
    amount = body.get('amount')
    wish = body.get('wish', '')
    wish_intensity = body.get('wishIntensity')
    full_name = body.get('fullName', '')
    payment_option = str(body.get('paymentOption', 'TO_CARD')).upper()

    if not amount:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'amount обязателен'}), 'isBase64Encoded': False}

    if payment_option not in ALLOWED_PAYMENT_OPTIONS:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'paymentOption должен быть TO_CARD или SBP'}), 'isBase64Encoded': False}

    client_id = os.environ['CROCOPAY_CLIENT_ID'].strip()
    client_secret = os.environ['CROCOPAY_CLIENT_SECRET'].strip()

    order_id = str(uuid.uuid4())
    amount_whole = int(round(float(amount)))
    callback_url = f'{WEBHOOK_URL}?order_id={order_id}'

    resp = requests.post(
        f'{CROCOPAY_HOST}/api/v2/h2h/invoices',
        headers={
            'Client-Id': client_id,
            'Client-Secret': client_secret,
            'Content-Type': 'application/json'
        },
        json={
            'amount': amount_whole,
            'currency': 'RUB',
            'payment_option': payment_option,
            'callback_url': callback_url
        },
        timeout=15
    )

    data = resp.json()

    if resp.status_code != 200:
        return {'statusCode': resp.status_code,
                'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': data.get('message', 'Не удалось создать счёт')}), 'isBase64Encoded': False}

    invoice_id = data.get('id')
    card = data.get('card')
    bank_receiver = data.get('bank_receiver')
    card_owner = data.get('card_owner')
    expires_at = data.get('expires_at')

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO crocopay_orders
                    (order_uuid, invoice_id, wish, wish_intensity, full_name, amount, currency,
                     payment_option, status, card, bank_receiver, card_owner, expires_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    order_id, invoice_id, wish, wish_intensity, full_name,
                    amount, 'RUB', payment_option, data.get('status', 'Pending'),
                    card, bank_receiver, card_owner, expires_at
                )
            )
        conn.commit()
    finally:
        conn.close()

    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
            'body': json.dumps({
                'order_id': order_id,
                'invoice_id': invoice_id,
                'status': data.get('status', 'Pending'),
                'amount': amount_whole,
                'currency': 'RUB',
                'payment_option': payment_option,
                'card': card,
                'bank_receiver': bank_receiver,
                'card_owner': card_owner,
                'expires_at': expires_at
            }), 'isBase64Encoded': False}


def get_order_status(order_id: str) -> Dict[str, Any]:
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT status, amount, wish, wish_intensity FROM crocopay_orders WHERE order_uuid = %s",
                (order_id,)
            )
            row = cur.fetchone()
    finally:
        conn.close()

    if not row:
        return {'statusCode': 404, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Заказ не найден'}), 'isBase64Encoded': False}

    status, amount, wish, wish_intensity = row
    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
            'body': json.dumps({'status': status, 'amount': float(amount), 'wish': wish, 'wish_intensity': wish_intensity}),
            'isBase64Encoded': False}


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Создание H2H-счёта CrocoPay (реквизиты карты или СБП) и проверка статуса заказа
    Args: event - dict с httpMethod, body (amount, wish, wishIntensity, fullName, paymentOption), queryStringParameters (orderId)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с реквизитами оплаты или статусом заказа
    '''
    method: str = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': '', 'isBase64Encoded': False}

    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            return create_payment_link(body_data)

        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            order_id = params.get('orderId') or params.get('id')
            if not order_id:
                return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Параметр orderId обязателен'}), 'isBase64Encoded': False}
            return get_order_status(order_id)

        return {'statusCode': 405, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Метод не поддерживается'}), 'isBase64Encoded': False}

    except json.JSONDecodeError:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Неверный формат JSON'}), 'isBase64Encoded': False}
    except Exception as e:
        return {'statusCode': 500, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Внутренняя ошибка сервера', 'details': str(e),
                                     'request_id': getattr(context, 'request_id', 'unknown')}),
                'isBase64Encoded': False}