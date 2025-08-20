import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { sendWishAffirmationDocument } from '@/components/DocumentEmailService';
import { generateAndDownloadDocument, DocumentData } from '@/components/DocumentGenerator';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Получаем данные из URL параметров
  const amount = parseInt(searchParams.get('amount') || '500');
  const wish = searchParams.get('wish') || 'Исполнение желания';
  const intensity = parseInt(searchParams.get('intensity') || '5');
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
        intensity,
        amount,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-blue-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center border border-gray-100">
        {/* Иконка успеха */}
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Icon name="Check" className="w-8 h-8 text-green-500" />
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎉 Оплата успешна!
        </h1>

        <p className="text-gray-600 mb-6">
          Ваше желание принято во Вселенную
        </p>

        {/* Информация об оплате */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Сумма:</span>
            <span className="text-2xl font-bold text-blue-600">{amount} ₽</span>
          </div>
          {orderId && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Заказ:</span>
              <span className="text-sm font-mono text-gray-800">#{orderId}</span>
            </div>
          )}
          <div className="text-sm text-gray-500 mt-2">
            Интенсивность желания: {intensity}/10
          </div>
        </div>

        {/* Информация о желании */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6 border border-yellow-100">
          <h3 className="font-semibold text-gray-800 mb-2">Ваше желание:</h3>
          <p className="text-gray-700 italic">"{decodeURIComponent(wish)}"</p>
        </div>

        {/* Статус отправки email */}
        <div className="mb-6">
          {isEmailSending ? (
            <div className="flex items-center justify-center text-blue-600 mb-3">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
              Отправляем документ на email...
            </div>
          ) : emailSent ? (
            <div className="flex items-center justify-center text-green-600 mb-3">
              <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
              Документ отправлен на {email}
            </div>
          ) : (
            <div className="text-gray-500 mb-3">
              Документ будет отправлен на email
            </div>
          )}
        </div>

        {/* Кнопка скачивания */}
        <button
          onClick={handleDownloadDocument}
          disabled={isDownloading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Подготовка документа...
            </>
          ) : (
            <>
              <Icon name="Download" size={20} />
              Скачать документ аффирмации
            </>
          )}
        </button>

        {/* Дополнительные кнопки */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleEmailResend}
            disabled={isEmailSending}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50"
          >
            <Icon name="Mail" size={16} className="mx-auto mb-1" />
            <span className="text-xs">Повтор email</span>
          </button>
          
          <button
            onClick={handleBackToHome}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
          >
            <Icon name="Home" size={16} className="mx-auto mb-1" />
            <span className="text-xs">На главную</span>
          </button>
        </div>

        {/* Информация */}
        <div className="text-xs text-gray-400 space-y-1 border-t border-gray-100 pt-4">
          <p>📄 Документ сохранится в папке "Загрузки"</p>
          <p>📧 Также отправлен на ваш email</p>
          <p>✨ Верьте в исполнение своего желания!</p>
        </div>

        {/* Дополнительные декоративные элементы */}
        <div className="absolute -top-2 -right-2 text-3xl animate-bounce">⭐</div>
        <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">🌟</div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;