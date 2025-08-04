import { useEffect } from 'react';

interface SimpleConfettiProps {
  isActive: boolean;
}

const SimpleConfetti = ({ isActive }: SimpleConfettiProps) => {
  useEffect(() => {
    console.log('Confetti useEffect вызван, isActive:', isActive);
    
    if (!isActive) {
      console.log('Конфетти не активно, выходим');
      return;
    }

    console.log('Запускаем небольшое плавное конфетти!');

    let intervalId: NodeJS.Timeout;

    // Разные яркие цвета
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#10AC84', '#EE5A6F', '#C44569', '#786FA6', '#F8B500',
      '#A55EEA', '#26DE81', '#FD79A8', '#FDCB6E', '#E17055'
    ];

    // Разные формы
    const shapes = [
      { type: 'circle' },
      { type: 'square' },
      { type: 'triangle' },
      { type: 'star' },
      { type: 'heart' },
      { type: 'diamond' }
    ];

    const createConfetti = () => {
      const confetti = document.createElement('div');
      
      // Параметры для небольшого конфетти
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 4 + 4; // маленький размер: от 4px до 8px
      const startX = Math.random() * 100;
      const fallDuration = 10000; // ОДИНАКОВАЯ плавная скорость - 10 секунд для всех
      const rotationSpeed = 360; // одинаковое плавное вращение
      const horizontalDrift = 0; // БЕЗ бокового движения - только прямое падение
      
      // Базовые стили
      confetti.style.position = 'fixed';
      confetti.style.left = startX + '%';
      confetti.style.top = '-30px';
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';
      confetti.style.zIndex = '10000';
      confetti.style.pointerEvents = 'none';
      confetti.style.userSelect = 'none';
      
      // Применяем разные формы
      switch(shape.type) {
        case 'circle':
          confetti.style.backgroundColor = color;
          confetti.style.borderRadius = '50%';
          confetti.style.boxShadow = `0 0 8px ${color}50`;
          break;
        case 'square':
          confetti.style.backgroundColor = color;
          confetti.style.borderRadius = '2px';
          confetti.style.boxShadow = `0 0 8px ${color}50`;
          break;
        case 'triangle':
          confetti.style.width = '0';
          confetti.style.height = '0';
          confetti.style.borderLeft = size/2 + 'px solid transparent';
          confetti.style.borderRight = size/2 + 'px solid transparent';
          confetti.style.borderBottom = size + 'px solid ' + color;
          confetti.style.filter = `drop-shadow(0 0 6px ${color}50)`;
          break;
        case 'star':
          confetti.innerHTML = '⭐';
          confetti.style.fontSize = size + 'px';
          confetti.style.lineHeight = '1';
          confetti.style.color = color;
          confetti.style.filter = `drop-shadow(0 0 6px ${color}60)`;
          break;
        case 'heart':
          confetti.innerHTML = '💖';
          confetti.style.fontSize = size + 'px';
          confetti.style.lineHeight = '1';
          confetti.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
          break;
        case 'diamond':
          confetti.style.backgroundColor = color;
          confetti.style.width = size + 'px';
          confetti.style.height = size + 'px';
          confetti.style.transform = 'rotate(45deg)';
          confetti.style.boxShadow = `0 0 8px ${color}50`;
          break;
      }
      
      // Создаём ИДЕАЛЬНО плавную анимацию БЕЗ рывков
      const animationId = `confetti-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const keyframes = `
        @keyframes ${animationId} {
          0% {
            transform: translateY(-30px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) translateX(0px) rotate(${rotationSpeed}deg);
            opacity: 0;
          }
        }
      `;
      
      // Добавляем стили
      const styleElement = document.createElement('style');
      styleElement.textContent = keyframes;
      document.head.appendChild(styleElement);
      
      // Применяем ЛИНЕЙНУЮ анимацию без ускорений
      confetti.style.animation = `${animationId} ${fallDuration}ms linear forwards`;
      
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

    const createConfettiBurst = () => {
      // Создаём небольшую группу конфетти
      const burstSize = Math.random() * 3 + 2; // от 2 до 5 частиц
      
      for (let i = 0; i < burstSize; i++) {
        setTimeout(() => {
          createConfetti();
        }, i * Math.random() * 300); // плавные интервалы
      }
    };

    // Создаём конфетти с приятными интервалами
    intervalId = setInterval(() => {
      createConfettiBurst();
    }, Math.random() * 800 + 600); // от 600мс до 1400мс между группами
    
    // Сразу создаём первую группу
    createConfettiBurst();

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