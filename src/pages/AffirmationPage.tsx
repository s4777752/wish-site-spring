import React from 'react';
import AffirmationGenerator from '@/components/AffirmationGenerator';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const AffirmationPage: React.FC = () => {
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
            ✨ САЙТ ЖЕЛАНИЙ
          </h1>
        </div>
      </header>

      {/* Основной контент */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок страницы */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              🌟 Персональная Аффирмация
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Создайте мощный документ аффирмаций, настроенный именно под ваши желания. 
              Получите красиво оформленный PDF на email и WhatsApp после оплаты.
            </p>
          </div>

          {/* Преимущества */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Heart" size={32} className="text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Персонализация</h3>
              <p className="text-gray-600 text-sm">
                Каждая аффирмация создается индивидуально под ваши цели и желания
              </p>
            </div>

            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FileText" size={32} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Красивый дизайн</h3>
              <p className="text-gray-600 text-sm">
                Профессионально оформленный PDF-документ с инструкциями по использованию
              </p>
            </div>

            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Send" size={32} className="text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Мгновенная доставка</h3>
              <p className="text-gray-600 text-sm">
                Автоматическая отправка на email и WhatsApp сразу после оплаты
              </p>
            </div>
          </div>

          {/* Генератор аффирмаций */}
          <AffirmationGenerator />

          {/* Дополнительная информация */}
          <div className="mt-16 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                💫 Как работают аффирмации?
              </h3>
              <div className="space-y-4 text-left">
                <p className="text-gray-700">
                  <strong>🧠 Научная основа:</strong> Аффирмации перепрограммируют подсознание 
                  через повторение позитивных утверждений, создавая новые нейронные связи.
                </p>
                <p className="text-gray-700">
                  <strong>⚡ Закон притяжения:</strong> Когда вы регулярно произносите аффирмации, 
                  ваша энергия и мысли начинают притягивать желаемые события и людей.
                </p>
                <p className="text-gray-700">
                  <strong>🎯 Результат:</strong> Постоянная практика приводит к изменению 
                  мышления, поведения и, как следствие, реальности вокруг вас.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AffirmationPage;