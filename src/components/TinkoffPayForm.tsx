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

        // Обработка оплаты через старую логику
        processPayment(form);
      };

      formRef.current.addEventListener('submit', handleFormSubmit);
      
      return () => {
        if (formRef.current) {
          formRef.current.removeEventListener('submit', handleFormSubmit);
        }
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
    const emailToSend = userEmail || formData.email || 'user@example.com';
    const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    // Сохраняем данные для скачивания
    setDocumentData({
      wish,
      intensity: wishIntensity,
      amount,
      email: emailToSend,
      userName: formData.userName,
      documentId
    });
    
    // Показываем экран скачивания через 1.5 сек
    setTimeout(() => {
      console.log('Показываю кнопку скачивания');
      setShowDownloadButton(true);
    }, 1500);
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
    <TinkoffForm
      ref={formRef}
      amount={amount}
      onPaymentClick={handlePaymentClick}
    />
  );
};

export default TinkoffPayForm;