/**
 * Утилиты для аналитики и трекинга событий
 */

// Интерфейс для Яндекс.Метрики
declare global {
  interface Window {
    ym: any;
    dataLayer: any[];
    gtag: any;
  }
}

/**
 * Отправляет событие 404 ошибки в аналитику
 */
export const track404Error = (pathname: string) => {
  const url = window.location.href;
  const referrer = document.referrer;
  
  // Логируем в консоль для разработки
  console.error(`404 Error: ${pathname}`, {
    url,
    referrer,
    timestamp: new Date().toISOString()
  });

  // Отправляем в Яндекс.Метрику (ID: 103589488)
  if (typeof window.ym !== 'undefined') {
    window.ym(103589488, 'reachGoal', '404_error', {
      page_url: pathname,
      full_url: url,
      referrer: referrer,
      error_type: 'page_not_found'
    });
  }

  // Отправляем в Google Analytics (если подключен)
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'page_not_found', {
      event_category: 'Error',
      event_label: pathname,
      custom_map: {
        'dimension1': pathname,
        'dimension2': referrer
      }
    });
  }

  // Отправляем в dataLayer для GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event: '404_error',
      page_path: pathname,
      page_title: '404 - Страница не найдена',
      page_url: url,
      referrer: referrer,
      error_type: 'page_not_found',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Отправляет событие поиска несуществующей страницы
 */
export const trackMissingPageSearch = (searchedPath: string, userQuery?: string) => {
  if (typeof window.ym !== 'undefined') {
    window.ym(103589488, 'reachGoal', 'missing_page_search', {
      searched_path: searchedPath,
      user_query: userQuery || '',
      suggestions_needed: true
    });
  }
};

/**
 * Отправляет событие возврата на главную с 404 страницы
 */
export const track404Recovery = (fromPath: string) => {
  if (typeof window.ym !== 'undefined') {
    window.ym(103589488, 'reachGoal', '404_recovery', {
      from_path: fromPath,
      recovery_action: 'return_to_home'
    });
  }
};

/**
 * Отправляет кастомное событие в аналитику
 */
export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  // Яндекс.Метрика
  if (typeof window.ym !== 'undefined') {
    window.ym(103589488, 'reachGoal', eventName, parameters);
  }

  // Google Analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  }
};