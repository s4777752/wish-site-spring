import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { sendAffirmationEmail } from '@/utils/emailService';

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

      {/* PayMaster кнопка оплаты */}
      <div className="text-center">
        <button 
          btn-pay-98dv40hx5t0bkkyj4d7uttgy6
          onClick={(e) => {
            e.preventDefault();
            console.log('Клик по кнопке PayMaster');
            const amount = getAmountFromIntensity(wishIntensity);
            if (window.cpay) {
              const paymentWidget = new window.cpay.PaymentWidget();
              paymentWidget.init({
                "merchantId": "bc70f8f2-d8d3-49f1-9ec2-8f41857fc244",
                "invoice": {"description": "SAIT ZHELANII"},
                "amount": {"currency": "RUB", "value": amount, "fixed": true},
                "receipt": null,
                "paymentForm": {
                  "theme": "light",
                  "primaryColor": "#6366f1",
                  "productCard": {
                    "title": "САЙТ ЖЕЛАНИЙ",
                    "description": `Исполнение желания "${wish}" с силой ${wishIntensity}/10`,
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
                      "name": "customerName",
                      "label": "Имя",
                      "hint": null,
                      "required": true,
                      "selectOptions": null,
                      "additionalAmount": null
                    }
                  ]
                },
                "callbacks": {
                  "onSuccess": async (paymentData) => {
                    console.log('Оплата успешна:', paymentData);
                    
                    // Получаем данные из формы оплаты
                    const email = paymentData.customerData?.customerEmail || 'user@example.com';
                    const name = paymentData.customerData?.customerName || 'Пользователь';
                    
                    // Отправляем email с документом аффирмации
                    try {
                      const orderNumber = `WM${Date.now()}`;
                      const timestamp = new Date().toLocaleString('ru-RU');
                      
                      await sendAffirmationEmail({
                        name: name,
                        email: email,
                        wish: wish,
                        amount: amount,
                        orderNumber: orderNumber,
                        timestamp: timestamp
                      });
                      
                      console.log('Документ аффирмации отправлен на:', email);
                      
                      // Уведомляем родительский компонент об изменении данных пользователя
                      if (onUserDataChange) {
                        onUserDataChange(email, '');
                      }
                      
                    } catch (error) {
                      console.error('Ошибка при отправке документа аффирмации:', error);
                    }
                    
                    // Вызываем callback успешной оплаты
                    if (onPaymentComplete) {
                      onPaymentComplete();
                    }
                  },
                  "onError": (error) => {
                    console.error('Ошибка оплаты:', error);
                  }
                }
              });
            } else {
              console.error('PayMaster SDK не загружен');
            }
          }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
        >
          Оплатить
        </button>
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