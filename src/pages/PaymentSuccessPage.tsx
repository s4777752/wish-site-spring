import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { sendWishAffirmationDocument } from '@/components/DocumentEmailService';

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
  const [documentGenerated, setDocumentGenerated] = useState(false);

  // Автоматически генерируем документ при загрузке страницы
  useEffect(() => {
    const generateDocument = async () => {
      if (!documentGenerated && wish && amount) {
        try {
          setDocumentGenerated(true);
          const result = await sendWishAffirmationDocument(
            decodeURIComponent(wish),
            parseInt(intensity),
            parseInt(amount),
            email || 'user@example.com',
            phone || '+7 999 123-45-67',
            'Пользователь'
          );
          
          if (result.success) {
            console.log(`✅ Документ аффирмации #${result.documentId} подготовлен к скачиванию`);
          }
        } catch (error) {
          console.error('Ошибка при подготовке документа:', error);
        }
      }
    };

    generateDocument();
  }, [wish, amount, intensity, email, phone, documentGenerated]);

  const handleDownloadDocument = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const result = await sendWishAffirmationDocument(
        decodeURIComponent(wish),
        parseInt(intensity),
        parseInt(amount),
        email || 'user@example.com',
        phone || '+7 999 123-45-67',
        'Пользователь'
      );
      
      if (result.success && result.documentUrl) {
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = result.documentUrl;
        link.download = `affirmation_${result.documentId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`📄 Документ #${result.documentId} скачан`);
      } else {
        console.error('Ошибка: не удалось получить URL документа');
      }
    } catch (error) {
      console.error('Ошибка при скачивании документа:', error);
    } finally {
      setIsDownloading(false);
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
          disabled={isDownloading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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