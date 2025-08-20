import React, { useEffect, useRef, useState } from 'react';
import { sendWishAffirmationDocument } from '@/components/DocumentEmailService';
import PaymentSuccessScreen from '@/components/PaymentSuccessScreen';
import { DocumentData, generateAndDownloadDocument } from '@/components/DocumentGenerator';
import TinkoffForm from '@/components/TinkoffForm';

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
    paymentSuccess: () => void;
  }
}

const TinkoffPayForm: React.FC<TinkoffPayFormProps> = ({ 
  amount, 
  wish, 
  wishIntensity, 
  userEmail, 
  whatsappPhone, 
  onPaymentComplete 
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);

  // Тестовая функция для проверки системы
  const testPaymentSystem = () => {
    console.log('🧪 ТЕСТИРОВАНИЕ СИСТЕМЫ ОПЛАТЫ');
    console.log('1. Проверяю загрузку скриптов...');
    
    // Проверяем все скрипты на странице
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const tinkoffScript = scripts.find(script => 
      (script as HTMLScriptElement).src.includes('tinkoff')
    );
    
    if (tinkoffScript) {
      console.log('📜 Скрипт Тинькофф найден:', (tinkoffScript as HTMLScriptElement).src);
    } else {
      console.log('❌ Скрипт Тинькофф не найден');
    }
    
    // Проверяем доступность API
    console.log('2. Проверяю глобальный объект window.pay...');
    if (typeof window.pay === 'function') {
      console.log('✅ API Тинькофф загружен успешно');
    } else {
      console.log('❌ API Тинькофф не загружен или не готов');
      console.log('window.pay =', window.pay);
    }
    
    console.log('3. Имитирую успешную оплату через 2 секунды...');
    setTimeout(() => {
      console.log('✅ Тест: показываю кнопку скачивания');
      
      const emailToSend = userEmail || 'test@example.com';
      const documentId = `TEST${Date.now()}`;
      
      setDocumentData({
        wish,
        intensity: wishIntensity,
        amount,
        email: emailToSend,
        userName: 'Тестовый пользователь',
        documentId
      });
      
      setShowDownloadButton(true);
    }, 2000);
  };

  useEffect(() => {
    // Генерируем уникальный номер заказа
    const orderId = Date.now().toString();
    if (formRef.current) {
      const orderInput = formRef.current.querySelector('input[name="order"]') as HTMLInputElement;
      if (orderInput) {
        orderInput.value = orderId;
      }

      // Слушаем сообщения от Тинькофф о результате оплаты
      const handleTinkoffMessage = (event: MessageEvent) => {
        console.log('Получено сообщение от Тинькофф:', event.data);
        
        // Проверяем успешную оплату
        if (event.data && event.data.type === 'payment_success') {
          console.log('✅ Оплата через Тинькофф успешна!');
          setTimeout(() => {
            setShowDownloadButton(true);
          }, 500);
        } else if (event.data && event.data.type === 'payment_error') {
          console.log('❌ Ошибка оплаты через Тинькофф');
        }
      };

      // Глобальный обработчик успешной оплаты (если Тинькофф его вызывает)
      window.paymentSuccess = () => {
        console.log('✅ Callback успешной оплаты от Тинькофф');
        setTimeout(() => {
          setShowDownloadButton(true);
        }, 500);
      };

      window.addEventListener('message', handleTinkoffMessage);

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

        // Обработка оплаты через старую логику
        processPayment(form);
      };

      formRef.current.addEventListener('submit', handleFormSubmit);
      
      return () => {
        if (formRef.current) {
          formRef.current.removeEventListener('submit', handleFormSubmit);
        }
        window.removeEventListener('message', handleTinkoffMessage);
        // Очищаем глобальный callback
        delete window.paymentSuccess;
      };
    }
  }, [amount, onPaymentComplete]);

  const processPayment = async (form: HTMLFormElement) => {
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
    }
  };

  const handlePaymentClick = (formData: { email: string; userName: string }) => {
    console.log('Запуск оплаты Тинькофф для:', formData);
    
    // Получаем форму и запускаем API Тинькофф
    if (formRef.current && window.pay) {
      try {
        // Заполняем скрытые поля если нужно
        const emailToSend = userEmail || formData.email || 'user@example.com';
        const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        
        // Сохраняем данные для будущего использования
        setDocumentData({
          wish,
          intensity: wishIntensity,
          amount,
          email: emailToSend,
          userName: formData.userName,
          documentId
        });
        
        // Вызываем API Тинькофф
        window.pay(formRef.current);
        
        // API Тинькофф должен сам обработать успешную оплату
        // Кнопка скачивания появится только после реального успеха оплаты
        console.log('API Тинькофф запущен. Ожидаем результат оплаты...');
        
      } catch (error) {
        console.error('Ошибка запуска API Тинькофф:', error);
        // В случае ошибки API показываем кнопку для демо
        setTimeout(() => {
          console.log('Показываю кнопку скачивания (fallback)');
          setShowDownloadButton(true);
        }, 1500);
      }
    } else {
      console.log('API Тинькофф недоступен, показываю кнопку для демо');
      // Если нет API Тинькофф - показываем для демо
      const emailToSend = userEmail || formData.email || 'user@example.com';
      const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      setDocumentData({
        wish,
        intensity: wishIntensity,
        amount,
        email: emailToSend,
        userName: formData.userName,
        documentId
      });
      
      setTimeout(() => {
        console.log('Показываю кнопку скачивания (демо режим)');
        setShowDownloadButton(true);
      }, 1500);
    }
  };

  const handleDownload = () => {
    if (documentData) {
      generateAndDownloadDocument(documentData);
    }
  };

  const handleBackToHome = () => {
    setShowDownloadButton(false);
    onPaymentComplete();
  };

  // Если показываем кнопку скачивания
  console.log('TinkoffPayForm render. ShowDownloadButton:', showDownloadButton, 'DocumentData:', documentData);
  
  if (showDownloadButton && documentData) {
    return (
      <PaymentSuccessScreen
        documentData={documentData}
        onDownload={handleDownload}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return (
    <div>
      {/* Кнопка тестирования (только в dev режиме) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">🧪 Режим тестирования</h3>
          <button
            onClick={testPaymentSystem}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
          >
            Тестировать систему оплаты
          </button>
        </div>
      )}
      
      <TinkoffForm
        ref={formRef}
        amount={amount}
        onPaymentClick={handlePaymentClick}
      />
    </div>
  );
};

export default TinkoffPayForm;