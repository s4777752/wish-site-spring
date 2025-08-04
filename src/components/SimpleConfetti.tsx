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

    console.log('Запускаем конфетти!');

    let intervalId: NodeJS.Timeout;

    const createConfetti = () => {
      console.log('Создаём частицу конфетти');
      
      const confetti = document.createElement('div');
      
      // Простые настройки
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-20px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)];
      confetti.style.zIndex = '10000';
      confetti.style.pointerEvents = 'none';
      
      // Простая анимация падения
      confetti.style.transition = 'all 3s linear';
      
      document.body.appendChild(confetti);
      
      // Анимируем падение
      setTimeout(() => {
        confetti.style.top = window.innerHeight + 'px';
        confetti.style.transform = 'rotate(360deg)';
      }, 10);
      
      // Удаляем через 3 секунды
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 3000);
    };

    // Создаём конфетти каждые 300мс
    intervalId = setInterval(() => {
      createConfetti();
    }, 300);
    
    // Сразу создаём первую партию
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createConfetti(), i * 100);
    }

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