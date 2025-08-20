import React, { forwardRef } from 'react';

interface TinkoffFormProps {
  amount: number;
  onPaymentClick: (formData: { email: string; userName: string }) => void;
}

const TinkoffForm = forwardRef<HTMLFormElement, TinkoffFormProps>(
  ({ amount, onPaymentClick }, ref) => {
    const handlePaymentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      console.log('Кнопка Оплатить нажата');
      
      // Получаем данные из формы
      const form = e.currentTarget.closest('form');
      const formUserEmail = (form?.querySelector('input[name="email"]') as HTMLInputElement)?.value || '';
      const userName = (form?.querySelector('input[name="name"]') as HTMLInputElement)?.value || 'Пользователь';
      
      console.log('Обрабатываю оплату для:', { userName, email: formUserEmail, amount });
      
      onPaymentClick({ email: formUserEmail, userName });
    };

    return (
      <>
        <style>{`
          .payform-tbank {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            margin: 2px auto;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            max-width: 250px;
          }
          .payform-tbank-row {
            margin: 2px;
            border-radius: 4px;
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            -webkit-transition: 0.3s;
            -o-transition: 0.3s;
            transition: 0.3s;
            border: 1px solid #DFE3F3;
            padding: 15px;
            outline: none;
            background-color: #DFE3F3;
            font-size: 15px;
          }
          .payform-tbank-row:focus {
            background-color: #FFFFFF;
            border: 1px solid #616871;
            border-radius: 4px;
          }
          .payform-tbank-btn {
            background-color: #FBC520;
            border: 1px solid #FBC520;
            color: #3C2C0B;
            cursor: pointer;
            padding: 18px 24px;
            font-size: 17px;
            font-weight: 600;
          }
          .payform-tbank-btn:hover {
            background-color: #FAB619;
            border: 1px solid #FAB619;
          }
        `}</style>
        
        <div className="text-center mb-6">
          <div className="text-2xl mb-2">🏦</div>
          <h3 className="text-xl font-semibold text-amber-600 mb-2">Оплата через Тинькофф</h3>
          <p className="text-sm text-gray-600">Безопасная оплата банковской картой</p>
        </div>

        <form 
          ref={ref}
          className="payform-tbank" 
          name="payform-tbank"
          id="payform-tbank"
        >
          <input 
            className="payform-tbank-row" 
            type="hidden" 
            name="terminalkey" 
            value="1755704239263" 
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
          
          <button 
            className="payform-tbank-btn" 
            type="button"
            onClick={handlePaymentClick}
          >
            Оплатить {amount} ₽
          </button>
        </form>
      </>
    );
  }
);

TinkoffForm.displayName = 'TinkoffForm';

export default TinkoffForm;