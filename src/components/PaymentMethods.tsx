import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { sendAffirmationEmail } from '@/utils/emailService';
import Icon from '@/components/ui/icon';

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



const PaymentMethods = ({ getAmountFromIntensity, wishIntensity, wish, onPaymentComplete, onUserDataChange }: PaymentMethodsProps) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  useEffect(() => {
    // Добавляем скрипт PayMaster
    const script = document.createElement('script');
    script.src = 'https://paymaster.ru/cpay/sdk/payment-widget.js';
    script.async = true;
    document.head.appendChild(script);



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

    // Устанавливаем обработчик после загрузки скрипта
    script.onload = () => {
      const checkAndAddListener = () => {
        const button = document.querySelector('[btn-pay-98dv40hx5t0bkkyj4d7uttgy6]');
        if (button && window.cpay) {
          button.addEventListener('click', handlePaymentClick);
          console.log('PayMaster кнопка настроена');
        } else {
          setTimeout(checkAndAddListener, 100);
        }
      };
      checkAndAddListener();
    };

    return () => {
      // Очищаем при размонтировании
      const existingScript = document.querySelector('script[src*="paymaster.ru"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }

    };
  }, []);

  return (
    <div className="space-y-6">
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