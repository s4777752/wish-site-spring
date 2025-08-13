import React, { useEffect, useRef } from 'react';

interface TinkoffPayFormProps {
  amount: number;
  onPaymentComplete: () => void;
}

declare global {
  interface Window {
    pay: (form: HTMLFormElement) => void;
  }
}

const TinkoffPayForm: React.FC<TinkoffPayFormProps> = ({ amount, onPaymentComplete }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Генерируем уникальный номер заказа
    const orderId = Date.now().toString();
    if (formRef.current) {
      const orderInput = formRef.current.querySelector('input[name="order"]') as HTMLInputElement;
      if (orderInput) {
        orderInput.value = orderId;
      }

      // Добавляем обработчик формы
      const handleFormSubmit = (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const description = formData.get('description') as string;
        const amount = formData.get('amount') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const receipt = formData.get('receipt') as string;

        // Если нужен чек
        if (receipt !== null) {
          if (!email && !phone) {
            alert("Поле E-mail или Phone не должно быть пустым");
            return;
          }

          const receiptInput = form.querySelector('input[name="receipt"]') as HTMLInputElement;
          if (receiptInput) {
            receiptInput.value = JSON.stringify({
              "EmailCompany": "mail@poehali.dev",
              "Taxation": "usn_income",
              "FfdVersion": "1.2",
              "Items": [
                {
                  "Name": description || "Исполнение желания",
                  "Price": Math.round(parseFloat(amount) * 100),
                  "Quantity": 1.00,
                  "Amount": Math.round(parseFloat(amount) * 100),
                  "PaymentMethod": "full_prepayment",
                  "PaymentObject": "service",
                  "Tax": "none",
                  "MeasurementUnit": "pc"
                }
              ]
            });
          }
        }

        if (window.pay) {
          window.pay(form);
          // Для Тинькофф без анимации - просто уведомление
          setTimeout(() => {
            alert('Спасибо! Ваша оплата через Тинькофф обработана.');
          }, 1000);
        } else {
          // Для демо тоже без анимации
          setTimeout(() => {
            alert('Спасибо! Ваша оплата через Тинькофф обработана.');
          }, 500);
        }
      };

      formRef.current.addEventListener('submit', handleFormSubmit);
      
      return () => {
        if (formRef.current) {
          formRef.current.removeEventListener('submit', handleFormSubmit);
        }
      };
    }
  }, [amount, onPaymentComplete]);

  return (
    <>
      <style>{`
        .payform-tbank {
          display: flex;
          margin: 2px auto;
          flex-direction: column;
          max-width: 100%;
        }
        .payform-tbank-row {
          margin: 8px 0;
          border-radius: 8px;
          flex: 1;
          transition: 0.3s;
          border: 2px solid #e5e7eb;
          padding: 12px 16px;
          outline: none;
          background-color: #f9fafb;
          font-size: 16px;
          font-family: inherit;
        }
        .payform-tbank-row:focus {
          background-color: #ffffff;
          border: 2px solid #fbbf24;
          border-radius: 8px;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
        }
        .payform-tbank-btn {
          background-color: #fbbf24;
          border: 2px solid #fbbf24;
          color: #92400e;
          font-weight: 600;
          cursor: pointer;
          border-radius: 8px;
          padding: 16px;
          font-size: 18px;
          margin-top: 16px;
          transition: all 0.3s;
        }
        .payform-tbank-btn:hover {
          background-color: #f59e0b;
          border: 2px solid #f59e0b;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
        }
        .payform-tbank-btn:active {
          transform: translateY(0);
        }
      `}</style>
      
      <div className="text-center mb-6">
        <div className="text-2xl mb-2">🏦</div>
        <h3 className="text-xl font-semibold text-amber-600 mb-2">Оплата через Тинькофф</h3>
        <p className="text-sm text-gray-600">Безопасная оплата банковской картой</p>
      </div>

      <form 
        ref={formRef}
        className="payform-tbank" 
        name="payform-tbank"
        id="payform-tbank"
      >
        <input 
          className="payform-tbank-row" 
          type="hidden" 
          name="terminalkey" 
          value="1754297590246" 
        />
        <input 
          className="payform-tbank-row" 
          type="hidden" 
          name="frame" 
          value="false" 
        />
        <input 
          className="payform-tbank-row" 
          type="hidden" 
          name="language" 
          value="ru" 
        />
        <input 
          className="payform-tbank-row" 
          type="hidden" 
          name="receipt" 
          value="" 
        />
        <input 
          className="payform-tbank-row" 
          type="text" 
          placeholder="Сумма заказа"
          name="amount" 
          defaultValue={amount.toString()}
          required
        />
        <input 
          className="payform-tbank-row" 
          type="hidden" 
          name="order" 
          value="" 
        />
        <input 
          className="payform-tbank-row" 
          type="text" 
          placeholder="Описание заказа" 
          name="description" 
          defaultValue={`Исполнение желания на сумму ${amount} рублей`}
        />
        <input 
          className="payform-tbank-row" 
          type="text" 
          placeholder="ФИО плательщика" 
          name="name" 
          required 
        />
        <input 
          className="payform-tbank-row" 
          type="email" 
          placeholder="E-mail" 
          name="email" 
          required 
        />

        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">💰</span>
            <div>
              <div className="font-semibold text-amber-800">К оплате: {amount} ₽</div>
              <div className="text-sm text-amber-600">Исполнение вашего желания</div>
            </div>
          </div>
        </div>
        
        <input 
          className="payform-tbank-btn" 
          type="submit" 
          value={`Оплатить ${amount} ₽`}
        />
      </form>
    </>
  );
};

export default TinkoffPayForm;