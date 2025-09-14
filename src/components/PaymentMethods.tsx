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
    cpay: any;
  }
}



const PaymentMethods = ({ getAmountFromIntensity, wishIntensity, wish }: PaymentMethodsProps) => {
  useEffect(() => {
    // Добавляем скрипт PayMaster
    const script = document.createElement('script');
    script.src = 'https://paymaster.ru/cpay/sdk/payment-widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Добавляем стили для кнопки
    const style = document.createElement('style');
    style.innerHTML = `
      button[btn-pay-98dv40hx5t0bkkyj4d7uttgy6] { 
        display: inline-block; 
        padding: 16px 24px; 
        border-radius: 8px; 
        color: #fff; 
        background-color: #58bfe8; 
        font-size: 16px; 
        font-family: "Lato", "Arial", sans-serif; 
        line-height: 16px; 
        outline: none; 
        border: none; 
      }
      button[btn-pay-98dv40hx5t0bkkyj4d7uttgy6]:hover { 
        opacity: 0.9; 
        cursor: pointer; 
      }
    `;
    document.head.appendChild(style);

    // Добавляем обработчик клика после загрузки скрипта
    const handlePaymentClick = () => {
      if (window.cpay) {
        const paymentWidget = new window.cpay.PaymentWidget();
        paymentWidget.init({
          "merchantId": "bc70f8f2-d8d3-49f1-9ec2-8f41857fc244",
          "invoice": {"description": "SAIT ZHELANII"},
          "amount": {"currency": "RUB", "value": 0},
          "receipt": null,
          "paymentForm": {
            "theme": "light",
            "primaryColor": "#58bfe8",
            "productCard": {
              "title": "SAIT ZHELANII",
              "description": "САЙТ ЖЕЛАНИЙ",
              "imageUrl": null
            },
            "fields": [
              {
                "type": "input",
                "name": "customerEmail",
                "label": "E-mail",
                "hint": null,
                "required": true,
                "selectOptions": null,
                "additionalAmount": null
              },
              {
                "type": "input",
                "name": "amount",
                "label": "Сумма",
                "hint": null,
                "required": true,
                "selectOptions": null,
                "additionalAmount": null
              }
            ]
          }
        });
      }
    };

    // Устанавливаем обработчик после небольшой задержки, чтобы убедиться что скрипт загружен
    const timer = setTimeout(() => {
      const button = document.querySelector('[btn-pay-98dv40hx5t0bkkyj4d7uttgy6]');
      if (button) {
        button.addEventListener('click', handlePaymentClick);
      }
    }, 1000);

    return () => {
      // Очищаем при размонтировании
      const existingScript = document.querySelector('script[src*="paymaster.ru"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      const existingStyle = document.querySelector('style');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* QR код для оплаты */}
      <div className="text-center space-y-4 hidden">
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

      {/* PayMaster кнопка оплаты */}
      <div className="text-center">
        <button btn-pay-98dv40hx5t0bkkyj4d7uttgy6>Оплатить</button>
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