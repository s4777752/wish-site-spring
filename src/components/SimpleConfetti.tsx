import { useEffect } from 'react';

interface SimpleConfettiProps {
  isActive: boolean;
}

const SimpleConfetti = ({ isActive }: SimpleConfettiProps) => {
  useEffect(() => {
    console.log('Snow useEffect вызван, isActive:', isActive);
    
    if (!isActive) {
      console.log('Снег не активен, выходим');
      return;
    }

    console.log('Запускаем красивый снег!');

    let intervalId: NodeJS.Timeout;

    // Снежные символы
    const snowflakes = ['❄️', '❅', '❆', '⛄', '🌨️', '☃️', '❄', '✻', '✼', '❋'];
    
    // Нежные зимние цвета
    const colors = [
      '#FFFFFF', '#F0F8FF', '#E6F3FF', '#DDEEFF', '#CCE7FF',
      '#B3D9FF', '#87CEEB', '#ADD8E6', '#E0F6FF', '#F5FAFF',
      '#FFFFFF', '#FAFAFA', '#F8F8FF', '#F0F0F0'
    ];

    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      
      // Случайные параметры для каждой снежинки
      const snowSymbol = snowflakes[Math.floor(Math.random() * snowflakes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 15 + 8; // от 8px до 23px
      const startX = Math.random() * 100;
      const fallDuration = Math.random() * 15000 + 10000; // от 10 до 25 секунд (очень медленно)
      const rotationSpeed = Math.random() * 180 + 90; // мягкое вращение от 90° до 270°
      const horizontalDrift = (Math.random() - 0.5) * 150; // плавное боковое движение
      
      // Базовые стили
      snowflake.style.position = 'fixed';
      snowflake.style.left = startX + '%';
      snowflake.style.top = '-50px';
      snowflake.style.width = size + 'px';
      snowflake.style.height = size + 'px';
      snowflake.style.zIndex = '10000';
      snowflake.style.pointerEvents = 'none';
      snowflake.style.userSelect = 'none';
      
      // Стилизация снежинки
      snowflake.innerHTML = snowSymbol;
      snowflake.style.fontSize = size + 'px';
      snowflake.style.color = color;
      snowflake.style.lineHeight = '1';
      snowflake.style.textShadow = '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(200,230,255,0.5)';
      snowflake.style.display = 'flex';
      snowflake.style.alignItems = 'center';
      snowflake.style.justifyContent = 'center';
      snowflake.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.7))';
      
      // Создаём уникальную плавную анимацию
      const animationId = `snow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const swayAmount = Math.random() * 60 + 30; // плавное качание
      const swaySpeed = Math.random() * 2 + 1; // скорость качания
      
      const keyframes = `
        @keyframes ${animationId} {
          0% {
            transform: translateY(-50px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          25% {
            transform: translateY(25vh) translateX(${Math.sin(swaySpeed * 0.25) * swayAmount}px) rotate(${rotationSpeed * 0.25}deg);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) translateX(${Math.sin(swaySpeed * 0.5) * swayAmount}px) rotate(${rotationSpeed * 0.5}deg);
            opacity: 0.9;
          }
          75% {
            transform: translateY(75vh) translateX(${Math.sin(swaySpeed * 0.75) * swayAmount}px) rotate(${rotationSpeed * 0.75}deg);
            opacity: 0.7;
          }
          90% {
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
      
      // Применяем плавную анимацию
      snowflake.style.animation = `${animationId} ${fallDuration}ms cubic-bezier(0.15, 0.5, 0.3, 0.9) forwards`;
      
      document.body.appendChild(snowflake);
      
      // Удаляем элемент после анимации
      setTimeout(() => {
        if (snowflake.parentNode) {
          snowflake.parentNode.removeChild(snowflake);
        }
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      }, fallDuration + 2000);
    };

    const createSnowBurst = () => {
      // Создаём небольшую группу снежинок
      const burstSize = Math.random() * 3 + 2; // от 2 до 5 снежинок
      
      for (let i = 0; i < burstSize; i++) {
        setTimeout(() => {
          createSnowflake();
        }, i * Math.random() * 500); // плавные интервалы
      }
    };

    // Создаём снег с приятными интервалами
    intervalId = setInterval(() => {
      createSnowBurst();
    }, Math.random() * 1200 + 800); // от 800мс до 2000мс между группами
    
    // Сразу создаём первые снежинки
    createSnowBurst();
    
    // Добавляем дополнительные снежинки через небольшие интервалы
    setTimeout(() => createSnowBurst(), 500);
    setTimeout(() => createSnowBurst(), 1000);

    return () => {
      console.log('Очищаем интервал снега');
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive]);

  return null;
};

export default SimpleConfetti;