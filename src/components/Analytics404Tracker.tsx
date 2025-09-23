import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track404Error } from '@/utils/analytics';

/**
 * Компонент для отслеживания 404 ошибок в аналитике
 * Автоматически отправляет данные о несуществующих страницах
 */
const Analytics404Tracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Отправляем данные о 404 ошибке
    track404Error(location.pathname);
  }, [location.pathname]);

  return null; // Этот компонент не рендерит UI
};

export default Analytics404Tracker;