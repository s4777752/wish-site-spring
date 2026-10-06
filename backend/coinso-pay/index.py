import json
import os
import urllib.request
import urllib.error
import time

CORS = {'Access-Control-Allow-Origin': '*'}


def resp(code: int, data: dict) -> dict:
    return {
        'statusCode': code,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False),
    }


def handler(event: dict, context) -> dict:
    """Создаёт счёт в Coinso и возвращает ссылку на страницу оплаты."""
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

    payload = {
        'project_id': int(os.environ['COINSO_PROJECT_ID']),
        'amount': amount,
        'description': str(body.get('description', 'Оплата заказа'))[:200],
        'custom': str(body.get('custom', ''))[:100],
        'success_url': body.get('success_url', ''),
        'fail_url': body.get('fail_url', ''),
    }

    api_url = 'https://coinso.io/api/payment/create'
    req = urllib.request.Request(
        api_url,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f"Bearer {os.environ['COINSO_API_KEY']}",
        },
        method='POST',
    )
    data = None
    last_reason = ''
    for attempt in range(1, 4):
        try:
            with urllib.request.urlopen(req, timeout=3) as r:
                data = json.loads(r.read().decode('utf-8'))
            break
        except urllib.error.HTTPError as e:
            print('coinso http error:', e.code, e.read().decode('utf-8', 'ignore')[:500])
            return resp(502, {'error': 'Платёжная система отклонила запрос', 'status': e.code})
        except (urllib.error.URLError, OSError) as e:
            last_reason = str(getattr(e, 'reason', e))
            print(f'coinso network error, attempt {attempt}:', last_reason)
            time.sleep(0.4)

    if data is None:
        return resp(502, {'error': 'Не удалось подключиться к Coinso, попробуйте ещё раз', 'reason': last_reason})

    print('coinso response:', json.dumps(data, ensure_ascii=False)[:500])

    if not data.get('success') or not data.get('payment_url'):
        return resp(502, {'error': 'Не удалось создать счёт'})

    return resp(200, {
        'payment_url': data['payment_url'],
        'invoice_id': data.get('invoice_id'),
    })