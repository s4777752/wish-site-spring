import React, { useEffect, useState } from 'react';

interface PaymentWaitingScreenProps {
  onComplete?: () => void;
}

const PaymentWaitingScreen = ({ onComplete }: PaymentWaitingScreenProps) => {
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([]);
  const [confetti, setConfetti] = useState<Array<{id: number, x: number, y: number, color: string, rotation: number, delay: number}>>([]);

  useEffect(() => {
    // Генерируем звезды
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
    }));
    setStars(newStars);

    // Генерируем конфетти
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#ff7675'];
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      delay: Math.random() * 3
    }));
    setConfetti(newConfetti);

    // Автоматически закрываем через 20 секунд (опционально)
    if (onComplete) {
      const timer = setTimeout(onComplete, 20000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black z-50 flex items-center justify-center overflow-hidden">
      {/* Звезды */}
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
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Конфетти */}
      {confetti.map((piece) => (
        <div
          key={`confetti-${piece.id}`}
          className="absolute animate-bounce"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: '3s',
            animationIterationCount: 'infinite'
          }}
        >
          <div
            className="w-3 h-3 rounded-full shadow-lg animate-spin"
            style={{
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`,
              animationDelay: `${piece.delay}s`,
              animationDuration: '2s'
            }}
          />
        </div>
      ))}

      {/* Пульсирующая надпись */}
      <div className="text-center px-6 relative z-10">
        <h1 className="text-white text-2xl md:text-4xl font-bold mb-6 animate-pulse-scale leading-relaxed">
          Ваше желание будет активировано
          <br />
          после поступления оплаты
          <br />
          <span className="text-yellow-400">ожидайте...</span>
        </h1>
        
        {/* Дополнительные мерцающие звезды вокруг текста */}
        <div className="absolute -top-4 -left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute -top-2 -right-6 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute -bottom-4 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-2 -right-4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
      </div>

      {/* CSS анимация для пульсации текста */}
      <style jsx>{`
        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentWaitingScreen;