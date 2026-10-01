import hashlib
import json
import os
from typing import Dict, Any

import psycopg2


def get_db_connection():
    dsn = os.environ['DATABASE_URL']
    return psycopg2.connect(dsn)


def get_schema() -> str:
    return os.environ.get('MAIN_DB_SCHEMA', 'public')


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Приём callback от 1plat после изменения статуса платежа, проверка подписи signature_v2 и обновление статуса заказа
    Args: event - dict с httpMethod, body (payment_id, guid, merchant_id, user_id, status, amount, signature_v2)
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
        body_data = json.loads(event.get('body', '{}'))

        required_fields = ['payment_id', 'merchant_id', 'amount', 'status', 'signature_v2']
        if not all(f in body_data for f in required_fields):
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Отсутствуют обязательные поля'}),
                'isBase64Encoded': False
            }

        shop_id = os.environ['ONEPLAT_SHOP_ID']
        shop_secret = os.environ['ONEPLAT_SHOP_SECRET']

        sign_source = f"{body_data['merchant_id']}{body_data['amount']}{shop_id}{shop_secret}"
        expected_sign = hashlib.md5(sign_source.encode('utf-8')).hexdigest()

        if expected_sign != body_data['signature_v2']:
            return {
                'statusCode': 403,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Неверная подпись'}),
                'isBase64Encoded': False
            }

        payment_id = str(body_data['payment_id'])
        status = int(body_data['status'])

        conn = get_db_connection()
        schema = get_schema()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"UPDATE {schema}.oneplat_orders SET status = %s, updated_at = now() WHERE payment_id = %s",
                    (status, payment_id)
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
