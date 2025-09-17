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
      {/* Кнопка для открытия QR кода */}
      <div className="text-center">
        <Button 
          onClick={() => setIsQRModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          size="lg"
        >
          Оплатить
        </Button>
      </div>

      {/* Модальное окно с QR кодом */}
      {isQRModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Оплата</h3>
              <button 
                onClick={() => setIsQRModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="X" size={24} />
              </button>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Сумма к оплате:</p>
                <p className="text-2xl font-bold text-purple-600">{getAmountFromIntensity(wishIntensity)} ₽</p>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-800">Для оплаты отсканируйте QR код</h4>
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
                  <div>2. Введите сумму: {getAmountFromIntensity(wishIntensity)} ₽</div>
                  <div>3. Подтвердите оплату</div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsQRModalOpen(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    alert('Спасибо за оплату! Ваше желание отправлено во Вселенную!');
                    setIsQRModalOpen(false);
                    onPaymentComplete();
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1"
                >
                  Я оплатил
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
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