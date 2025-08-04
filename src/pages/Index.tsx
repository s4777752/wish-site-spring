import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import Analytics from '@/components/Analytics';
import WishForm from '@/components/WishForm';
import PaymentSection from '@/components/PaymentSection';
import PaymentMethods from '@/components/PaymentMethods';
import RulesSection from '@/components/RulesSection';
import Confetti from '@/components/Confetti';

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
    
    // Останавливаем конфетти через 10 секунд
    setTimeout(() => {
      setShowConfetti(false);
    }, 10000);
    
    // Отслеживаем исполнение желания в аналитике
    const amount = getAmountFromIntensity(wishIntensity);
    if (window.trackWish) {
      window.trackWish(amount, wishIntensity);
    }
  };



  const handleWishSubmit = () => {
    if (wish.trim()) {
      setShowPayment(true);
    }
  };

  return (
    <>
      {/* SEO компоненты */}
      <SEO 
        title="САЙТ ЖЕЛАНИЙ - Загадайте желание онлайн и поверьте в его исполнение"
        description="Загадайте желание онлайн на официальном Сайте Желаний. Энергетический вклад через безопасную оплату поможет вашему желанию исполниться. Тысячи счастливых пользователей уже исполнили свои мечты!"
        keywords="загадать желание, исполнение желаний, желания онлайн, сайт желаний, магия желаний, энергетический вклад, исполнить мечту"
        canonical="https://wish-site-spring.poehali.dev"
      />
      <StructuredData 
        type="WebSite"
        name="САЙТ ЖЕЛАНИЙ"
        description="Загадайте желание онлайн на официальном Сайте Желаний. Энергетический вклад через безопасную оплату поможет вашему желанию исполниться."
        url="https://wish-site-spring.poehali.dev"
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
        {/* Конфетти компонент */}
        <Confetti isActive={showConfetti} duration={10000} />
        
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