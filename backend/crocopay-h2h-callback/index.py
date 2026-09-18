import hashlib
import hmac
import json
import os
from typing import Any, Dict

import psycopg2


def cors_headers() -> Dict[str, str]:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
    }


def handler(event: dict, context) -> Dict[str, Any]:
    """Принимает callback от CrocoPay после оплаты H2H счёта, проверяет HMAC-подпись
    и обновляет статус заказа в таблице crocopay_orders.
    """
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Метод не поддерживается'}), 'isBase64Encoded': False}

    params = event.get('queryStringParameters') or {}
    order_ref = params.get('order_ref')
    if not order_ref:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Не передан order_ref'}), 'isBase64Encoded': False}

    body_str = event.get('body') or '{}'
    try:
        payload = json.loads(body_str)
    except json.JSONDecodeError:
        return {'statusCode': 400, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Некорректный JSON'}), 'isBase64Encoded': False}

    client_secret = os.environ['CROCOPAY_CLIENT_SECRET'].strip()

    sign = payload.get('sign', '')
    signable = f"{payload.get('timestamp')}|{payload.get('subtotal')}|{payload.get('percentage')}|" \
               f"{payload.get('charge_percentage')}|{payload.get('charge_fixed')}|{payload.get('total')}"
    expected = hmac.new(client_secret.encode(), signable.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, sign):
        return {'statusCode': 403, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Неверная подпись'}), 'isBase64Encoded': False}

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()
        cur.execute(
            "UPDATE crocopay_orders SET status = 'Success', updated_at = now() WHERE order_ref = %s",
            (order_ref,)
        )
        conn.commit()
        cur.close()
    finally:
        conn.close()

    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'},
            'body': json.dumps({'success': True}), 'isBase64Encoded': False}
