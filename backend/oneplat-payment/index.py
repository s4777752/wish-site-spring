import json
import os
import uuid
from typing import Dict, Any

import psycopg2
import requests

ONEPLAT_HOST = 'https://1plat.cash'


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
    method = body.get('method', 'card')

    if not amount:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'amount обязателен'}), 'isBase64Encoded': False}

    if method not in ('card', 'sbp', 'qr'):
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'method должен быть card, sbp или qr'}), 'isBase64Encoded': False}

    shop_id = os.environ['ONEPLAT_SHOP_ID'].strip()
    shop_secret = os.environ['ONEPLAT_SHOP_SECRET'].strip()

    merchant_order_id = str(uuid.uuid4())
    user_id = merchant_order_id[:8]

    resp = requests.post(
        f'{ONEPLAT_HOST}/api/merchant/order/create/by-api',
        headers={
            'x-shop': shop_id,
            'x-secret': shop_secret,
            'Content-Type': 'application/json'
        },
        json={
            'merchant_order_id': merchant_order_id,
            'user_id': user_id,
            'amount': int(round(float(amount))),
            'email': f'{user_id}@temp.com',
            'method': method
        },
        timeout=15
    )

    try:
        data = resp.json()
    except ValueError:
        return {'statusCode': 502, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Некорректный ответ от 1plat', 'raw': resp.text[:500]}), 'isBase64Encoded': False}

    if resp.status_code != 200 or not data.get('success'):
        return {'statusCode': resp.status_code if resp.status_code != 200 else 500,
                'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': data.get('message', 'Ошибка создания счёта'), 'raw': data, 'debug': debug_info}), 'isBase64Encoded': False}

    payment = data.get('payment', {})
    note = payment.get('note', {})
    payment_id = payment.get('id')
    guid = data.get('guid')
    status = payment.get('status', -1)
    currency = note.get('currency', 'RUB')
    expires_at = payment.get('expired')
    payment_url = data.get('url')

    conn = get_db_connection()
    schema = get_schema()
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                INSERT INTO {schema}.oneplat_orders
                    (merchant_order_id, payment_id, guid, wish, wish_intensity, full_name, amount, currency,
                     method, status, pan, bank, fio, phone, qr_link, qr_img, payment_url, expires_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    merchant_order_id, payment_id, guid, wish, wish_intensity, full_name,
                    amount, currency, method, status,
                    note.get('pan'), note.get('bank'), note.get('fio'), payment.get('phone'),
                    note.get('qr'), note.get('qr_img'), payment_url, expires_at
                )
            )
        conn.commit()
    finally:
        conn.close()

    response_data = {
        'merchant_order_id': merchant_order_id,
        'payment_id': payment_id,
        'guid': guid,
        'status': status,
        'amount': payment.get('amount_to_pay', amount),
        'currency': currency,
        'method': method,
        'pan': note.get('pan'),
        'bank': note.get('bank'),
        'fio': note.get('fio'),
        'phone': payment.get('phone'),
        'qr_link': note.get('qr'),
        'qr_img': note.get('qr_img'),
        'payment_url': payment_url,
        'expires_at': expires_at
    }

    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
            'body': json.dumps(response_data), 'isBase64Encoded': False}


def get_invoice_status(merchant_order_id: str) -> Dict[str, Any]:
    conn = get_db_connection()
    schema = get_schema()
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT status FROM {schema}.oneplat_orders WHERE merchant_order_id = %s",
                (merchant_order_id,)
            )
            row = cur.fetchone()
    finally:
        conn.close()

    if not row:
        return {'statusCode': 404, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Заказ не найден'}), 'isBase64Encoded': False}

    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
            'body': json.dumps({'status': row[0]}), 'isBase64Encoded': False}


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Создание счёта на оплату через 1plat (card/sbp/qr) и проверка статуса оплаты
    Args: event - dict с httpMethod, body (amount, wish, fullName, method), queryStringParameters (id)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с реквизитами счёта или статусом оплаты
    '''
    method_http: str = event.get('httpMethod', 'GET')

    if method_http == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': '', 'isBase64Encoded': False}

    try:
        if method_http == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            return create_invoice(body_data)

        if method_http == 'GET':
            params = event.get('queryStringParameters') or {}
            merchant_order_id = params.get('id')
            if not merchant_order_id:
                return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Параметр id обязателен'}), 'isBase64Encoded': False}
            return get_invoice_status(merchant_order_id)

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