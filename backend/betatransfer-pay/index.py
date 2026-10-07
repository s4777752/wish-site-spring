import hashlib
import json
import os
import urllib.error
import urllib.parse
import urllib.request

CORS = {'Access-Control-Allow-Origin': '*'}


def resp(code: int, data: dict) -> dict:
    return {
        'statusCode': code,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False),
    }


def handler(event: dict, context) -> dict:
    """Создаёт счёт в BetaTransfer и возвращает ответ платёжной системы со ссылкой на оплату."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                **CORS,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if event.get('httpMethod') != 'POST':
        return resp(405, {'error': 'Method not allowed'})

    body = json.loads(event.get('body') or '{}')
    amount = body.get('amount')
    if not isinstance(amount, (int, float)) or amount <= 0:
        return resp(400, {'error': 'Некорректная сумма'})

    public = os.environ['BETATRANSFER_PUBLIC_KEY']
    secret = os.environ['BETATRANSFER_SECRET_KEY']

    data = {
        'amount': f'{float(amount):.2f}',
        'currency': str(body.get('currency', 'RUB')),
        'orderId': str(body.get('orderId', ''))[:100],
    }
    if body.get('paymentSystem'):
        data['paymentSystem'] = str(body['paymentSystem'])

    data['sign'] = hashlib.md5((''.join(data.values()) + secret).encode('utf-8')).hexdigest()

    url = 'https://merchant.betatransfer.io/api/payment?token=' + urllib.parse.quote(public)
    req = urllib.request.Request(
        url,
        data=urllib.parse.urlencode(data).encode('utf-8'),
        headers={'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=4) as r:
            raw = r.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        raw = e.read().decode('utf-8', 'ignore')
        print('betatransfer http error:', e.code, raw[:500])
        return resp(502, {'error': 'Платёжная система отклонила запрос', 'status': e.code, 'details': raw[:500]})

    print('betatransfer response:', raw[:500])
    try:
        parsed = json.loads(raw)
    except ValueError:
        return resp(502, {'error': 'Непонятный ответ платёжной системы', 'details': raw[:500]})

    return resp(200, {'result': parsed})
