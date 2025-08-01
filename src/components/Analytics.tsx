import { useEffect } from 'react';

interface AnalyticsProps {
  googleAnalyticsId?: string;
  yandexMetrikaId?: string;
  environment?: 'development' | 'production';
}

const Analytics = ({
  googleAnalyticsId = 'G-XXXXXXXXXX', // Замените на ваш реальный ID
  yandexMetrikaId = '12345678', // Замените на ваш реальный ID
  environment = 'production'
}: AnalyticsProps) => {
  
  useEffect(() => {
    // Не загружаем аналитику в dev режиме
    if (environment === 'development') {
      console.log('Analytics disabled in development mode');
      return;
    }
    
    // Удаляем существующие скрипты аналитики
    const existingScripts = document.querySelectorAll('script[data-analytics="true"]');
    existingScripts.forEach(script => script.remove());
    
    // Google Analytics 4 (gtag)
    if (googleAnalyticsId) {
      // Загружаем основной скрипт GA
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      gaScript.setAttribute('data-analytics', 'true');
      document.head.appendChild(gaScript);
      
      // Инициализируем GA
      const gaConfigScript = document.createElement('script');
      gaConfigScript.setAttribute('data-analytics', 'true');
      gaConfigScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${googleAnalyticsId}', {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true,
          anonymize_ip: true,
          allow_google_signals: false,
          allow_ad_personalization_signals: false
        });
        
        // Отслеживание кликов по кнопкам
        document.addEventListener('click', function(e) {
          if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
            gtag('event', 'click', {
              event_category: 'Button',
              event_label: button.textContent || button.innerHTML,
              value: 1
            });
          }
        });
        
        // Отслеживание исполнения желаний
        window.trackWishPayment = function(amount, intensity) {
          gtag('event', 'purchase', {
            transaction_id: Date.now().toString(),
            value: amount,
            currency: 'RUB',
            event_category: 'Wish',
            event_label: 'Wish Intensity: ' + intensity,
            custom_parameters: {
              wish_intensity: intensity
            }
          });
        };
      `;
      document.head.appendChild(gaConfigScript);
    }
    
    // Яндекс.Метрика
    if (yandexMetrikaId) {
      const ymScript = document.createElement('script');
      ymScript.setAttribute('data-analytics', 'true');
      ymScript.textContent = `
        (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        
        ym(${yandexMetrikaId}, "init", {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          trackHash: true,
          ecommerce: "dataLayer"
        });
        
        // Отслеживание исполнения желаний в Яндекс.Метрике
        window.trackWishPaymentYM = function(amount, intensity) {
          ym(${yandexMetrikaId}, 'reachGoal', 'WISH_PAYMENT', {
            wish_amount: amount,
            wish_intensity: intensity
          });
          
          // E-commerce данные для Яндекс.Метрики
          ym(${yandexMetrikaId}, 'ecommerce', 'purchase', {
            currency: 'RUB',
            goods: [{
              id: 'wish_' + Date.now(),
              name: 'Исполнение желания (уровень ' + intensity + ')',
              category: 'Желания',
              quantity: 1,
              price: amount
            }]
          });
        };
      `;
      document.head.appendChild(ymScript);
      
      // Noscript для Яндекс.Метрики
      const ymNoscript = document.createElement('noscript');
      ymNoscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${yandexMetrikaId}" style="position:absolute; left:-9999px;" alt="" /></div>`;
      ymNoscript.setAttribute('data-analytics', 'true');
      document.body.appendChild(ymNoscript);
    }
    
    // Универсальная функция отслеживания
    window.trackWish = function(amount, intensity) {
      // Google Analytics
      if (window.gtag && googleAnalyticsId) {
        window.trackWishPayment(amount, intensity);
      }
      
      // Яндекс.Метрика
      if (window.ym && yandexMetrikaId) {
        window.trackWishPaymentYM(amount, intensity);
      }
      
      console.log(`Tracked wish: Amount=${amount}₽, Intensity=${intensity}`);
    };
    
    // Отслеживание времени на странице
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      if (window.gtag) {
        gtag('event', 'timing_complete', {
          name: 'page_view_time',
          value: timeSpent
        });
      }
      
      if (window.ym) {
        ym(yandexMetrikaId, 'reachGoal', 'TIME_ON_SITE', {
          time_spent: timeSpent
        });
      }
    });
    
  }, [googleAnalyticsId, yandexMetrikaId, environment]);
  
  return null;
};

// Типизация для глобальных функций
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    ym: (...args: any[]) => void;
    dataLayer: any[];
    trackWish: (amount: number, intensity: number) => void;
    trackWishPayment: (amount: number, intensity: number) => void;
    trackWishPaymentYM: (amount: number, intensity: number) => void;
  }
}

export default Analytics;