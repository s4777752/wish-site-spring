import { useState, useEffect } from 'react';

interface Error404Data {
  id: string;
  pathname: string;
  fullUrl: string;
  referrer: string;
  timestamp: string;
  userAgent?: string;
  errorType: 'static_page_not_found' | 'spa_route_not_found';
}

const Analytics404 = () => {
  const [errors, setErrors] = useState<Error404Data[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Симуляция данных (в реальном проекте это будет API запрос)
    const mockData: Error404Data[] = [
      {
        id: '1',
        pathname: '/old-page',
        fullUrl: 'https://wish-site-spring.poehali.dev/old-page',
        referrer: 'https://google.com',
        timestamp: new Date().toISOString(),
        errorType: 'static_page_not_found'
      },
      {
        id: '2', 
        pathname: '/services',
        fullUrl: 'https://wish-site-spring.poehali.dev/services',
        referrer: 'https://yandex.ru',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        errorType: 'spa_route_not_found'
      }
    ];
    
    setTimeout(() => {
      setErrors(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ru-RU');
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Загружаем данные о 404 ошибках...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              📊 Аналитика 404 ошибок
            </h1>
            <p className="text-gray-600 mt-2">
              Отслеживание несуществующих страниц для улучшения SEO
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-red-800 font-semibold">Всего ошибок</h3>
                <p className="text-2xl font-bold text-red-900">{errors.length}</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="text-orange-800 font-semibold">За сегодня</h3>
                <p className="text-2xl font-bold text-orange-900">
                  {errors.filter(e => 
                    new Date(e.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-blue-800 font-semibold">Самые частые</h3>
                <p className="text-sm text-blue-900">
                  {errors.length > 0 ? errors[0].pathname : 'Нет данных'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">Страница</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Источник</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Дата</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Тип</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.map((error) => (
                    <tr key={error.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {error.pathname}
                        </code>
                      </td>
                      <td className="p-3">
                        {error.referrer ? (
                          <span className="text-blue-600">
                            {getDomain(error.referrer)}
                          </span>
                        ) : (
                          <span className="text-gray-400">Прямой переход</span>
                        )}
                      </td>
                      <td className="p-3 text-gray-600">
                        {formatDate(error.timestamp)}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          error.errorType === 'static_page_not_found' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {error.errorType === 'static_page_not_found' ? 'Статическая' : 'SPA роут'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {errors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">🎉 Отлично! Пока нет 404 ошибок</p>
                <p className="text-gray-400 mt-2">Система мониторинга работает</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">💡 Рекомендации</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Создайте редиректы для часто запрашиваемых несуществующих страниц</li>
            <li>• Добавьте поиск по сайту на 404 страницу</li>
            <li>• Анализируйте источники трафика для выявления неправильных ссылок</li>
            <li>• Обновите внутренние ссылки, которые ведут на несуществующие страницы</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics404;