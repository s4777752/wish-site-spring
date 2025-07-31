import React, { useEffect } from 'react';

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
  useEffect(() => {
    // Генерируем уникальный номер заказа
    const orderId = Date.now().toString();
    const orderInput = document.querySelector('input[name="order"]') as HTMLInputElement;
    if (orderInput) {
      orderInput.value = orderId;
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (window.pay) {
      window.pay(e.currentTarget);
      // Симулируем успешную оплату для демо
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }
  };

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
        className="payform-tbank" 
        name="payform-tbank" 
        onSubmit={handleSubmit}
      >
        <input 
          className="payform-tbank-row" 
          type="hidden" 
          name="terminalkey" 
          value="TBankTest" 
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
          name="amount" 
          value={(amount * 100).toString()} // Тинькофф требует сумму в копейках
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
        <input 
          className="payform-tbank-row" 
          type="tel" 
          placeholder="Контактный телефон" 
          name="phone" 
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