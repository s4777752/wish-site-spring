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

  const [fallingStars] = useState(() =>
    Array.from({ length: 1 }, (_, i) => ({
      id: i,
      animationDelay: Math.random() * 10 + 3, // от 3 до 13 секунд
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

      {/* Падающие звёзды */}
      {!isBreaking && fallingStars.map(star => (
        <div
          key={`falling-star-${star.id}`}
          className="absolute animate-falling-star pointer-events-none"
          style={{
            animationDelay: `${star.animationDelay}s`,
            opacity: star.opacity,
            top: `${Math.random() * 30}%`,
            right: `${Math.random() * 30}%`
          }}
        >
          {/* Ядро звезды без хвоста */}
          <div
            className="absolute bg-white rounded-full"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 ${star.size * 4}px rgba(255, 255, 255, 0.9), 0 0 ${star.size * 8}px rgba(255, 255, 255, 0.4)`
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
        <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-zoom-in animate-pulse-scale bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 bg-clip-text text-transparent animate-pulse shadow-2xl" style={{
          textShadow: '0 0 20px rgba(255, 255, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 255, 255, 0.4)',
          filter: 'drop-shadow(0 0 10px rgba(255, 255, 0, 0.9))'
        }}>
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