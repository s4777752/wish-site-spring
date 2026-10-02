import json
import os
from typing import Dict, Any
from urllib.parse import parse_qs

import psycopg2

SCHEMA = 't_p46634317_wish_site_spring'


def resp(status: int, body: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'statusCode': status,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps(body),
        'isBase64Encoded': False
    }


def parse_body(event: Dict[str, Any]) -> Dict[str, Any]:
    raw = event.get('body') or ''
    if event.get('isBase64Encoded'):
        import base64
        raw = base64.b64decode(raw).decode('utf-8')
    raw = raw.strip()
    if not raw:
        return {}
    try:
        data = json.loads(raw)
        return data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        return {k: v[0] for k, v in parse_qs(raw).items()}


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Приём уведомления Paysweb об успешной оплате и обновление статуса заказа
    Args: event - dict с httpMethod, body (status, amount, amount_without_comission, merchant_order_id, transaction_id, datetime)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response со статусом обработки
    '''
    method: str = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method != 'POST':
        return resp(405, {'error': 'Метод не поддерживается'})

    data = parse_body(event)
    order_id = str(data.get('merchant_order_id', '')).strip()
    status = str(data.get('status', '')).strip()
    if not order_id or not status:
        return resp(400, {'error': 'Нет merchant_order_id или status'})

    new_status = 'paid' if status == 'successful_payment' else status[:32]
    transaction_id = str(data.get('transaction_id', ''))[:128] or None
    try:
        amount = int(round(float(data.get('amount'))))
    except (TypeError, ValueError):
        return resp(400, {'error': 'Некорректная сумма'})
    try:
        net = float(data.get('amount_without_comission'))
    except (TypeError, ValueError):
        net = None

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT amount, status FROM {SCHEMA}.paysweb_orders WHERE order_id = %s",
                (order_id,)
            )
            row = cur.fetchone()
            if not row:
                return resp(404, {'error': 'Заказ не найден'})
            if row[0] != amount:
                return resp(400, {'error': 'Сумма не совпадает с заказом'})
            if row[1] == 'paid':
                return resp(200, {'success': True, 'already_paid': True})
            cur.execute(
                f"UPDATE {SCHEMA}.paysweb_orders SET status = %s, transaction_id = %s, "
                f"amount_without_comission = %s, "
                f"paid_at = CASE WHEN %s = 'paid' THEN now() ELSE paid_at END, "
                f"updated_at = now() WHERE order_id = %s",
                (new_status, transaction_id, net, new_status, order_id)
            )
        conn.commit()
    finally:
        conn.close()

    return resp(200, {'success': True})
