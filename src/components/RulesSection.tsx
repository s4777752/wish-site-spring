import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const RulesSection = () => {
  return (
    <section className="py-20 px-4" aria-labelledby="rules-heading">
      <div className="max-w-4xl mx-auto">
        <h2 id="rules-heading" className="text-4xl font-bold text-center text-black mb-12">
          Правила использования
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="grid">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Icon name="BookOpen" size={24} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Как это работает</h3>
                <ul className="space-y-2 text-gray-600" role="list">
                  <li>• Напишите ваше желание в форме выше</li>
                  <li>• Нажмите "ОК" для перехода к оплате</li>
                  <li>• Выберите удобный способ оплаты</li>
                  <li>• Ваше желание будет передано во Вселенную</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Icon name="Shield" size={24} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Гарантии безопасности</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Данные защищены SSL-шифрованием</li>
                  <li>• Соответствие ФЗ-152 о персональных данных</li>
                  <li>• Безопасная оплата через банки РФ</li>
                  <li>• Поддержка 24/7 на русском языке</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Icon name="Star" size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Позитивные желания</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Любовь и гармоничные отношения</li>
                  <li>• Карьерный рост и самореализация</li>
                  <li>• Здоровье и внутренний баланс</li>
                  <li>• Финансовое благополучие</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Icon name="AlertTriangle" size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Этические ограничения</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Запрет на причинение вреда людям</li>
                  <li>• Соблюдение морально-этических норм</li>
                  <li>• Исключение противоправных желаний</li>
                  <li>• Фокус на личностном росте</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-rose-100 p-3 rounded-full">
                <Icon name="Heart" size={24} className="text-rose-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Психологический эффект</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Активация подсознательных процессов</li>
                  <li>• Формирование позитивного мышления</li>
                  <li>• Усиление внутренней мотивации</li>
                  <li>• Направление энергии на цель</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Icon name="Scale" size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Правовые основы</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Соглашение согласно ГК РФ</li>
                  <li>• Защита прав потребителей</li>
                  <li>• Возврат средств в течение 14 дней</li>
                  <li>• Разрешение споров в РФ</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Используя сервис, вы соглашаетесь с 
            <a href="/terms" className="text-purple-600 hover:text-purple-700 underline ml-1" aria-label="Перейти к Пользовательскому соглашению">
              Пользовательским соглашением
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Психологическое воздействие основано на принципах позитивной психологии и не является медицинской услугой
          </p>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;