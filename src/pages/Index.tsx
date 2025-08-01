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
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a6f', '#c44569', '#786fa6', '#f8b500'];
      
      const createConfetti = () => {
        const confettiPiece = document.createElement('div');
        const size = Math.random() * 8 + 4; // от 4px до 12px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = Math.random() > 0.5 ? 'circle' : 'square';
        
        confettiPiece.style.position = 'fixed';
        confettiPiece.style.width = size + 'px';
        confettiPiece.style.height = size + 'px';
        confettiPiece.style.backgroundColor = color;
        confettiPiece.style.left = Math.random() * 100 + '%';
        confettiPiece.style.top = '-20px';
        confettiPiece.style.zIndex = '1000';
        confettiPiece.style.pointerEvents = 'none';
        confettiPiece.style.borderRadius = shape === 'circle' ? '50%' : '0';
        
        const duration = Math.random() * 4 + 3; // от 3s до 7s
        const rotation = Math.random() * 360;
        
        confettiPiece.style.animation = `confetti-fall ${duration}s linear infinite`;
        confettiPiece.style.transform = `rotate(${rotation}deg)`;
        
        document.body.appendChild(confettiPiece);
        
        // Удаляем элемент после анимации
        setTimeout(() => {
          if (confettiPiece.parentNode) {
            confettiPiece.parentNode.removeChild(confettiPiece);
          }
        }, duration * 1000);
      };
      
      // Создаем конфетти каждые 100мс
      confettiInterval = setInterval(createConfetti, 100);
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
        title="Сайт желаний - Исполни своё желание | сайт-желаний.рф"
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
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0.3;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <WishForm 
          wish={wish}
          setWish={setWish}
          onSubmit={handleWishSubmit}
        />

        {/* Payment Section */}
        {showPayment && (
          <div className="max-w-lg mx-auto px-4 mb-8">
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
          </div>
        )}

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