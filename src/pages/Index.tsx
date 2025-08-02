import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import Analytics from '@/components/Analytics';
import WishForm from '@/components/WishForm';
import PaymentSection from '@/components/PaymentSection';
import PaymentMethods from '@/components/PaymentMethods';
import RulesSection from '@/components/RulesSection';

const Index = () => {
  const [wish, setWish] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [wishIntensity, setWishIntensity] = useState(5);
  const [showConfetti, setShowConfetti] = useState(false);

  // Функция для расчета суммы по интенсивности
  const getAmountFromIntensity = (intensity: number) => intensity * 100;
  
  // Функция для получения цвета по интенсивности (от светло-зеленого до темно-зеленого)
  const getColorFromIntensity = (intensity: number) => {
    const lightGreen = { r: 144, g: 238, b: 144 }; // светло-зеленый
    const darkGreen = { r: 0, g: 100, b: 0 }; // темно-зеленый
    
    const ratio = (intensity - 1) / 9; // нормализуем от 0 до 1
    
    const r = Math.round(lightGreen.r + (darkGreen.r - lightGreen.r) * ratio);
    const g = Math.round(lightGreen.g + (darkGreen.g - lightGreen.g) * ratio);
    const b = Math.round(lightGreen.b + (darkGreen.b - lightGreen.b) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handlePayment = () => {
    setShowConfetti(true);
    
    // Отслеживаем исполнение желания в аналитике
    const amount = getAmountFromIntensity(wishIntensity);
    if (window.trackWish) {
      window.trackWish(amount, wishIntensity);
    }
  };

  useEffect(() => {
    let confettiInterval: NodeJS.Timeout;
    
    if (showConfetti) {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a6f', '#c44569', '#786fa6', '#f8b500', '#a55eea', '#26de81', '#fd79a8', '#fdcb6e', '#e17055'];
      const shapes = ['circle', 'square', 'star', 'heart', 'diamond'];
      
      const createConfetti = () => {
        const confettiPiece = document.createElement('div');
        const size = Math.random() * 12 + 6; // от 6px до 18px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        confettiPiece.style.position = 'fixed';
        confettiPiece.style.width = size + 'px';
        confettiPiece.style.height = size + 'px';
        confettiPiece.style.left = Math.random() * 100 + '%';
        confettiPiece.style.top = '-30px';
        confettiPiece.style.zIndex = '1000';
        confettiPiece.style.pointerEvents = 'none';
        
        // Разные фигуры
        switch(shape) {
          case 'circle':
            confettiPiece.style.backgroundColor = color;
            confettiPiece.style.borderRadius = '50%';
            break;
          case 'square':
            confettiPiece.style.backgroundColor = color;
            confettiPiece.style.borderRadius = '0';
            break;
          case 'star':
            confettiPiece.innerHTML = '⭐';
            confettiPiece.style.fontSize = size + 'px';
            confettiPiece.style.lineHeight = '1';
            break;
          case 'heart':
            confettiPiece.innerHTML = '💖';
            confettiPiece.style.fontSize = size + 'px';
            confettiPiece.style.lineHeight = '1';
            break;
          case 'diamond':
            confettiPiece.innerHTML = '💎';
            confettiPiece.style.fontSize = size + 'px';
            confettiPiece.style.lineHeight = '1';
            break;
        }
        
        // Разная скорость падения
        const duration = Math.random() * 6 + 2; // от 2s до 8s
        const rotationSpeed = Math.random() * 1440 + 360; // от 360° до 1800°
        const horizontalDrift = (Math.random() - 0.5) * 200; // боковое движение
        
        // Создаем уникальную анимацию для каждого элемента
        const animationName = `confetti-fall-${Date.now()}-${Math.random()}`;
        const keyframes = `
          @keyframes ${animationName} {
            0% {
              transform: translateY(-30px) translateX(0px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) translateX(${horizontalDrift}px) rotate(${rotationSpeed}deg);
              opacity: 0.2;
            }
          }
        `;
        
        // Добавляем keyframes в стили
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        confettiPiece.style.animation = `${animationName} ${duration}s ease-in infinite`;
        
        document.body.appendChild(confettiPiece);
        
        // Удаляем элемент и стили после анимации
        setTimeout(() => {
          if (confettiPiece.parentNode) {
            confettiPiece.parentNode.removeChild(confettiPiece);
          }
          if (style.parentNode) {
            style.parentNode.removeChild(style);
          }
        }, duration * 1000);
      };
      
      // Создаем конфетти с разной частотой
      const createBurst = () => {
        // Создаем группу из 3-8 элементов сразу
        const burstSize = Math.random() * 6 + 3;
        for (let i = 0; i < burstSize; i++) {
          setTimeout(createConfetti, i * 50);
        }
      };
      
      // Создаем взрывы конфетти каждые 200-500мс
      const scheduleNext = () => {
        const delay = Math.random() * 300 + 200;
        setTimeout(() => {
          if (showConfetti) {
            createBurst();
            scheduleNext();
          }
        }, delay);
      };
      
      scheduleNext();
    }
    
    return () => {
      if (confettiInterval) {
        clearInterval(confettiInterval);
      }
    };
  }, [showConfetti]);

  const handleWishSubmit = () => {
    if (wish.trim()) {
      setShowPayment(true);
    }
  };

  return (
    <>
      {/* SEO компоненты */}
      <SEO 
        title="🪄 Сайт желаний - Исполни своё желание | сайт-желаний.рф"
        description="Загадайте желание и поверьте в его исполнение. Энергетический вклад через безопасную оплату. Тысячи исполненных желаний на сайт-желаний.рф"
        keywords="желания, исполнение желаний, загадать желание, магия, энергия, исполнить мечту, сайт желаний"
        canonical="https://сайт-желаний.рф"
      />
      <StructuredData 
        type="WebSite"
        name="Сайт желаний"
        description="Загадайте желание и поверьте в его исполнение. Энергетический вклад через безопасную оплату."
        url="https://сайт-желаний.рф"
      />
      <Analytics 
        googleAnalyticsId="G-XXXXXXXXXX"
        yandexMetrikaId="12345678"
        environment="production"
      />
      
      <style>{`
        /* Базовые стили для конфетти будут создаваться динамически */
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <WishForm 
          wish={wish}
          setWish={setWish}
          onSubmit={handleWishSubmit}
          showPayment={showPayment}
          paymentSection={
            <PaymentSection
              wish={wish}
              wishIntensity={wishIntensity}
              setWishIntensity={setWishIntensity}
              setSelectedAmount={setSelectedAmount}
              getAmountFromIntensity={getAmountFromIntensity}
              getColorFromIntensity={getColorFromIntensity}
            >
              <PaymentMethods
                getAmountFromIntensity={getAmountFromIntensity}
                wishIntensity={wishIntensity}
                onPaymentComplete={handlePayment}
              />
            </PaymentSection>
          }
        />

        {/* Rules Section */}
        <RulesSection />

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-600">
              © 2024 Сайт Желаний. Все права защищены.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;