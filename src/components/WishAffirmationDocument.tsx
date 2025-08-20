import React from 'react';
import Icon from '@/components/ui/icon';

interface WishAffirmationDocumentProps {
  wishText: string;
  wishIntensity: number;
  amount: number;
  userName?: string;
  userEmail?: string;
  createdDate: string;
  documentId: string;
}

const WishAffirmationDocument: React.FC<WishAffirmationDocumentProps> = ({
  wishText,
  wishIntensity,
  amount,
  userName = "Желающий",
  userEmail,
  createdDate,
  documentId
}) => {
  const getIntensityData = (intensity: number) => {
    const levels = {
      1: { label: "Легкое желание", color: "text-green-600", bg: "from-green-100 to-green-50", emoji: "🌱" },
      2: { label: "Слабое желание", color: "text-green-600", bg: "from-green-100 to-green-50", emoji: "🌿" },
      3: { label: "Умеренное желание", color: "text-blue-600", bg: "from-blue-100 to-blue-50", emoji: "🌊" },
      4: { label: "Заметное желание", color: "text-blue-600", bg: "from-blue-100 to-blue-50", emoji: "⭐" },
      5: { label: "Среднее желание", color: "text-purple-600", bg: "from-purple-100 to-purple-50", emoji: "🔮" },
      6: { label: "Усиленное желание", color: "text-purple-600", bg: "from-purple-100 to-purple-50", emoji: "✨" },
      7: { label: "Сильное желание", color: "text-orange-600", bg: "from-orange-100 to-orange-50", emoji: "🔥" },
      8: { label: "Очень сильное желание", color: "text-red-600", bg: "from-red-100 to-red-50", emoji: "💥" },
      9: { label: "Мощное желание", color: "text-red-600", bg: "from-red-100 to-red-50", emoji: "⚡" },
      10: { label: "МАКСИМАЛЬНОЕ ЖЕЛАНИЕ", color: "text-red-700", bg: "from-red-200 to-red-100", emoji: "🌟" },
    };
    return levels[intensity as keyof typeof levels] || levels[5];
  };

  const intensityData = getIntensityData(wishIntensity);

  const generateAffirmations = (wish: string, intensity: number) => {
    const baseAffirmations = [
      "Моё желание обладает мощной энергией и магнетизмом.",
      "Вселенная слышит мои слова и готова исполнить моё желание.",
      "Я достоин(на) получить то, о чём мечтаю.",
      "Каждый день моё желание приближается к исполнению.",
      "Моя вера и энергетический вклад создают реальность.",
      "Я открыт(а) для получения желаемого в лучшем виде.",
    ];

    const intensityAffirmations = intensity >= 7 ? [
      "Моё желание наполнено невероятной силой и страстью.",
      "Энергия моего намерения пронизывает всю вселенную.",
      "Ничто не может остановить исполнение моего желания.",
    ] : [
      "Моё желание растёт и крепнет с каждым днём.",
      "Я терпеливо и с верой жду исполнения желания.",
    ];

    return [...baseAffirmations, ...intensityAffirmations];
  };

  const OfficialSeal = () => (
    <div className="relative w-32 h-32 mx-auto">
      {/* Внешнее кольцо печати */}
      <div className="absolute inset-0 rounded-full border-4 border-red-600 bg-gradient-to-br from-red-50 to-red-100 shadow-lg">
        {/* Внутреннее кольцо */}
        <div className="absolute inset-2 rounded-full border-2 border-red-500 bg-white">
          {/* Центральный элемент */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <div className="text-white text-2xl font-bold">✨</div>
          </div>
          
          {/* Текст по кругу - верх */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
            <span className="text-[8px] font-bold text-red-600">САЙТ ЖЕЛАНИЙ</span>
          </div>
          
          {/* Текст по кругу - низ */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <span className="text-[8px] font-bold text-red-600">ОФИЦИАЛЬНО</span>
          </div>
          
          {/* Левая звездочка */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <span className="text-red-500 text-xs">⭐</span>
          </div>
          
          {/* Правая звездочка */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <span className="text-red-500 text-xs">⭐</span>
          </div>
        </div>
      </div>
      
      {/* Дата в печати */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
        <span className="text-[10px] font-bold text-red-600 bg-white px-1 rounded">
          {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl border-2 border-gray-200">
      {/* Заголовок документа */}
      <div className={`bg-gradient-to-br ${intensityData.bg} p-8 text-center relative overflow-hidden border-b-4 border-red-600`}>
        {/* Декоративные элементы */}
        <div className="absolute top-4 left-4 opacity-20">
          <span className="text-6xl">{intensityData.emoji}</span>
        </div>
        <div className="absolute top-4 right-4 opacity-20">
          <span className="text-6xl">{intensityData.emoji}</span>
        </div>

        {/* Основной заголовок */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📜 ОФИЦИАЛЬНЫЙ ДОКУМЕНТ
          </h1>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            АФФИРМАЦИЯ ЖЕЛАНИЯ
          </h2>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg px-6 py-3 inline-block border-2 border-red-200">
            <p className="text-lg font-semibold text-gray-800">
              Документ №: <span className="font-mono text-red-600">{documentId}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Основная информация */}
      <div className="p-8 md:p-12">
        {/* Информация о желании */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-red-600">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="Heart" size={24} className="text-red-600" />
              Ваше желание
            </h3>
            <p className="text-lg text-gray-700 italic leading-relaxed bg-white p-4 rounded-lg border">
              "{wishText}"
            </p>
          </div>
        </div>

        {/* Уровень силы желания */}
        <div className="mb-8">
          <div className={`bg-gradient-to-r ${intensityData.bg} rounded-xl p-6 border-2 border-gray-200`}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">{intensityData.emoji}</span>
              Уровень силы желания
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-800">{wishIntensity}</span>
                <span className="text-gray-600">из 10</span>
              </div>
              <div className="flex-1">
                <p className={`text-lg font-bold ${intensityData.color}`}>
                  {intensityData.label}
                </p>
                <p className="text-sm text-gray-600">
                  Энергетический вклад: {amount} ₽
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Персональные аффирмации */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Icon name="Sparkles" size={24} className="text-yellow-500" />
            Персональные аффирмации для усиления желания
          </h3>
          <div className="space-y-4">
            {generateAffirmations(wishText, wishIntensity).map((affirmation, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {affirmation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Инструкции */}
        <div className="mb-8 bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icon name="BookOpen" size={24} className="text-yellow-600" />
            Инструкции по использованию
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📅 Ежедневная практика</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Читайте аффирмации утром после пробуждения</li>
                <li>• Повторяйте вечером перед сном</li>
                <li>• Произносите с верой и благодарностью</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">💫 Усиление энергии</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Визуализируйте исполнение желания</li>
                <li>• Чувствуйте радость от достижения цели</li>
                <li>• Благодарите Вселенную заранее</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Официальное заверение */}
        <div className="border-t-2 border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                Официально заверено
              </h4>
              <p className="text-gray-600 mb-1">
                Создано для: <span className="font-semibold">{userName}</span>
              </p>
              {userEmail && (
                <p className="text-gray-600 mb-1">
                  Email: <span className="font-mono text-sm">{userEmail}</span>
                </p>
              )}
              <p className="text-gray-600 mb-4">
                Дата создания: <span className="font-semibold">{createdDate}</span>
              </p>
              <div className="text-sm text-gray-500">
                <p>Энергетически активирован через</p>
                <p className="font-bold text-red-600">САЙТ ЖЕЛАНИЙ</p>
              </div>
            </div>
            
            {/* Официальная печать */}
            <div className="flex-shrink-0">
              <OfficialSeal />
            </div>
          </div>
        </div>

        {/* Подпись документа */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-2">
            Этот документ подтверждает энергетическую активацию вашего желания
          </p>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} САЙТ ЖЕЛАНИЙ • Официальный поставщик энергии для исполнения желаний
          </p>
        </div>
      </div>
    </div>
  );
};

export default WishAffirmationDocument;