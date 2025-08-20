import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import WishAffirmationDocument from '@/components/WishAffirmationDocument';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const DocumentPreviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Получаем параметры из URL
  const wishText = searchParams.get('wish') || 'Пример желания';
  const wishIntensity = parseInt(searchParams.get('intensity') || '5');
  const amount = parseInt(searchParams.get('amount') || '500');
  const userName = searchParams.get('name') || 'Пользователь';
  const userEmail = searchParams.get('email') || '';
  const documentId = searchParams.get('docId') || `WD${Date.now()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Навигация */}
      <header className="p-4 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <Icon name="ArrowLeft" size={20} />
            <span className="font-medium">Вернуться на главную</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            📜 Документ Аффирмации
          </h1>
          <Button 
            onClick={() => window.print()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Icon name="Printer" size={16} />
            Печать
          </Button>
        </div>
      </header>

      {/* Основной контент */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Информация о документе */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              🌟 Ваш документ готов!
            </h1>
            <p className="text-lg text-gray-600">
              Документ №{documentId} • Официально заверен печатью САЙТ ЖЕЛАНИЙ
            </p>
          </div>

          {/* Действия с документом */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button 
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <Icon name="Printer" size={16} />
              Распечатать документ
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Мой документ аффирмации',
                    text: `Я активировал своё желание через САЙТ ЖЕЛАНИЙ! Документ №${documentId}`,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Ссылка скопирована в буфер обмена!');
                }
              }}
              className="flex items-center gap-2"
            >
              <Icon name="Share2" size={16} />
              Поделиться
            </Button>

            <Button 
              variant="outline"
              onClick={() => {
                // Имитация скачивания PDF
                const link = document.createElement('a');
                link.download = `Аффирмация_желания_${documentId}.pdf`;
                link.href = '#'; // В реальном приложении здесь будет URL PDF
                link.click();
                alert('В реальном приложении здесь будет скачивание PDF документа');
              }}
              className="flex items-center gap-2"
            >
              <Icon name="Download" size={16} />
              Скачать PDF
            </Button>
          </div>

          {/* Сам документ */}
          <div className="print:shadow-none">
            <WishAffirmationDocument
              wishText={decodeURIComponent(wishText)}
              wishIntensity={wishIntensity}
              amount={amount}
              userName={decodeURIComponent(userName)}
              userEmail={decodeURIComponent(userEmail)}
              createdDate={new Date().toLocaleDateString('ru-RU')}
              documentId={documentId}
            />
          </div>

          {/* Дополнительная информация */}
          <div className="mt-12 text-center print:hidden">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📧 Документ отправлен на вашу почту
              </h3>
              <p className="text-gray-600 mb-4">
                Проверьте папку "Входящие" или "Спам". Документ также доступен по этой ссылке.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>💡 Сохраните эту страницу в закладки для быстрого доступа</p>
                <p>🖨️ Используйте кнопку "Печать" для создания физической копии</p>
                <p>📱 Поделитесь ссылкой с близкими для энергетической поддержки</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Стили для печати */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentPreviewPage;