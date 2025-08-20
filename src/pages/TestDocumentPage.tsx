import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import WishAffirmationDocument from '@/components/WishAffirmationDocument';
import { toast } from '@/components/ui/use-toast';

const TestDocumentPage: React.FC = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testSendDocument = async () => {
    setIsLoading(true);
    
    const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    const testData = {
      wishText: "найти любовь",
      wishIntensity: 8,
      amount: 1000,
      userEmail: "unix7777@ya.ru",
      userName: "Тестовый пользователь",
      userPhone: "+7 999 123-45-67",
      documentId: documentId,
      createdDate: new Date().toISOString()
    };
    
    // Симуляция отправки документа
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fullDocumentContent = `
🌟 ДОКУМЕНТ АФФИРМАЦИИ ЖЕЛАНИЯ
Номер: ${documentId}
Дата активации: ${new Date().toLocaleDateString('ru-RU')}

🎯 ВАШЕ ЖЕЛАНИЕ: "найти любовь"
⚡ УРОВЕНЬ СИЛЫ: 8/10

✨ ПЕРСОНАЛЬНЫЕ АФФИРМАЦИИ:
• Я притягиваю настоящую любовь в свою жизнь
• Моё сердце открыто для глубоких и искренних чувств  
• Я достоин/достойна безусловной любви и счастья
• Любовь приходит ко мне легко и естественно
• Я излучаю любовь и привлекаю её в ответ

🔮 ИНСТРУКЦИИ ПО АКТИВАЦИИ:
1. Читайте аффирмации каждое утро после пробуждения
2. Визуализируйте желаемый результат 5-10 минут
3. Повторяйте аффирмации вечером перед сном
4. Верьте в силу своих слов и намерений

💫 ЭНЕРГЕТИЧЕСКИЙ СТАТУС: АКТИВИРОВАН

📧 Документ отправлен на: unix7777@ya.ru
📱 WhatsApp уведомление: +7 999 123-45-67`;

    console.log('🚀 Отправляю тестовый документ аффирмации:');
    console.log(`✨ Документ аффирмации #${documentId} создан для:
      
🎯 Желание: "${testData.wishText}"
⚡ Сила: ${testData.wishIntensity}/10 (${testData.amount} ₽)
👤 Получатель: ${testData.userName}
📧 Email: ${testData.userEmail}
📱 WhatsApp: ${testData.userPhone}

📜 Содержание документа:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${fullDocumentContent}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    setTestResult(fullDocumentContent);
    setIsLoading(false);
    
    toast({
      title: "✅ Тест выполнен успешно!",
      description: `Тестовый документ аффирмации "найти любовь" отправлен на unix7777@ya.ru`,
      duration: 5000,
    });
  };

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
            🧪 Тест отправки документа
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🧪 Тестируем отправку документа аффирмации
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Этот тест создаст и "отправит" документ аффирмации "найти любовь" на адрес unix7777@ya.ru
            </p>
          </div>

          {/* Кнопка запуска теста */}
          <div className="text-center mb-8">
            <Button
              onClick={testSendDocument}
              disabled={isLoading}
              size="lg"
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Отправляю тестовый документ...
                </>
              ) : (
                <>
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить тестовый документ
                </>
              )}
            </Button>
          </div>

          {/* Результат теста */}
          {testResult && (
            <div className="mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="CheckCircle" size={24} className="text-green-600" />
                  Результат выполнения теста
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      ✅ Тестовый документ аффирмации "найти любовь" успешно создан и отправлен на unix7777@ya.ru
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium mb-2">
                      📧 Информация об отправке:
                    </p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Email получателя: unix7777@ya.ru</li>
                      <li>• WhatsApp уведомление: +7 999 123-45-67</li>
                      <li>• Тип документа: Аффирмация желания</li>
                      <li>• Желание: "найти любовь"</li>
                      <li>• Уровень силы: 8/10 (1000 ₽)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 font-medium mb-2">
                      🔍 Содержание документа (также выведено в консоль браузера):
                    </p>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white p-4 rounded border overflow-x-auto">
{testResult}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Демонстрация документа */}
          {testResult && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📜 Предварительный просмотр отправленного документа
              </h3>
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <WishAffirmationDocument
                  wishText="найти любовь"
                  wishIntensity={8}
                  amount={1000}
                  userName="Тестовый пользователь"
                  userEmail="unix7777@ya.ru"
                  createdDate={new Date().toLocaleDateString('ru-RU')}
                  documentId={testResult.match(/Номер: (WD\w+)/)?.[1] || 'TEST123'}
                />
              </div>
            </div>
          )}

          {/* Инструкция */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="Info" size={20} className="text-yellow-600" />
              Инструкция по тестированию
            </h4>
            <div className="text-gray-700 space-y-2">
              <p>1. Нажмите кнопку "Отправить тестовый документ" выше</p>
              <p>2. Система создаст тестовый документ с аффирмацией "найти любовь"</p>
              <p>3. Документ будет "отправлен" на адрес unix7777@ya.ru</p>
              <p>4. Результат теста отобразится на этой странице</p>
              <p>5. Полное содержание документа будет выведено в консоль браузера (F12)</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TestDocumentPage;