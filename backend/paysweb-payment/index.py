import json
import os
import uuid
from typing import Dict, Any

import requests

PAYSWEB_URL = 'https://paysweb.click/api/request'
SITE_URL = 'https://wish-site-spring.poehali.dev'
MIN_AMOUNT = 1000


def resp(status: int, body: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'statusCode': status,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps(body),
        'isBase64Encoded': False
    }


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Создание заявки на оплату в Paysweb и выдача ссылки на платёжную форму
    Args: event - dict с httpMethod, body (amount, wish, wishIntensity, fullName)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response со ссылкой redirect_url на форму оплаты
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

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return resp(400, {'error': 'Неверный формат JSON'})

    amount = body.get('amount')
    if not amount:
        return resp(400, {'error': 'amount обязателен'})

    amount_int = int(round(float(amount)))
    if amount_int < MIN_AMOUNT:
        return resp(400, {'error': f'Минимальная сумма оплаты {MIN_AMOUNT} ₽'})

    order_id = str(uuid.uuid4())
    wish = body.get('wish', '')
    intensity = body.get('wishIntensity', '')
    from urllib.parse import quote
    success_url = f'{SITE_URL}/payment-success?orderId={order_id}&amount={amount_int}&intensity={intensity}&wish={quote(str(wish))}'
    fail_url = f'{SITE_URL}/payment-cancel?orderId={order_id}'

    r = requests.post(
        PAYSWEB_URL,
        data={
            'amount': amount_int,
            'merchant_order_id': order_id,
            'use_card_payment': 'RUB',
            'api_key': os.environ['PAYSWEB_API_KEY'].strip(),
            'success_url': success_url,
            'fail_url': fail_url
        },
        allow_redirects=False,
        timeout=15
    )

    location = r.headers.get('Location')
    if location and r.status_code in (301, 302, 303, 307, 308):
        return resp(200, {'order_id': order_id, 'redirect_url': location})

    try:
        data = r.json()
    except ValueError:
        data = None

    if isinstance(data, dict):
        for key in ('url', 'redirect_url', 'payment_url', 'link'):
            if data.get(key):
                return resp(200, {'order_id': order_id, 'redirect_url': data[key]})
        messages = []
        for v in data.values():
            messages.extend(v if isinstance(v, list) else [str(v)])
        return resp(502, {'error': '; '.join(map(str, messages)) or 'Не удалось создать платёж', 'paysweb_status': r.status_code, 'paysweb_raw': data})

    return resp(502, {'error': 'Некорректный ответ платёжной системы', 'status': r.status_code})
