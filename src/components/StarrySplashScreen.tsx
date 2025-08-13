import { useState, useEffect } from 'react';

interface StarrySplashScreenProps {
  onComplete: () => void;
}

const StarrySplashScreen = ({ onComplete }: StarrySplashScreenProps) => {
  const [isBreaking, setIsBreaking] = useState(false);
  const [stars] = useState(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 3,
      size: Math.random() * 2 + 1
    }))
  );

  const [comets] = useState(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      animationDelay: Math.random() * 15 + 5, // от 5 до 20 секунд
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.5
    }))
  );

  const [fragments] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: 45 + Math.random() * 10,
      top: 45 + Math.random() * 10,
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 20,
      velocityY: (Math.random() - 0.5) * 20,
    }))
  );

  const handleClick = () => {
    setIsBreaking(true);
    setTimeout(onComplete, 1500);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 cursor-pointer transition-opacity duration-500 ${
        isBreaking ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClick}
      style={{
        background: 'radial-gradient(circle at center, #000000 0%, #000000 50%, #000000 100%)'
      }}
    >
      {/* Звезды */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-star-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.animationDelay}s`,
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.9), 0 0 ${star.size * 6}px rgba(255, 255, 255, 0.4)`,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 70%, rgba(255, 255, 255, 0.3) 100%)'
          }}
        />
      ))}

      {/* Кометы */}
      {!isBreaking && comets.map(comet => (
        <div
          key={`comet-${comet.id}`}
          className="absolute animate-comet pointer-events-none"
          style={{
            animationDelay: `${comet.animationDelay}s`,
            opacity: comet.opacity
          }}
        >
          {/* Ядро кометы */}
          <div
            className="absolute bg-white rounded-full"
            style={{
              width: `${comet.size}px`,
              height: `${comet.size}px`,
              boxShadow: `0 0 ${comet.size * 2}px rgba(255, 255, 255, 0.8)`
            }}
          />
          {/* Хвост кометы */}
          <div
            className="absolute bg-gradient-to-r from-white/80 via-white/40 to-transparent"
            style={{
              width: `${comet.size * 15}px`,
              height: `${comet.size / 2}px`,
              left: `${-comet.size * 15}px`,
              top: `${comet.size / 4}px`,
              borderRadius: `${comet.size * 2}px`,
              filter: 'blur(1px)'
            }}
          />
        </div>
      ))}

      {/* Центральное сияние */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)'
          }}
        />
      </div>

      {/* Текст приглашения */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-zoom-in animate-pulse-scale">
          САЙТ ЖЕЛАНИЙ
        </h1>
        <p className="text-xl md:text-2xl opacity-80 animate-bounce">
          Нажмите, чтобы войти
        </p>
      </div>

      {/* Эффект разбития стекла */}
      {isBreaking && (
        <>
          {/* Белая вспышка */}
          <div className="absolute inset-0 bg-white animate-flash" />
          
          {/* Осколки стекла */}
          {fragments.map(fragment => (
            <div
              key={fragment.id}
              className="absolute w-8 h-8 bg-gradient-to-br from-white via-blue-100 to-transparent opacity-80 animate-glass-break"
              style={{
                left: `${fragment.left}%`,
                top: `${fragment.top}%`,
                transform: `rotate(${fragment.rotation}deg)`,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                animationDelay: `${Math.random() * 0.3}s`,
                '--velocity-x': `${fragment.velocityX}vw`,
                '--velocity-y': `${fragment.velocityY}vh`
              } as React.CSSProperties}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default StarrySplashScreen;