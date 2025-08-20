import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { sendWishAffirmationDocument } from '@/components/DocumentEmailService';
import { generateAndDownloadDocument, DocumentData } from '@/components/DocumentGenerator';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Получаем данные из URL параметров
  const amount = searchParams.get('amount') || '500';
  const wish = searchParams.get('wish') || 'Исполнение желания';
  const intensity = searchParams.get('intensity') || '5';
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const orderId = searchParams.get('orderId') || '';

  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // Автоматически генерируем данные документа при загрузке страницы
  useEffect(() => {
    if (wish && amount) {
      const docData: DocumentData = {
        wish: decodeURIComponent(wish),
        intensity: parseInt(intensity),
        amount: parseInt(amount),
        email: email || 'user@example.com',
        userName: 'Пользователь',
        documentId: orderId || `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      };
      
      setDocumentData(docData);
      
      // Автоматически отправляем документ на email
      sendDocumentByEmail(docData);
    }
  }, [wish, amount, intensity, email, phone, orderId]);

  const sendDocumentByEmail = async (docData: DocumentData) => {
    if (emailSent || isEmailSending) return;
    
    setIsEmailSending(true);
    
    try {
      const result = await sendWishAffirmationDocument(
        docData.wish,
        docData.intensity,
        docData.amount,
        docData.email,
        phone || '+7 999 123-45-67',
        docData.userName
      );
      
      if (result.success) {
        console.log(`✅ Документ аффирмации #${result.documentId} отправлен на ${docData.email}`);
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Ошибка при отправке документа:', error);
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleDownloadDocument = async () => {
    if (isDownloading || !documentData) return;
    
    setIsDownloading(true);
    
    try {
      // Используем локальную генерацию документа
      generateAndDownloadDocument(documentData);
      
      console.log(`📄 Документ #${documentData.documentId} скачан локально`);
    } catch (error) {
      console.error('Ошибка при скачивании документа:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmailResend = () => {
    if (documentData) {
      setEmailSent(false);
      sendDocumentByEmail(documentData);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Иконка успеха */}
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Icon name="Check" className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Оплата успешна!
        </h1>

        {/* Информация об оплате */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            {amount} ₽
          </div>
          <div className="text-sm text-gray-600">
            {orderId && `Заказ #${orderId}`}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Исполнение желания
          </div>
        </div>

        {/* Информация о документе */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Ваш документ аффирмации готов!
          </p>
          <p className="text-sm text-gray-500">
            Персональный документ для исполнения вашего желания
          </p>
        </div>

        {/* Кнопка скачивания */}
        <button
          onClick={handleDownloadDocument}
          disabled={isDownloading || !documentData}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Подготовка документа...
            </>
          ) : !documentData ? (
            <>
              <Icon name="AlertCircle" size={20} />
              Документ не готов
            </>
          ) : (
            <>
              <Icon name="Download" size={20} />
              📄 Скачать документ аффирмации
            </>
          )}
        </button>

        {/* Дополнительные кнопки */}
        <button
          onClick={handleBackToHome}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200 mb-4"
        >
          Вернуться на главную
        </button>

        {/* Информация */}
        <div className="text-xs text-gray-400 space-y-1">
          <p>Документ сохранится в папке "Загрузки"</p>
          <p>Формат: PDF • Размер: ~200 КБ</p>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute top-4 right-4 text-6xl opacity-10">
          🎉
        </div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-10">
          ✨
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;