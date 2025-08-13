import { useState } from 'react';

interface StarrySplashScreenProps {
  onComplete: () => void;
}

export default function StarrySplashScreen({ onComplete }: StarrySplashScreenProps) {
  const [isBreaking, setIsBreaking] = useState(false);

  const handleClick = () => {
    setIsBreaking(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  // Создаем массив звезд
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.8 + 0.2,
    delay: Math.random() * 2
  }));

  // Создаем осколки стекла
  const fragments = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.5
  }));

  return (
    <div 
      className="fixed inset-0 z-50 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Звездное небо */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950 to-black">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Центральное сияние */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-gradient-radial from-purple-500/20 via-transparent to-transparent rounded-full animate-pulse" />
      </div>

      {/* Текст приглашения */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            ✨ САЙТ ЖЕЛАНИЙ ✨
          </h1>
          <p className="text-xl md:text-2xl opacity-80 animate-fade-in-delay">
            Нажмите, чтобы войти
          </p>
        </div>
      </div>

      {/* Анимация разбития стекла */}
      {isBreaking && (
        <div className="absolute inset-0">
          {fragments.map((fragment) => (
            <div
              key={fragment.id}
              className="absolute w-20 h-20 bg-gradient-to-br from-white/30 to-transparent border border-white/50 animate-glass-break"
              style={{
                left: `${fragment.x}%`,
                top: `${fragment.y}%`,
                transform: `rotate(${fragment.rotation}deg) scale(${fragment.scale})`,
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
              }}
            />
          ))}
          
          {/* Белая вспышка */}
          <div className="absolute inset-0 bg-white animate-flash" />
        </div>
      )}


    </div>
  );
}