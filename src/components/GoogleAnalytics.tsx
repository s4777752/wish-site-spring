import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Компонент для подключения Google Analytics 4
 * Добавьте measurement ID в пропсы для активации
 */
const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  useEffect(() => {
    if (!measurementId) {
      console.log('Google Analytics: Measurement ID не указан. Мониторинг работает только через Яндекс.Метрику');
      return;
    }

    // Создаем скрипт Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    // Инициализируем gtag
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(script2);

    // Очистка при размонтировании
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [measurementId]);

  return null;
};

export default GoogleAnalytics;