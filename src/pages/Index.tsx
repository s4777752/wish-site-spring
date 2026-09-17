import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import Analytics from '@/components/Analytics';
import WishForm from '@/components/WishForm';
import PaymentSection from '@/components/PaymentSection';
import PaymentMethods from '@/components/PaymentMethods';
import PaymentSuccessAnimation from '@/components/PaymentSuccessAnimation';
import PaymentSuccessPage from '@/components/PaymentSuccessPage';
import RulesSection from '@/components/RulesSection';
import SimpleConfetti from '@/components/SimpleConfetti';
import StarrySplashScreen from '@/components/StarrySplashScreen';

import { sendWishAffirmationDocument } from '@/components/DocumentEmailService';

const Index = () => {
  const [wish, setWish] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [wishIntensity, setWishIntensity] = useState(5);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');


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

  const handlePaymentAnimationComplete = async () => {
    setShowPaymentAnimation(false);
    setShowPaymentSuccess(true);
    
    // Отслеживаем исполнение желания в аналитике
    const amount = getAmountFromIntensity(wishIntensity);
    if (window.trackWish) {
      window.trackWish(amount, wishIntensity);
    }

    // Автоматически отправляем документ аффирмации после успешной оплаты
    try {
      const result = await sendWishAffirmationDocument(
        wish,
        wishIntensity,
        amount,
        userEmail || 'user@example.com',
        userPhone || '+7 999 123-45-67',
        'Пользователь'
      );
      
      if (result.success) {
        console.log(`✅ Документ аффирмации #${result.documentId} отправлен автоматически после оплаты`);
      }
    } catch (error) {
      console.error('Ошибка при автоматической отправке документа:', error);
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

  // Обработчик скачивания документа
  const handleDownloadDocument = async () => {
    try {
      const amount = getAmountFromIntensity(wishIntensity);
      const result = await sendWishAffirmationDocument(
        wish,
        wishIntensity,
        amount,
        userEmail || 'user@example.com',
        userPhone || '+7 999 123-45-67',
        'Пользователь'
      );
      
      if (result.success && result.documentUrl) {
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = result.documentUrl;
        link.download = `affirmation_${result.documentId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`📄 Документ #${result.documentId} скачан`);
      }
    } catch (error) {
      console.error('Ошибка при скачивании документа:', error);
    }
  };

  // Обработчик закрытия страницы успешной оплаты
  const handleClosePaymentSuccess = () => {
    setShowPaymentSuccess(false);
    // Сбрасываем форму для нового желания
    setWish('');
    setShowPayment(false);
    setWishIntensity(5);
  };



  // Если показываем заставку, отображаем только её
  if (showSplash) {
    return <StarrySplashScreen onComplete={handleSplashComplete} />;
  }

  // Если показываем страницу успешной оплаты, отображаем только её
  if (showPaymentSuccess) {
    return (
      <PaymentSuccessPage
        amount={getAmountFromIntensity(wishIntensity)}
        onDownload={handleDownloadDocument}
        onClose={handleClosePaymentSuccess}
      />
    );
  }



  return (
    <>
      {/* SEO компоненты */}
      <SEO 
        title="САЙТ ЖЕЛАНИЙ - Загадать желание на Официальном сайте!"
        description="🌟 Загадайте желание онлайн и исполните мечту уже сегодня! ✨ Проверенный метод от психологов. 🔮 Энергетический вклад активирует подсознание. 💫 Более 10,247 исполненных желаний!"
        keywords="загадать желание онлайн, исполнение желаний, сайт желаний, исполнить мечту, желания сбываются, энергетический вклад, психология желаний, визуализация мечты, привлечение удачи, закон притяжения, мотивация цели, как загадать желание правильно, исполнение мечты онлайн, желания исполняются, загадывание желаний, новогодние желания, желание на день рождения, заказать исполнение желания, платформа желаний, манифестация желаний, энергия для желаний, подсознание и желания, достижение целей онлайн, метод исполнения желаний, работа с желаниями, программирование подсознания, привлечение успеха"
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
              onReturnToSplash={() => {
                setShowSplash(true);
                setWish('');
                setShowPayment(false);
                setWishIntensity(5);
              }}
            >
              <PaymentMethods
                getAmountFromIntensity={getAmountFromIntensity}
                wishIntensity={wishIntensity}
                wish={wish}
                onPaymentComplete={handlePayment}
                onUserDataChange={(email, phone) => {
                  setUserEmail(email);
                  setUserPhone(phone);
                }}
              />
            </PaymentSection>
          }
        />

        {/* Rules Section */}
        <RulesSection />

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8">
          <p className="text-gray-500 text-sm text-center px-4 w-full">ИП Паклин Сергей Васильевич, ИНН 594200005879 ОГРН 305591619400016, эл.почта: unix7777@ya.ru, тел: 89024777752 © 2024 Все права защищены.</p>
        </footer>
      </main>
    </>
  );
};

export default Index;