import { useState } from 'react';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import Analytics from '@/components/Analytics';
import WishForm from '@/components/WishForm';
import PaymentSection from '@/components/PaymentSection';
import PaymentSuccessAnimation from '@/components/PaymentSuccessAnimation';
import PaymentSuccessPage from '@/components/PaymentSuccessPage';
import RulesSection from '@/components/RulesSection';
import SimpleConfetti from '@/components/SimpleConfetti';
import StarrySplashScreen from '@/components/StarrySplashScreen';

import { sendWishAffirmationDocument } from '@/components/DocumentEmailService';

const Index = () => {
  const [wish, setWish] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [wishIntensity, setWishIntensity] = useState(5);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  // Функция для расчета суммы по интенсивности
  const getAmountFromIntensity = (intensity: number) => intensity * 100;

  // Функция для получения цвета по интенсивности (от светло-зеленого до темно-зеленого)
  const getColorFromIntensity = (intensity: number) => {
    const lightGreen = { r: 144, g: 238, b: 144 };
    const darkGreen = { r: 0, g: 100, b: 0 };

    const ratio = (intensity - 1) / 9;

    const r = Math.round(lightGreen.r + (darkGreen.r - lightGreen.r) * ratio);
    const g = Math.round(lightGreen.g + (darkGreen.g - lightGreen.g) * ratio);
    const b = Math.round(lightGreen.b + (darkGreen.b - lightGreen.b) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const handlePaid = () => {
    setShowPaymentAnimation(true);
  };

  const handlePaymentAnimationComplete = async () => {
    setShowPaymentAnimation(false);
    setShowPaymentSuccess(true);

    const amount = getAmountFromIntensity(wishIntensity);
    if (window.trackWish) {
      window.trackWish(amount, wishIntensity);
    }

    try {
      const result = await sendWishAffirmationDocument(
        wish,
        wishIntensity,
        amount,
        'user@example.com',
        '+7 999 123-45-67',
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

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleDownloadDocument = async () => {
    try {
      const amount = getAmountFromIntensity(wishIntensity);
      const result = await sendWishAffirmationDocument(
        wish,
        wishIntensity,
        amount,
        'user@example.com',
        '+7 999 123-45-67',
        'Пользователь'
      );

      if (result.success && result.documentUrl) {
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

  const handleClosePaymentSuccess = () => {
    setShowPaymentSuccess(false);
    setWish('');
    setShowPayment(false);
    setWishIntensity(5);
  };

  if (showSplash) {
    return <StarrySplashScreen onComplete={handleSplashComplete} />;
  }

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
          paymentSection={
            <PaymentSection
              wish={wish}
              wishIntensity={wishIntensity}
              setWishIntensity={setWishIntensity}
              getAmountFromIntensity={getAmountFromIntensity}
              getColorFromIntensity={getColorFromIntensity}
              onPaid={handlePaid}
            />
          }
        />

        {/* Rules Section */}
        <RulesSection />

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8">
          <p className="text-gray-500 text-sm text-center px-4 w-full">ИП Паклин Сергей Васильевич, ИНН 594200005879 ОГРН 305591619400016, эл.почта: unix7777@ya.ru, тел: 89024777752 © 2024 Все права защищены</p>
        </footer>
      </main>
    </>
  );
};

export default Index;
