import json
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обработка жалоб на платежи через 1plat API
    Args: event - dict с httpMethod, body (payment_id)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с fail_url или ошибкой
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Обработка CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    try:
        # Получаем данные из запроса
        body_data = json.loads(event.get('body', '{}'))
        payment_id = body_data.get('payment_id')
        
        if not payment_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'payment_id обязателен'}),
                'isBase64Encoded': False
            }
        
        # Пока используем мок данные (потом подключим реальный API)
        # В реальном проекте здесь будет запрос к https://api.1plat.ru/api/merchant/order/req/complaint/by-api
        
        mock_fail_url = "https://wish-site-spring.poehali.dev/payment-failed"
        
        # Возвращаем успешный ответ
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'fail_url': mock_fail_url,
                'payment_id': payment_id,
                'message': 'Жалоба успешно подана'
            }),
            'isBase64Encoded': False
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Неверный формат JSON'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': 'Внутренняя ошибка сервера',
                'details': str(e),
                'request_id': getattr(context, 'request_id', 'unknown')
            }),
            'isBase64Encoded': False
        }