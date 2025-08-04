import { useEffect } from 'react';

interface ConfettiProps {
  isActive: boolean;
}

const Confetti = ({ isActive }: ConfettiProps) => {
  useEffect(() => {
    if (!isActive) return;

    let intervalId: NodeJS.Timeout;

    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', 
      '#10ac84', '#ee5a6f', '#c44569', '#786fa6', '#f8b500', 
      '#a55eea', '#26de81', '#fd79a8', '#fdcb6e', '#e17055',
      '#FFD700', '#FF69B4', '#00CED1', '#32CD32', '#FF4500'
    ];
    
    const shapes = ['circle', 'square', 'star', 'heart', 'diamond', 'sparkle'];
    const emojis = {
      star: '⭐',
      heart: '💖',
      diamond: '💎',
      sparkle: '✨'
    };

    const createConfettiPiece = () => {
      const confettiPiece = document.createElement('div');
      const size = Math.random() * 15 + 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      confettiPiece.style.position = 'fixed';
      confettiPiece.style.width = size + 'px';
      confettiPiece.style.height = size + 'px';
      confettiPiece.style.left = Math.random() * 100 + '%';
      confettiPiece.style.top = '-50px';
      confettiPiece.style.zIndex = '9999';
      confettiPiece.style.pointerEvents = 'none';
      
      // Применяем форму
      switch(shape) {
        case 'circle':
          confettiPiece.style.backgroundColor = color;
          confettiPiece.style.borderRadius = '50%';
          confettiPiece.style.boxShadow = `0 0 6px ${color}40`;
          break;
        case 'square':
          confettiPiece.style.backgroundColor = color;
          confettiPiece.style.borderRadius = '2px';
          confettiPiece.style.boxShadow = `0 0 6px ${color}40`;
          break;
        case 'star':
        case 'heart':
        case 'diamond':
        case 'sparkle':
          confettiPiece.innerHTML = emojis[shape as keyof typeof emojis];
          confettiPiece.style.fontSize = size + 'px';
          confettiPiece.style.lineHeight = '1';
          confettiPiece.style.textShadow = '0 0 10px rgba(255,255,255,0.8)';
          break;
      }
      
      // Параметры анимации
      const fallDuration = Math.random() * 4 + 3; // от 3s до 7s
      const rotationSpeed = Math.random() * 720 + 360;
      const horizontalDrift = (Math.random() - 0.5) * 300;
      const swayAmount = Math.random() * 50 + 25;
      
      // Уникальная анимация для каждой частицы
      const animationId = `confetti-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const keyframes = `
        @keyframes ${animationId} {
          0% {
            transform: translateY(-50px) translateX(0px) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) translateX(${swayAmount}px) rotate(${rotationSpeed * 0.25}deg);
            opacity: 0.9;
          }
          50% {
            transform: translateY(50vh) translateX(${-swayAmount * 0.5}px) rotate(${rotationSpeed * 0.5}deg);
            opacity: 0.7;
          }
          75% {
            transform: translateY(75vh) translateX(${swayAmount * 0.3}px) rotate(${rotationSpeed * 0.75}deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(110vh) translateX(${horizontalDrift}px) rotate(${rotationSpeed}deg);
            opacity: 0;
          }
        }
      `;
      
      // Добавляем стили
      const styleElement = document.createElement('style');
      styleElement.textContent = keyframes;
      document.head.appendChild(styleElement);
      
      // Применяем анимацию
      confettiPiece.style.animation = `${animationId} ${fallDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
      
      document.body.appendChild(confettiPiece);
      
      // Очистка
      setTimeout(() => {
        if (confettiPiece.parentNode) {
          confettiPiece.parentNode.removeChild(confettiPiece);
        }
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      }, fallDuration * 1000 + 500);
    };

    const createBurst = () => {
      const burstSize = Math.random() * 8 + 5;
      
      for (let i = 0; i < burstSize; i++) {
        setTimeout(() => {
          createConfettiPiece();
        }, i * Math.random() * 100);
      }
    };

    // Запускаем конфетти
    createBurst(); // Начальный взрыв
    
    intervalId = setInterval(() => {
      createBurst();
    }, Math.random() * 400 + 200);
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive]);

  return null;
};

export default Confetti;