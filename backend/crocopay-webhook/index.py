import hashlib
import hmac
import json
import os
from typing import Dict, Any

import psycopg2


def get_db_connection():
    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    schema = os.environ.get('MAIN_DB_SCHEMA')
    if schema:
        with conn.cursor() as cur:
            cur.execute(f'SET search_path TO {schema}')
    return conn


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Приём webhook от CrocoPay после успешной оплаты, проверка подписи и обновление статуса заказа
    Args: event - dict с httpMethod, body (timestamp, subtotal, percentage, charge_percentage, charge_fixed, total, sign), queryStringParameters (order_id)
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
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }

    try:
        params = event.get('queryStringParameters') or {}
        order_id = params.get('order_id')

        body_data = json.loads(event.get('body', '{}'))

        required_fields = ['timestamp', 'subtotal', 'percentage', 'charge_percentage', 'charge_fixed', 'total', 'sign']
        if not all(f in body_data for f in required_fields):
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Отсутствуют обязательные поля'}),
                'isBase64Encoded': False
            }

        client_secret = os.environ['CROCOPAY_CLIENT_SECRET']

        sign_string = '|'.join(str(body_data[f]) for f in required_fields[:-1])
        expected_sign = hmac.new(
            client_secret.encode('utf-8'),
            sign_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected_sign, body_data['sign']):
            return {
                'statusCode': 403,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Неверная подпись'}),
                'isBase64Encoded': False
            }

        if order_id:
            conn = get_db_connection()
            try:
                with conn.cursor() as cur:
                    cur.execute(
                        "UPDATE crocopay_orders SET status = 'Success', updated_at = now() WHERE order_uuid = %s",
                        (order_id,)
                    )
                conn.commit()
            finally:
                conn.close()

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }

    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Неверный формат JSON'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Внутренняя ошибка сервера', 'details': str(e),
                                 'request_id': getattr(context, 'request_id', 'unknown')}),
            'isBase64Encoded': False
        }
