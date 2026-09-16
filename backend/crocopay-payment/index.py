import json
import os
import uuid
from typing import Dict, Any

import psycopg2
import requests

CROCOPAY_HOST = 'https://crocopay.tech'
WEBHOOK_URL = 'https://functions.poehali.dev/b0425af1-e07e-4c52-b23d-22dcb7f3e01d'


def get_db_connection():
    dsn = os.environ['DATABASE_URL']
    return psycopg2.connect(dsn)


def get_schema() -> str:
    return os.environ.get('MAIN_DB_SCHEMA', 'public')


def cors_headers() -> Dict[str, str]:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
        'Access-Control-Max-Age': '86400'
    }


def create_invoice(body: Dict[str, Any]) -> Dict[str, Any]:
    amount = body.get('amount')
    wish = body.get('wish', '')
    wish_intensity = body.get('wishIntensity')
    full_name = body.get('fullName', '')
    payment_option = body.get('payment_option', 'TO_CARD')

    if not amount:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'amount обязателен'}), 'isBase64Encoded': False}

    if payment_option not in ('TO_CARD', 'SBP'):
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'payment_option должен быть TO_CARD или SBP'}), 'isBase64Encoded': False}

    client_id = os.environ['CROCOPAY_CLIENT_ID']
    client_secret = os.environ['CROCOPAY_CLIENT_SECRET']

    order_id = str(uuid.uuid4())
    callback_url = f'{WEBHOOK_URL}?order_id={order_id}'

    resp = requests.post(
        f'{CROCOPAY_HOST}/api/v2/h2h/invoices',
        headers={
            'Client-Id': client_id,
            'Client-Secret': client_secret,
            'Content-Type': 'application/json'
        },
        json={
            'amount': int(round(float(amount) * 100)),
            'currency': 'RUB',
            'payment_option': payment_option,
            'callback_url': callback_url
        },
        timeout=15
    )

    data = resp.json()

    if resp.status_code != 200:
        return {'statusCode': resp.status_code, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': data.get('message', 'Ошибка создания счёта')}), 'isBase64Encoded': False}

    conn = get_db_connection()
    schema = get_schema()
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                INSERT INTO {schema}.crocopay_orders
                    (order_uuid, invoice_id, wish, wish_intensity, full_name, amount, currency,
                     payment_option, status, card, bank_receiver, card_owner, expires_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    order_id, data['id'], wish, wish_intensity, full_name,
                    amount, data.get('currency', 'RUB'), data.get('payment_option', payment_option),
                    data.get('status', 'Pending'), data.get('card'), data.get('bank_receiver'),
                    data.get('card_owner'), data.get('expires_at')
                )
            )
        conn.commit()
    finally:
        conn.close()

    response_data = dict(data)
    response_data['order_id'] = order_id

    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
            'body': json.dumps(response_data), 'isBase64Encoded': False}


def get_invoice_status(invoice_id: str) -> Dict[str, Any]:
    client_id = os.environ['CROCOPAY_CLIENT_ID']
    client_secret = os.environ['CROCOPAY_CLIENT_SECRET']

    resp = requests.get(
        f'{CROCOPAY_HOST}/api/v2/h2h/invoices/{invoice_id}',
        headers={
            'Client-Id': client_id,
            'Client-Secret': client_secret
        },
        timeout=15
    )

    data = resp.json()

    if resp.status_code != 200:
        return {'statusCode': resp.status_code, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': data.get('message', 'Счёт не найден')}), 'isBase64Encoded': False}

    conn = get_db_connection()
    schema = get_schema()
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE {schema}.crocopay_orders SET status = %s, updated_at = now() WHERE invoice_id = %s",
                (data.get('status'), invoice_id)
            )
        conn.commit()
    finally:
        conn.close()

    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
            'body': json.dumps(data), 'isBase64Encoded': False}


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Создание счёта на оплату через CrocoPay (H2H) и проверка статуса оплаты
    Args: event - dict с httpMethod, body (amount, wish, fullName, payment_option), queryStringParameters (id)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с реквизитами счёта или статусом оплаты
    '''
    method: str = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': '', 'isBase64Encoded': False}

    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            return create_invoice(body_data)

        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            invoice_id = params.get('id')
            if not invoice_id:
                return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Параметр id обязателен'}), 'isBase64Encoded': False}
            return get_invoice_status(invoice_id)

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