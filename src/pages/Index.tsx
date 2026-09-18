import { useState } from 'react';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import Analytics from '@/components/Analytics';
import WishForm from '@/components/WishForm';
import PaymentSuccessAnimation from '@/components/PaymentSuccessAnimation';
import PaymentSuccessPage from '@/components/PaymentSuccessPage';
import RulesSection from '@/components/RulesSection';
import SimpleConfetti from '@/components/SimpleConfetti';
import StarrySplashScreen from '@/components/StarrySplashScreen';

import { sendWishAffirmationDocument } from '@/components/DocumentEmailService';

const Index = () => {
  const [wish, setWish] = useState('');
  const [wishIntensity] = useState(5);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showWishAnimation, setShowWishAnimation] = useState(false);
  const [showWishSuccess, setShowWishSuccess] = useState(false);

  // Функция для расчета "энергии" желания (используется только в тексте документа)
  const getAmountFromIntensity = (intensity: number) => intensity * 100;

  const handleWishAnimationComplete = async () => {
    setShowWishAnimation(false);
    setShowWishSuccess(true);

    if (window.trackWish) {
      window.trackWish(0, wishIntensity);
    }

    // Автоматически отправляем документ аффирмации сразу после исполнения желания
    try {
      const result = await sendWishAffirmationDocument(
        wish,
        wishIntensity,
        0,
        'user@example.com',
        '+7 999 123-45-67',
        'Пользователь'
      );

      if (result.success) {
        console.log(`✅ Документ аффирмации #${result.documentId} отправлен автоматически`);
      }
    } catch (error) {
      console.error('Ошибка при автоматической отправке документа:', error);
    }
  };

  const handleWishSubmit = () => {
    if (wish.trim()) {
      setShowWishAnimation(true);
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleDownloadDocument = async () => {
    try {
      const result = await sendWishAffirmationDocument(
        wish,
        wishIntensity,
        0,
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

  const handleCloseWishSuccess = () => {
    setShowWishSuccess(false);
    setWish('');
  };

  if (showSplash) {
    return <StarrySplashScreen onComplete={handleSplashComplete} />;
  }

  if (showWishSuccess) {
    return (
      <PaymentSuccessPage
        amount={0}
        onDownload={handleDownloadDocument}
        onClose={handleCloseWishSuccess}
      />
    );
  }

  return (
    <>
      {/* SEO компоненты */}
      <SEO
        title="САЙТ ЖЕЛАНИЙ - Загадать желание на Официальном сайте!"
        description="🌟 Загадайте желание онлайн и исполните мечту уже сегодня! ✨ Проверенный метод от психологов. 🔮 Более 10,247 исполненных желаний!"
        keywords="загадать желание онлайн, исполнение желаний, сайт желаний, исполнить мечту, желания сбываются, психология желаний, визуализация мечты, привлечение удачи, закон притяжения, мотивация цели, как загадать желание правильно, исполнение мечты онлайн, желания исполняются, загадывание желаний, новогодние желания, желание на день рождения, платформа желаний, манифестация желаний, подсознание и желания, достижение целей онлайн, метод исполнения желаний, работа с желаниями, программирование подсознания, привлечение успеха"
        canonical="https://wish-site-spring.poehali.dev"
      />
      <StructuredData
        type="WebSite"
        name="САЙТ ЖЕЛАНИЙ"
        description="Загадайте желание онлайн на официальном Сайте Желаний."
        url="https://wish-site-spring.poehali.dev"
      />
      <Analytics
        googleAnalyticsId="G-XXXXXXXXXX"
        yandexMetrikaId="12345678"
        environment="production"
      />

      <main className="min-h-screen bg-white">
        {/* Анимация исполнения желания */}
        {showWishAnimation && (
          <PaymentSuccessAnimation onComplete={handleWishAnimationComplete} />
        )}

        {/* Конфетти компонент */}
        <SimpleConfetti isActive={showConfetti} />

        {/* Hero Section */}
        <WishForm
          wish={wish}
          setWish={setWish}
          onSubmit={handleWishSubmit}
          onConfettiStart={() => {
            setShowConfetti(true);
          }}
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
