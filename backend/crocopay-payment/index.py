import json
import os
import uuid
from typing import Dict, Any
from urllib.parse import urlencode

import psycopg2
import requests

CROCOPAY_HOST = 'https://crocopay.tech'
SITE_URL = 'https://wish-site-spring.poehali.dev'
WEBHOOK_URL = 'https://functions.poehali.dev/9ee637a1-48dc-48b2-a120-6e6c0569976a'


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

    if not amount:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'amount обязателен'}), 'isBase64Encoded': False}

    client_id = os.environ['CROCOPAY_CLIENT_ID'].strip()
    client_secret = os.environ['CROCOPAY_CLIENT_SECRET'].strip()

    order_id = str(uuid.uuid4())
    amount_whole = int(round(float(amount)))

    success_params = urlencode({
        'orderId': order_id,
        'amount': amount_whole,
        'wish': wish,
        'intensity': wish_intensity or ''
    })
    success_url = f'{SITE_URL}/payment-success?{success_params}'
    cancel_url = f'{SITE_URL}/payment-cancel?orderId={order_id}'
    callback_url = f'{WEBHOOK_URL}?order_id={order_id}'

    resp = requests.post(
        f'{CROCOPAY_HOST}/api/v2/initiate-payment',
        data={
            'client_id': client_id,
            'client_secret': client_secret,
            'amount': amount_whole,
            'currency': 'RUB',
            'successUrl': success_url,
            'cancelUrl': cancel_url,
            'callbackUrl': callback_url
        },
        timeout=15
    )

    data = resp.json()

    if resp.status_code != 200 or data.get('status') != 'success':
        return {'statusCode': resp.status_code if resp.status_code != 200 else 502,
                'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': data.get('message', 'Не удалось создать счёт')}), 'isBase64Encoded': False}

    redirect_url = data.get('redirect_url')

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO crocopay_orders
                    (order_uuid, wish, wish_intensity, full_name, amount, currency,
                     payment_option, status, redirect_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    order_id, wish, wish_intensity, full_name,
                    amount, 'RUB', 'REDIRECT', 'Pending', redirect_url
                )
            )
        conn.commit()
    finally:
        conn.close()

    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
            'body': json.dumps({'redirect_url': redirect_url, 'order_id': order_id}), 'isBase64Encoded': False}


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
    Business: Создание платёжной ссылки через CrocoPay Express (initiate-payment) и проверка статуса заказа
    Args: event - dict с httpMethod, body (amount, wish, wishIntensity, fullName), queryStringParameters (orderId)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с redirect_url или статусом заказа
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
