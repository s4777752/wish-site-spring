import { useState } from 'react';

interface FinalScreenProps {
  onHome: () => void;
}

const FinalScreen = ({ onHome }: FinalScreenProps) => {
  const [stars] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 2 + 1,
    }))
  );

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center px-6 animate-fade-in">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      <div className="relative text-center max-w-md">
        <div className="text-6xl mb-6">✨</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Ваше желание отправлено во Вселенную</h1>
        <p className="text-lg text-indigo-100 mb-8">
          Документ аффирмации сохранён. Верьте, отпустите и ждите — всё сбудется.
        </p>
        <button
          onClick={onHome}
          className="bg-white text-indigo-900 font-semibold py-3 px-8 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default FinalScreen;
