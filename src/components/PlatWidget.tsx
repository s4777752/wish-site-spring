import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PlatWidgetProps {
  amount?: number;
  description?: string;
  onPaymentSuccess?: (data: any) => void;
  onPaymentError?: (error: any) => void;
}

const PlatWidget = ({ amount = 100, description = "Энергетический вклад для исполнения желания", onPaymentSuccess, onPaymentError }: PlatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Обработчик сообщений от iframe виджета
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://1plat.cash') return;
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // Обработка успешного создания платежа
        if (data.success === 1 && data.payment) {
          const paymentInfo = {
            guid: data.guid,
            payment_id: data.payment.id,
            amount: data.payment.amount,
            amount_to_shop: data.payment.amount_to_shop,
            amount_to_pay: data.payment.amount_to_pay,
            method_group: data.payment.method_group,
            method_name: data.payment.method_name,
            status: data.payment.status,
            expired: data.payment.expired,
            note: data.payment.note,
            url: data.url
          };

          // Для карт и СБП
          if (data.payment.method_group === 'card' && data.payment.note) {
            paymentInfo.cardInfo = {
              currency: data.payment.note.currency,
              pan: data.payment.note.pan,
              bank: data.payment.note.bank,
              fio: data.payment.note.fio,
              deal_id: data.payment.note.deal_id
            };
          }

          // Для QR кодов
          if (data.payment.note?.qr || data.payment.note?.qr_img) {
            paymentInfo.qrInfo = {
              currency: data.payment.note.currency,
              qr: data.payment.note.qr,
              qr_img: data.payment.note.qr_img
            };
          }

          onPaymentSuccess?.(paymentInfo);
          setIsOpen(false);
        } 
        // Обработка ошибок
        else if (data.success === 0 || data.type === 'payment_error') {
          onPaymentError?.(data);
          setIsOpen(false);
        }
        // Закрытие виджета
        else if (data.type === 'widget_close') {
          setIsOpen(false);
        }
      } catch (error) {
        console.error('Ошибка обработки сообщения от iframe виджета:', error);
        onPaymentError?.({ error: 'Ошибка обработки ответа виджета', details: error });
      }
    };

    if (isOpen) {
      window.addEventListener('message', handleIframeMessage);
    }

    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [isOpen, onPaymentSuccess, onPaymentError]);

  // Параметры виджета 1plat
  const shopId = '872';
  const sign = 'b257e45aebcb85375302281aaf02ec4c34dc7ace8d02aa7566821af51aba19f8';
  
  const openWidget = () => {
    // Формируем URL с дополнительными параметрами
    const widgetParams = new URLSearchParams({
      shop_id: shopId,
      sign: sign,
      amount: amount.toString(),
      description: description,
      // Добавляем дополнительные параметры если нужно
      success_url: window.location.origin + '/payment-success',
      fail_url: window.location.origin + '/payment-failed',
      callback_url: window.location.origin + '/api/payment-callback'
    });

    const widgetUrl = `https://1plat.cash/widget?${widgetParams.toString()}`;
    
    // Открываем в новом окне
    const popup = window.open(
      widgetUrl,
      '1plat_payment',
      'width=600,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no'
    );

    if (popup) {
      // Слушаем сообщения от виджета
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== 'https://1plat.cash') return;
        
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          
          // Обработка успешного создания платежа
          if (data.success === 1 && data.payment) {
            const paymentInfo = {
              guid: data.guid,
              payment_id: data.payment.id,
              amount: data.payment.amount,
              amount_to_shop: data.payment.amount_to_shop,
              amount_to_pay: data.payment.amount_to_pay,
              method_group: data.payment.method_group,
              method_name: data.payment.method_name,
              status: data.payment.status,
              expired: data.payment.expired,
              note: data.payment.note,
              url: data.url
            };

            // Для карт и СБП
            if (data.payment.method_group === 'card' && data.payment.note) {
              paymentInfo.cardInfo = {
                currency: data.payment.note.currency,
                pan: data.payment.note.pan,
                bank: data.payment.note.bank,
                fio: data.payment.note.fio,
                deal_id: data.payment.note.deal_id
              };
            }

            // Для QR кодов
            if (data.payment.note?.qr || data.payment.note?.qr_img) {
              paymentInfo.qrInfo = {
                currency: data.payment.note.currency,
                qr: data.payment.note.qr,
                qr_img: data.payment.note.qr_img
              };
            }

            onPaymentSuccess?.(paymentInfo);
            popup.close();
          } 
          // Обработка ошибок
          else if (data.success === 0 || data.type === 'payment_error') {
            onPaymentError?.(data);
            popup.close();
          }
          // Закрытие виджета
          else if (data.type === 'widget_close') {
            popup.close();
          }
        } catch (error) {
          console.error('Ошибка обработки сообщения от виджета:', error);
          onPaymentError?.({ error: 'Ошибка обработки ответа виджета', details: error });
          popup.close();
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Проверяем, закрыто ли окно
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);
    }
  };

  const openInlineWidget = () => {
    setIsOpen(true);
  };

  const closeWidget = () => {
    setIsOpen(false);
  };

  // Встроенный виджет
  const inlineWidgetUrl = `https://1plat.cash/widget?shop_id=${shopId}&sign=${sign}&amount=${amount}&description=${encodeURIComponent(description)}&inline=1`;

  return (
    <div className="space-y-4">
      {/* Кнопки для открытия виджета */}
      <div className="flex gap-3">
        <Button
          onClick={openWidget}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
        >
          💳 Оплатить в новом окне
        </Button>
        
        <Button
          onClick={openInlineWidget}
          variant="outline"
          className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          📱 Встроенный виджет
        </Button>
      </div>

      {/* Встроенный виджет */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md h-[600px] relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Оплата через 1plat</h3>
              <button
                onClick={closeWidget}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <iframe
              ref={iframeRef}
              src={inlineWidgetUrl}
              className="w-full h-[540px] border-0"
              title="1plat Payment Widget"
            />
          </div>
        </div>
      )}

      {/* Информация о платеже */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Детали платежа:</h4>
        <div className="text-blue-800 space-y-1 text-sm">
          <p><strong>Сумма:</strong> {amount} ₽</p>
          <p><strong>Описание:</strong> {description}</p>
          <p><strong>Магазин ID:</strong> {shopId}</p>
          <p><strong>Система:</strong> 1plat.cash</p>
        </div>
      </div>

      {/* Безопасность */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>🔒 Платежи обрабатываются через защищенное соединение</p>
        <p>💯 Ваши данные защищены стандартами PCI DSS</p>
        <p>⚡ Поддержка карт, СБП, QR-кодов и криптовалют</p>
      </div>
    </div>
  );
};

export default PlatWidget;