import json
import os
import re
import urllib.parse
import urllib.request
import urllib.error

import psycopg2

CORS = {'Access-Control-Allow-Origin': '*'}


def resp(code: int, data: dict) -> dict:
    return {
        'statusCode': code,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False),
    }


def fetch_status(invoice_id: str):
    url = 'https://coinso.io/api/payment/status?uuid=' + urllib.parse.quote(invoice_id)
    req = urllib.request.Request(url, headers={'Accept': 'application/json'}, method='GET')
    try:
        with urllib.request.urlopen(req, timeout=3) as r:
            return json.loads(r.read().decode('utf-8'))
    except urllib.error.URLError:
        return None


def handler(event: dict, context) -> dict:
    """Принимает вебхук Coinso об оплате, перепроверяет счёт и сохраняет заказ в базе."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                **CORS,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if event.get('httpMethod') != 'POST':
        return resp(405, {'error': 'Method not allowed'})

    body = json.loads(event.get('body') or '{}')
    if body.get('event') != 'payment.success':
        return resp(200, {'ok': True, 'ignored': True})

    invoice_id = str(body.get('invoice_id', ''))
    if not re.fullmatch(r'[A-Za-z0-9_-]{4,64}', invoice_id):
        return resp(400, {'error': 'Некорректный номер счёта'})

    status = fetch_status(invoice_id)
    if not status or not status.get('success') or status.get('status') != 'paid':
        return resp(400, {'error': 'Оплата не подтверждена'})

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO payments (invoice_id, order_id, transaction_id, amount, currency, payment_method, description, status) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, 'paid') "
            "ON CONFLICT (invoice_id) DO NOTHING",
            (
                invoice_id,
                str(status.get('custom') or '')[:100],
                body.get('transaction_id'),
                status.get('amount'),
                status.get('currency'),
                status.get('payment_method'),
                status.get('description'),
            ),
        )
        conn.commit()
    finally:
        conn.close()

    return resp(200, {'ok': True})
