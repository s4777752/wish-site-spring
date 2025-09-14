import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PaymentMethodsProps {
  getAmountFromIntensity: (intensity: number) => number;
  wishIntensity: number;
  wish: string;
  onPaymentComplete: () => void;
  deliveryMethod?: 'whatsapp' | 'email' | 'both';
  onUserDataChange?: (email: string, phone: string) => void;
}

declare global {
  interface Window {
    webmoney: any;
  }
}

const PaymentMethods = ({ getAmountFromIntensity, wishIntensity, wish }: PaymentMethodsProps) => {
  useEffect(() => {
    // Загружаем скрипт WebMoney
    const script1 = document.createElement('script');
    script1.src = 'https://merchant.web.money/conf/lib/widgets/wmApp.js?v=1.6';
    script1.async = true;
    document.head.appendChild(script1);

    script1.onload = () => {
      // Инициализируем виджет после загрузки скрипта
      if (window.webmoney) {
        window.webmoney.widgets().button.create({
          "data": {
            "amount": 50,
            "purse": "Z998401936213",
            "desc": "Тестовый товар",
            "paymentType": "card",
            "lmi_payment_no": null,
            "forcePay": true
          },
          "style": {
            "theme": "wm",
            "showAmount": true,
            "titleNum": 1,
            "title": "",
            "design": "skeuomorph"
          },
          "lang": "ru"
        }).on('paymentComplete', function (data) {
          console.log('Платеж завершен', data);
        }).mount('wm-widget');
      }
    };

    return () => {
      // Очищаем скрипт при размонтировании
      const existingScript = document.querySelector('script[src*="wmApp.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* QR код для оплаты */}
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Для оплаты отсканируйте QR код</h3>
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block shadow-sm">
          <img 
            src="https://cdn.poehali.dev/files/f8b182d3-f618-41a7-be07-1c7313360372.jpg" 
            alt="QR код для оплаты" 
            className="w-48 h-48 mx-auto"
          />
        </div>
        <div className="text-center space-y-2">
          <div className="font-semibold text-gray-800">Т-Банк ⚡</div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>1. Отсканируйте QR-код</div>
            <div>2. ИП Паклин СВ</div>
            <div>3. введите сумму</div>
          </div>
        </div>

      </div>

      {/* WebMoney виджет */}
      <div className="text-center">
        <div 
          id="wm-widget" 
          style={{ width: '200px', height: '50px', margin: '0 auto' }}
        ></div>
      </div>
      
      {/* Кнопка скачивания документа аффирмации */}
      <Button 
        onClick={() => {
          const documentData = {
            wish: wish,
            intensity: wishIntensity,
            amount: getAmountFromIntensity(wishIntensity),
            email: 'user@example.com',
            userName: 'Пользователь',
            documentId: `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`
          };
          
          // Импортируем и вызываем функцию генерации
          import('../components/DocumentGenerator').then(({ generateAndDownloadDocument }) => {
            generateAndDownloadDocument(documentData);
          });
        }}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 transition-colors duration-200 text-lg hidden"
      >
        📄 Скачать документ аффирмации
      </Button>
    </div>
  );
};

export default PaymentMethods;