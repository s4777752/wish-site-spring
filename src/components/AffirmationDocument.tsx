import React from 'react';
import Icon from '@/components/ui/icon';

interface AffirmationDocumentProps {
  type: 'love' | 'money' | 'health' | 'career' | 'custom';
  customTitle?: string;
  userName: string;
  userDesires: string[];
  createdDate: string;
}

const AffirmationDocument: React.FC<AffirmationDocumentProps> = ({
  type,
  customTitle,
  userName,
  userDesires,
  createdDate
}) => {
  const getTheme = () => {
    switch (type) {
      case 'love':
        return {
          gradient: 'from-pink-100 via-rose-50 to-red-100',
          accent: 'text-rose-600',
          icon: 'Heart',
          title: 'АФФИРМАЦИЯ ЛЮБВИ',
          subtitle: 'Манифестация истинной любви и гармонии',
          decorativeEmoji: '💕'
        };
      case 'money':
        return {
          gradient: 'from-green-100 via-emerald-50 to-teal-100',
          accent: 'text-emerald-600',
          icon: 'DollarSign',
          title: 'АФФИРМАЦИЯ БОГАТСТВА',
          subtitle: 'Манифестация финансового изобилия',
          decorativeEmoji: '💰'
        };
      case 'health':
        return {
          gradient: 'from-blue-100 via-sky-50 to-cyan-100',
          accent: 'text-blue-600',
          icon: 'Heart',
          title: 'АФФИРМАЦИЯ ЗДОРОВЬЯ',
          subtitle: 'Манифестация крепкого здоровья и энергии',
          decorativeEmoji: '🌿'
        };
      case 'career':
        return {
          gradient: 'from-purple-100 via-violet-50 to-indigo-100',
          accent: 'text-purple-600',
          icon: 'Star',
          title: 'АФФИРМАЦИЯ УСПЕХА',
          subtitle: 'Манифестация карьерного роста и достижений',
          decorativeEmoji: '🚀'
        };
      default:
        return {
          gradient: 'from-amber-100 via-yellow-50 to-orange-100',
          accent: 'text-amber-600',
          icon: 'Sparkles',
          title: customTitle?.toUpperCase() || 'ПЕРСОНАЛЬНАЯ АФФИРМАЦИЯ',
          subtitle: 'Манифестация ваших желаний',
          decorativeEmoji: '✨'
        };
    }
  };

  const theme = getTheme();

  const getLoveAffirmations = () => [
    "Я достоин(на) безусловной и искренней любви.",
    "Моё сердце открыто для получения и дарения любви.",
    "Любовь приходит ко мне легко и естественно.",
    "Я привлекаю гармоничные и здоровые отношения.",
    "Моя вторая половинка уже идёт навстречу мне.",
    "Я излучаю любовь и притягиваю любящего партнёра.",
    "Каждый день я становлюсь более привлекательным(ой).",
    "Вселенная поддерживает мои желания в любви.",
    "Я готов(а) к глубокой и взаимной любви.",
    "Любовь наполняет каждый аспект моей жизни."
  ];

  const getDefaultAffirmations = () => {
    if (type === 'love') return getLoveAffirmations();
    return userDesires;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl">
      {/* Верхний декоративный фон */}
      <div className={`bg-gradient-to-br ${theme.gradient} p-8 text-center relative overflow-hidden`}>
        {/* Декоративные элементы */}
        <div className="absolute top-4 left-4 opacity-20">
          <span className="text-6xl">{theme.decorativeEmoji}</span>
        </div>
        <div className="absolute top-4 right-4 opacity-20">
          <span className="text-6xl">{theme.decorativeEmoji}</span>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-10">
          <span className="text-8xl">{theme.decorativeEmoji}</span>
        </div>

        {/* Заголовок */}
        <div className="relative z-10">
          <div className={`inline-flex items-center gap-3 mb-4 ${theme.accent}`}>
            <Icon name={theme.icon} size={32} />
            <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
              {theme.title}
            </h1>
            <Icon name={theme.icon} size={32} />
          </div>
          <p className={`text-lg ${theme.accent} opacity-80 mb-6`}>
            {theme.subtitle}
          </p>
          <div className="bg-white/30 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
            <p className="text-gray-700 font-medium">
              Создано для: <span className={`${theme.accent} font-bold`}>{userName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="p-8 md:p-12">
        {/* Введение */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ваши Персональные Аффирмации
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Эти аффирмации созданы специально для вас. Повторяйте их каждый день 
            с верой и благодарностью. Вселенная слышит каждое ваше слово и готова 
            исполнить ваши самые сокровенные желания.
          </p>
        </div>

        {/* Аффирмации */}
        <div className="space-y-6 mb-12">
          {getDefaultAffirmations().map((affirmation, index) => (
            <div 
              key={index}
              className={`
                flex items-start gap-4 p-6 rounded-xl 
                bg-gradient-to-r ${theme.gradient}
                border border-gray-200 shadow-sm
                hover:shadow-md transition-shadow
              `}
            >
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full ${theme.accent} 
                bg-white flex items-center justify-center font-bold
              `}>
                {index + 1}
              </div>
              <p className="text-gray-800 text-lg leading-relaxed font-medium">
                {affirmation}
              </p>
            </div>
          ))}
        </div>

        {/* Инструкции */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icon name="BookOpen" size={24} />
            Как использовать аффирмации
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Icon name="Clock" size={20} className="text-blue-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Утром</p>
                  <p className="text-gray-600 text-sm">Произносите после пробуждения</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Moon" size={20} className="text-purple-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Вечером</p>
                  <p className="text-gray-600 text-sm">Повторяйте перед сном</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Icon name="Volume2" size={20} className="text-green-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Вслух</p>
                  <p className="text-gray-600 text-sm">Произносите с уверенностью</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Heart" size={20} className="text-red-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">С чувством</p>
                  <p className="text-gray-600 text-sm">Верьте в каждое слово</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Подпись и дата */}
        <div className="text-center border-t border-gray-200 pt-8">
          <div className="inline-flex items-center gap-4 text-gray-500">
            <Icon name="Calendar" size={20} />
            <span>Создано: {createdDate}</span>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            © {new Date().getFullYear()} САЙТ ЖЕЛАНИЙ • Ваши мечты становятся реальностью
          </p>
        </div>
      </div>
    </div>
  );
};

export default AffirmationDocument;