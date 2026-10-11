import { useState } from 'react';
import Fireworks from '@/components/Fireworks';

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
      <Fireworks />
      <div className="relative text-center max-w-4xl">
        <style>{`@keyframes grow-shrink{0%,100%{transform:scale(0.92)}50%{transform:scale(1.08)}}@keyframes soft-shimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`}</style>
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 whitespace-nowrap bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(90deg, #e2e8f0, #93a8e8, #a78bdb, #93a8e8, #e2e8f0)',
            backgroundSize: '300% 100%',
            animation: 'soft-shimmer 6s ease-in-out infinite, grow-shrink 2s ease-in-out infinite',
          }}
        >
          АКТИВАЦИЯ ЖЕЛАНИЯ
        </h1>
        <p className="text-lg text-indigo-100 mb-8 animate-text-pulse">
        </p>
        <button
          onClick={onHome}
          className="bg-white text-indigo-900 font-medium text-xs py-1 px-3 rounded-md hover:bg-indigo-50 transition-colors"
        >
          Вернутьсяна главную
        </button>
      </div>
    </div>
  );
};

export default FinalScreen;