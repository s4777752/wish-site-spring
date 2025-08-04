import { useEffect } from 'react';

interface SimpleConfettiProps {
  isActive: boolean;
}

const SimpleConfetti = ({ isActive }: SimpleConfettiProps) => {
  useEffect(() => {
    console.log('SimpleConfetti useEffect вызван, isActive:', isActive);
    
    if (!isActive) {
      console.log('Конфетти не активно, выходим');
      return;
    }

    console.log('Запускаем красивое конфетти!');

    let intervalId: NodeJS.Timeout;

    // 25+ ярких цветов
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#10AC84', '#EE5A6F', '#C44569', '#786FA6', '#F8B500',
      '#A55EEA', '#26DE81', '#FD79A8', '#FDCB6E', '#E17055',
      '#FFD700', '#FF69B4', '#00CED1', '#32CD32', '#FF4500',
      '#DA70D6', '#87CEEB', '#FFA500', '#FF1493', '#00FF7F'
    ];

    // Разные фигуры
    const shapes = [
      { type: 'circle', emoji: null },
      { type: 'square', emoji: null },
      { type: 'emoji', emoji: '⭐' },
      { type: 'emoji', emoji: '💖' },
      { type: 'emoji', emoji: '💎' },
      { type: 'emoji', emoji: '✨' },
      { type: 'emoji', emoji: '🎉' },
      { type: 'emoji', emoji: '🌟' },
      { type: 'emoji', emoji: '🎊' },
      { type: 'emoji', emoji: '💫' }
    ];

    const createConfetti = () => {
      const confetti = document.createElement('div');
      
      // Случайные параметры
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 20 + 10; // от 10px до 30px
      const startX = Math.random() * 100;
      const fallDuration = Math.random() * 8000 + 6000; // от 6 до 14 секунд (медленно!)
      const rotationSpeed = Math.random() * 720 + 360; // от 360° до 1080°
      const horizontalDrift = (Math.random() - 0.5) * 300; // боковое движение
      
      // Базовые стили
      confetti.style.position = 'fixed';
      confetti.style.left = startX + '%';
      confetti.style.top = '-50px';
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';
      confetti.style.zIndex = '10000';
      confetti.style.pointerEvents = 'none';
      
      // Применяем форму
      if (shape.type === 'circle') {
        confetti.style.backgroundColor = color;
        confetti.style.borderRadius = '50%';
        confetti.style.boxShadow = `0 0 10px ${color}60`;
      } else if (shape.type === 'square') {
        confetti.style.backgroundColor = color;
        confetti.style.borderRadius = '3px';
        confetti.style.boxShadow = `0 0 10px ${color}60`;
      } else if (shape.type === 'emoji') {
        confetti.innerHTML = shape.emoji || '⭐';
        confetti.style.fontSize = size + 'px';
        confetti.style.lineHeight = '1';
        confetti.style.textShadow = '0 0 15px rgba(255,255,255,0.8)';
        confetti.style.display = 'flex';
        confetti.style.alignItems = 'center';
        confetti.style.justifyContent = 'center';
      }
      
      // Создаём уникальную анимацию для каждой частицы
      const animationId = `confetti-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const swayAmount = Math.random() * 100 + 50; // качание из стороны в сторону
      
      const keyframes = `
        @keyframes ${animationId} {
          0% {
            transform: translateY(-50px) translateX(0px) rotate(0deg);
            opacity: 1;
          }
          20% {
            transform: translateY(20vh) translateX(${swayAmount * 0.3}px) rotate(${rotationSpeed * 0.2}deg);
            opacity: 0.95;
          }
          40% {
            transform: translateY(40vh) translateX(${-swayAmount * 0.5}px) rotate(${rotationSpeed * 0.4}deg);
            opacity: 0.9;
          }
          60% {
            transform: translateY(60vh) translateX(${swayAmount * 0.7}px) rotate(${rotationSpeed * 0.6}deg);
            opacity: 0.8;
          }
          80% {
            transform: translateY(80vh) translateX(${-swayAmount * 0.3}px) rotate(${rotationSpeed * 0.8}deg);
            opacity: 0.6;
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
      
      // Применяем анимацию с медленной скоростью
      confetti.style.animation = `${animationId} ${fallDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
      
      document.body.appendChild(confetti);
      
      // Удаляем элемент после анимации
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      }, fallDuration + 1000);
    };

    const createBurst = () => {
      // Создаём группу из 4-8 частиц
      const burstSize = Math.random() * 5 + 4;
      
      for (let i = 0; i < burstSize; i++) {
        setTimeout(() => {
          createConfetti();
        }, i * Math.random() * 200);
      }
    };

    // Создаём конфетти с разными интервалами
    intervalId = setInterval(() => {
      createBurst();
    }, Math.random() * 600 + 400); // от 400мс до 1000мс между взрывами
    
    // Сразу создаём первую волну
    createBurst();

    return () => {
      console.log('Очищаем интервал конфетти');
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive]);

  return null;
};

export default SimpleConfetti;