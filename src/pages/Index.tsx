import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import Analytics from '@/components/Analytics';
import WishForm from '@/components/WishForm';
import PaymentSection from '@/components/PaymentSection';
import PaymentMethods from '@/components/PaymentMethods';
import PaymentSuccessAnimation from '@/components/PaymentSuccessAnimation';
import RulesSection from '@/components/RulesSection';
import SimpleConfetti from '@/components/SimpleConfetti';
import StarrySplashScreen from '@/components/StarrySplashScreen';

const Index = () => {
  const [wish, setWish] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [wishIntensity, setWishIntensity] = useState(5);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false);

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
    setShowPaymentAnimation(true);
  };

  const handlePaymentAnimationComplete = () => {
    setShowPaymentAnimation(false);
    setShowConfetti(true);
    
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

  // Обработчик завершения заставки
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Если показываем заставку, отображаем только её
  if (showSplash) {
    return <StarrySplashScreen onComplete={handleSplashComplete} />;
  }

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

      <main className="min-h-screen bg-white">
        {/* Анимация успешной оплаты */}
        {showPaymentAnimation && (
          <PaymentSuccessAnimation onComplete={handlePaymentAnimationComplete} />
        )}
        
        {/* Конфетти компонент */}
        <SimpleConfetti isActive={showConfetti} />
        
        {/* Hero Section */}
        <WishForm 
          wish={wish}
          setWish={setWish}
          onSubmit={handleWishSubmit}
          showPayment={showPayment}
          onConfettiStart={() => {
            console.log('Запускаю конфетти прямо сейчас!');
            setShowConfetti(true);
          }}
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

        {/* Дополнительные услуги */}
        <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              ✨ Усильте энергию ваших желаний
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">💕</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Персональная Аффирмация
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Получите красиво оформленный документ с персональными аффирмациями 
                  для ежедневной практики. Автоматическая отправка на email и WhatsApp.
                </p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-2xl font-bold text-primary">299₽</span>
                  <span className="text-gray-500 line-through">599₽</span>
                </div>
                <a 
                  href="/affirmation" 
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium"
                >
                  <span>🌟</span>
                  Создать аффирмацию
                </a>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔮</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Скоро доступно
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Индивидуальная консультация по исполнению желаний, 
                  персональные ритуалы и энергетическая поддержка.
                </p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-gray-500">Уведомим о запуске</span>
                </div>
                <button 
                  disabled
                  className="inline-flex items-center gap-2 bg-gray-300 text-gray-500 px-6 py-3 rounded-full cursor-not-allowed font-medium"
                >
                  <span>⏳</span>
                  В разработке
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-600">
              © 2024 Сайт Желаний. Все права защищены.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Index;