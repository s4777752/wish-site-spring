import json
import re
import urllib.request
import urllib.error
import urllib.parse

CORS = {'Access-Control-Allow-Origin': '*'}


def resp(code: int, data: dict) -> dict:
    return {
        'statusCode': code,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False),
    }


def handler(event: dict, context) -> dict:
    """Проверяет в Coinso, оплачен ли счёт, и сверяет номер заказа."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                **CORS,
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    params = event.get('queryStringParameters') or {}
    invoice_id = params.get('invoice_id', '')
    order_id = params.get('order_id', '')

    if not re.fullmatch(r'[A-Za-z0-9_-]{4,64}', invoice_id):
        return resp(400, {'error': 'Некорректный номер счёта', 'paid': False})

    url = 'https://coinso.io/api/payment/status?uuid=' + urllib.parse.quote(invoice_id)
    req = urllib.request.Request(url, headers={'Accept': 'application/json'}, method='GET')
    try:
        with urllib.request.urlopen(req, timeout=4) as r:
            data = json.loads(r.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return resp(502, {'error': 'Не удалось проверить счёт', 'status': e.code, 'paid': False})

    paid = bool(data.get('success')) and data.get('status') == 'paid'
    if paid and order_id and data.get('custom') != order_id:
        paid = False

    return resp(200, {
        'paid': paid,
        'status': data.get('status'),
        'amount': data.get('amount'),
        'custom': data.get('custom'),
    })
