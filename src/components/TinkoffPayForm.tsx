import React, { useEffect, useRef, useState } from 'react';

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
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [documentData, setDocumentData] = useState<{
    wish: string;
    intensity: number;
    amount: number;
    email: string;
    userName: string;
    documentId: string;
  } | null>(null);


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

        // Независимо от API Тинькофф, обрабатываем "оплату" 
        console.log('Запускаю обработку оплаты...');
        
        // Симулируем успешную оплату для демо
        setTimeout(async () => {
          setPaymentSuccess(true);
          console.log('Оплата помечена как успешная');
          
          // Получаем данные из формы
          const formUserEmail = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value;
          const userName = (form.querySelector('input[name="name"]') as HTMLInputElement)?.value || 'Пользователь';
          
          // Используем email из PaymentMethods если он есть, иначе из формы оплаты
          const emailToSend = userEmail || formUserEmail || 'user@example.com';
          const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
          
          console.log('Сохраняю данные документа:', { wish, intensity: wishIntensity, amount, email: emailToSend, userName, documentId });
          
          // Всегда сохраняем данные для скачивания документа
          setDocumentData({
            wish,
            intensity: wishIntensity,
            amount,
            email: emailToSend,
            userName,
            documentId
          });
          
          try {
            const result = await sendWishAffirmationDocument(
              wish,
              wishIntensity,
              amount,
              emailToSend,
              whatsappPhone || '+7 999 123-45-67',
              userName
            );
            
            if (result.success) {
              console.log(`✅ Документ аффирмации #${result.documentId} отправлен на ${emailToSend}`);
            }
          } catch (error) {
            console.error('Ошибка при отправке документа аффирмации:', error);
          }
          
          // Показываем кнопку скачивания
          setTimeout(() => {
            console.log('Показываю кнопку скачивания...');
            setShowDownloadButton(true);
          }, 1500);
        }, 1000);

        // Также пытаемся вызвать API Тинькофф если доступен
        if (window.pay) {
          try {
            window.pay(form);
          } catch (error) {
            console.log('Ошибка API Тинькофф (это нормально для демо):', error);
          }
        } else {
          // Если нет Tinkoff API, сразу вызываем успешную оплату для демо
          setTimeout(async () => {
            setPaymentSuccess(true);
            
            // Отправляем документ аффирмации после успешной оплаты
            const formUserEmail = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value;
            const userName = (form.querySelector('input[name="name"]') as HTMLInputElement)?.value || 'Пользователь';
            
            // Используем email из PaymentMethods если он есть, иначе из формы оплаты
            const emailToSend = userEmail || formUserEmail || 'user@example.com';
            const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            
            // Всегда сохраняем данные для скачивания документа
            setDocumentData({
              wish,
              intensity: wishIntensity,
              amount,
              email: emailToSend,
              userName,
              documentId
            });
            
            try {
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
            
            // Показываем кнопку скачивания
            setTimeout(() => {
              console.log('Показываю кнопку скачивания. DocumentData:', documentData);
              setShowDownloadButton(true);
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

  // Функция генерации и скачивания PDF
  const generatePDF = () => {
    if (!documentData) return;
    
    const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    const pdfContent = `
🌟 ДОКУМЕНТ АФФИРМАЦИИ ЖЕЛАНИЯ
Номер: ${documentId}
Дата активации: ${currentDate}

🎯 ВАШЕ ЖЕЛАНИЕ: "${documentData.wish}"
⚡ УРОВЕНЬ СИЛЫ: ${documentData.intensity}/10
💰 ЭНЕРГЕТИЧЕСКИЙ ВКЛАД: ${documentData.amount} ₽

✨ ПЕРСОНАЛЬНЫЕ АФФИРМАЦИИ:
${getAffirmationsForWish(documentData.wish)}

🔮 ИНСТРУКЦИИ ПО АКТИВАЦИИ:
1. Читайте аффирмации каждое утро после пробуждения
2. Визуализируйте желаемый результат 5-10 минут
3. Повторяйте аффирмации вечером перед сном
4. Верьте в силу своих слов и намерений

💫 ЭНЕРГЕТИЧЕСКИЙ СТАТУС: АКТИВИРОВАН ✅

Получатель: ${documentData.userName}
Email: ${documentData.email}
    `;

    // Создаем blob и скачиваем как текстовый файл
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Документ_аффирмации_${documentId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Функция для генерации аффирмаций в зависимости от желания
  const getAffirmationsForWish = (wish: string) => {
    const lowerWish = wish.toLowerCase();
    
    if (lowerWish.includes('любовь') || lowerWish.includes('отношения')) {
      return `• Я притягиваю настоящую любовь в свою жизнь
• Моё сердце открыто для глубоких и искренних чувств
• Я достоин/достойна безусловной любви и счастья
• Любовь приходит ко мне легко и естественно
• Я излучаю любовь и привлекаю её в ответ`;
    }
    
    if (lowerWish.includes('деньги') || lowerWish.includes('богатство') || lowerWish.includes('финансы')) {
      return `• Деньги легко и свободно текут в мою жизнь
• Я притягиваю финансовое изобилие во всех сферах
• Мои доходы растут с каждым днем
• Я достоин/достойна богатства и процветания
• Вселенная поддерживает мое финансовое благополучие`;
    }
    
    if (lowerWish.includes('здоровье') || lowerWish.includes('исцеление')) {
      return `• Мое тело исцеляется с каждым днем
• Я излучаю жизненную энергию и силу
• Каждая клетка моего тела наполнена здоровьем
• Я принимаю решения, которые поддерживают мое благополучие
• Мое тело и разум находятся в гармонии`;
    }
    
    // Универсальные аффирмации
    return `• Я притягиваю в свою жизнь все, что мне нужно
• Вселенная работает в мою пользу
• Мои желания исполняются легко и гармонично
• Я открыт/открыта для получения всех благословений
• Каждый день приближает меня к цели`;
  };




  // Если показываем кнопку скачивания
  console.log('TinkoffPayForm render. ShowDownloadButton:', showDownloadButton, 'DocumentData:', documentData);
  
  if (showDownloadButton && documentData) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Оплата успешна!</h2>
          <p className="text-gray-600">Ваш документ аффирмации готов</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">
            🎯 Желание: "{documentData.wish}"
          </p>
          <p className="text-green-600 text-sm mt-1">
            💫 Документ #{documentData.documentId}
          </p>
        </div>

        <button
          onClick={generatePDF}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mb-4 transition-colors"
        >
          📄 Скачать документ аффирмации
        </button>

        <button
          onClick={() => {
            setShowDownloadButton(false);
            onPaymentComplete();
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    );
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
          onClick={(e) => {
            e.preventDefault();
            console.log('Кнопка Оплатить нажата');
            
            // Получаем данные из формы
            const form = e.target.closest('form');
            const formUserEmail = (form?.querySelector('input[name="email"]') as HTMLInputElement)?.value || '';
            const userName = (form?.querySelector('input[name="name"]') as HTMLInputElement)?.value || 'Пользователь';
            
            const emailToSend = userEmail || formUserEmail || 'user@example.com';
            const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            
            console.log('Обрабатываю оплату для:', { userName, email: emailToSend, wish, amount });
            
            // Сохраняем данные для скачивания
            setDocumentData({
              wish,
              intensity: wishIntensity,
              amount,
              email: emailToSend,
              userName,
              documentId
            });
            
            // Показываем экран скачивания через 1.5 сек
            setTimeout(() => {
              console.log('Показываю кнопку скачивания');
              setShowDownloadButton(true);
            }, 1500);
          }}
        >
          Оплатить {amount} ₽
        </button>
      </form>
    </>
  );
};

export default TinkoffPayForm;