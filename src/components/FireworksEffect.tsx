import React, { useEffect, useState } from 'react';

interface FireworksEffectProps {
  onComplete?: () => void;
}

const FireworksEffect: React.FC<FireworksEffectProps> = ({ onComplete }) => {
  const [fireworks, setFireworks] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    particles: Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
    }>;
  }>>([]);

  useEffect(() => {
    let animationId: number;
    let fireworkId = 0;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#ff7675'];
    
    const createFirework = () => {
      const newFirework = {
        id: fireworkId++,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight * (0.3 + Math.random() * 0.4),
        color: colors[Math.floor(Math.random() * colors.length)],
        particles: []
      };

      // Создаем частицы
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 2 + Math.random() * 3;
        newFirework.particles.push({
          id: i,
          x: newFirework.x,
          y: newFirework.y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      setFireworks(prev => [...prev, newFirework]);

      // Убираем фейерверк через 3 секунды
      setTimeout(() => {
        setFireworks(prev => prev.filter(fw => fw.id !== newFirework.id));
      }, 3000);
    };

    // Запускаем фейерверки
    const intervals = [
      setTimeout(() => createFirework(), 500),
      setTimeout(() => createFirework(), 800),
      setTimeout(() => createFirework(), 1200),
      setTimeout(() => createFirework(), 1600),
      setTimeout(() => createFirework(), 2000),
      setTimeout(() => createFirework(), 2400),
      setTimeout(() => createFirework(), 2800),
      setTimeout(() => createFirework(), 3200)
    ];

    // Завершаем через 5 секунд
    const completeTimeout = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 5000);

    return () => {
      intervals.forEach(clearTimeout);
      clearTimeout(completeTimeout);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black z-50 overflow-hidden">
      {/* Звезды на фоне */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Фейерверки */}
      {fireworks.map((firework) => (
        <div key={firework.id} className="absolute">
          {firework.particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                backgroundColor: particle.color,
                left: `${particle.x + particle.vx * 50}px`,
                top: `${particle.y + particle.vy * 50}px`,
                boxShadow: `0 0 10px ${particle.color}`,
                animationDuration: '0.5s',
                animationIterationCount: '3'
              }}
            />
          ))}
        </div>
      ))}

      {/* Центральный текст */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 animate-bounce">
          <div className="text-8xl mb-4 animate-pulse">🎆</div>
          <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
            Поздравляем!
          </h1>
          <p className="text-2xl text-yellow-300 animate-pulse">
            Ваше желание отправлено во Вселенную!
          </p>
          <div className="flex justify-center space-x-4 text-4xl animate-bounce">
            <span>✨</span>
            <span>🌟</span>
            <span>💫</span>
            <span>⭐</span>
          </div>
        </div>
      </div>

      {/* Дополнительные эффекты */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-400 to-transparent opacity-30 animate-pulse"></div>
      
      {/* Конфетти */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random()}s`
          }}
        >
          <span className="text-2xl">
            {['🎉', '🎊', '✨', '🌟', '💎', '🎈'][Math.floor(Math.random() * 6)]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FireworksEffect;