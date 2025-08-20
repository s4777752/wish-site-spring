import React, { useEffect, useRef, useState } from 'react';
import WishActivated from '@/components/WishActivated';
import { sendWishAffirmationDocument } from '@/components/DocumentEmailService';

interface TinkoffPayFormProps {
  amount: number;
  wish: string;
  wishIntensity: number;
  userEmail: string;
  whatsappPhone: string;
  onPaymentComplete: () => void;
}

declare global {
  interface Window {
    pay: (form: HTMLFormElement) => void;
  }
}

const TinkoffPayForm: React.FC<TinkoffPayFormProps> = ({ amount, wish, wishIntensity, userEmail, whatsappPhone, onPaymentComplete }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showActivated, setShowActivated] = useState(false);

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
          // Симулируем успешную оплату для демо
          setTimeout(async () => {
            setPaymentSuccess(true);
            
            // Отправляем документ аффирмации после успешной оплаты
            try {
              const formUserEmail = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value;
              const userName = (form.querySelector('input[name="name"]') as HTMLInputElement)?.value || 'Пользователь';
              
              // Используем email из PaymentMethods если он есть, иначе из формы оплаты
              const emailToSend = userEmail || formUserEmail || 'user@example.com';
              
              const result = await sendWishAffirmationDocument(
                wish,
                wishIntensity,
                amount,
                emailToSend,
                whatsappPhone || '+7 999 123-45-67',
                userName
              );
              
              if (result.success) {
                console.log(`✅ Документ аффирмации #${result.documentId} отправлен на ${emailToSend} и ${whatsappPhone}`);
              }
            } catch (error) {
              console.error('Ошибка при отправке документа аффирмации:', error);
            }
            
            // Показываем экран активации через небольшую задержку
            setTimeout(() => {
              setShowActivated(true);
            }, 1500);
          }, 1000);
        } else {
          // Если нет Tinkoff API, сразу вызываем успешную оплату для демо
          setTimeout(async () => {
            setPaymentSuccess(true);
            
            // Отправляем документ аффирмации после успешной оплаты
            try {
              const formUserEmail = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value;
              const userName = (form.querySelector('input[name="name"]') as HTMLInputElement)?.value || 'Пользователь';
              
              // Используем email из PaymentMethods если он есть, иначе из формы оплаты
              const emailToSend = userEmail || formUserEmail || 'user@example.com';
              
              const result = await sendWishAffirmationDocument(
                wish,
                wishIntensity,
                amount,
                emailToSend,
                whatsappPhone || '+7 999 123-45-67',
                userName
              );
              
              if (result.success) {
                console.log(`✅ Документ аффирмации #${result.documentId} отправлен на ${emailToSend} и ${whatsappPhone}`);
              }
            } catch (error) {
              console.error('Ошибка при отправке документа аффирмации:', error);
            }
            
            // Показываем экран активации через небольшую задержку
            setTimeout(() => {
              setShowActivated(true);
            }, 1500);
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

  // Обработчик возврата на главную после активации
  const handleBackToHome = () => {
    setShowActivated(false);
    setPaymentSuccess(false);
    onPaymentComplete();
  };

  // Если показываем экран активации
  if (showActivated) {
    return <WishActivated wish={wish} onBackToHome={handleBackToHome} />;
  }


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
        ref={formRef}
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
          defaultValue={userEmail}
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