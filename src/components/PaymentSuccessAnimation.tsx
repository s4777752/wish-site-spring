import { useState, useEffect } from 'react';

interface PaymentSuccessAnimationProps {
  onComplete?: () => void;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

const PaymentSuccessAnimation = ({ onComplete }: PaymentSuccessAnimationProps) => {
  const [stage, setStage] = useState<'flashes' | 'stars' | 'complete'>('flashes');
  const [flashCount, setFlashCount] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Генерируем звёзды
    const generateStars = () => {
      const starCount = 200;
      const newStars: Star[] = [];
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          delay: Math.random() * 3
        });
      }
      
      setStars(newStars);
    };

    generateStars();

    // Запускаем последовательность 3 вспышек
    const flashInterval = setInterval(() => {
      setFlashCount(prev => {
        if (prev >= 2) {
          clearInterval(flashInterval);
          setTimeout(() => setStage('stars'), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(flashInterval);
  }, []);

  const handleStarsClick = () => {
    setStage('complete');
    if (onComplete) {
      setTimeout(onComplete, 300);
    }
  };

  if (stage === 'complete') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 3 вспышки */}
      {stage === 'flashes' && (
        <div className="absolute inset-0">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-white transition-opacity duration-300 ${
                index === flashCount ? 'opacity-90 animate-pulse' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      )}

      {/* Звёздное небо с текстом */}
      {stage === 'stars' && (
        <div 
          className="absolute inset-0 bg-black cursor-pointer"
          onClick={handleStarsClick}
        >
          {/* Звезды */}
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white animate-star-twinkle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDelay: `${star.delay}s`,
                boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.9), 0 0 ${star.size * 6}px rgba(255, 255, 255, 0.4)`,
                background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 70%, rgba(255, 255, 255, 0.3) 100%)'
              }}
            />
          ))}
          
          {/* Центральное сияние */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-96 h-96 rounded-full opacity-20 animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)'
              }}
            />
          </div>

          {/* Текст */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-zoom-in animate-pulse-scale text-green-400">
              ОПЛАЧЕНО
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold mb-8 animate-zoom-in animate-pulse-scale" style={{ animationDelay: '0.5s' }}>
              ВАШЕ ЖЕЛАНИЕ АКТИВИРОВАНО
            </h2>
            <p className="text-lg md:text-xl opacity-80 animate-bounce" style={{ animationDelay: '1s' }}>
              Нажмите, чтобы продолжить
            </p>
          </div>

          {/* Дополнительные эффекты */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Падающие звёзды */}
            {[...Array(2)].map((_, index) => (
              <div
                key={`falling-star-${index}`}
                className="absolute animate-falling-star"
                style={{
                  animationDelay: `${2 + index * 3}s`,
                  top: `${Math.random() * 30}%`,
                  right: `${Math.random() * 30}%`
                }}
              >
                <div
                  className="absolute bg-white rounded-full"
                  style={{
                    width: '4px',
                    height: '4px',
                    boxShadow: '0 0 12px rgba(255, 255, 255, 0.9), 0 0 24px rgba(255, 255, 255, 0.4)'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessAnimation;