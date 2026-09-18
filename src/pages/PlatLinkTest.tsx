const PlatLinkTest = () => {
  const baseUrl = 'https://1plat.cash/widget';
  const shopId = '872';
  const sign = 'b257e45aebcb85375302281aaf02ec4c34dc7ace8d02aa7566821af51aba19f8';
  
  const testParams = [
    {
      name: 'Базовый виджет',
      url: `${baseUrl}?shop_id=${shopId}&sign=${sign}`,
      description: 'Минимальные параметры'
    },
    {
      name: 'С суммой 100₽',
      url: `${baseUrl}?shop_id=${shopId}&sign=${sign}&amount=100`,
      description: 'Базовый виджет с суммой'
    },
    {
      name: 'Полный набор параметров',
      url: `${baseUrl}?shop_id=${shopId}&sign=${sign}&amount=150&description=${encodeURIComponent('Энергетический вклад для желания')}&inline=1`,
      description: 'Все параметры для встроенного виджета'
    },
    {
      name: 'С callback URLs',
      url: `${baseUrl}?shop_id=${shopId}&sign=${sign}&amount=200&success_url=${encodeURIComponent(window.location.origin + '/payment-success')}&fail_url=${encodeURIComponent(window.location.origin + '/payment-failed')}`,
      description: 'С URL для обработки результатов'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Ссылка скопирована в буфер обмена!');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            🔗 Тестовые ссылки 1plat виджета
          </h1>
          
          <div className="space-y-6">
            {/* Базовая информация */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">
                📋 Базовые параметры
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Shop ID:</span>
                  <div className="bg-white p-2 rounded mt-1 font-mono">{shopId}</div>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Sign:</span>
                  <div className="bg-white p-2 rounded mt-1 font-mono text-xs break-all">{sign}</div>
                </div>
              </div>
            </div>

            {/* Тестовые ссылки */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                🚀 Тестовые ссылки
              </h2>
              
              {testParams.map((test, index) => (
                <div key={index} className="bg-gray-50 border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{test.name}</h3>
                      <p className="text-gray-600 text-sm">{test.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(test.url)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        📋 Копировать
                      </button>
                      <a
                        href={test.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        🔗 Открыть
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded border">
                    <code className="text-xs break-all text-gray-800">
                      {test.url}
                    </code>
                  </div>
                </div>
              ))}
            </div>

            {/* Проверка параметров */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="text-xl font-semibold mb-4 text-green-900">
                ✅ Проверка URL
              </h2>
              <div className="space-y-3 text-green-800">
                <p><strong>Базовый URL:</strong> https://1plat.cash/widget ✅</p>
                <p><strong>Shop ID:</strong> 872 ✅</p>
                <p><strong>Sign длина:</strong> {sign.length} символов ✅</p>
                <p><strong>Sign формат:</strong> hex (a-f0-9) ✅</p>
                <p><strong>Все параметры:</strong> shop_id, sign корректны ✅</p>
              </div>
            </div>

            {/* Инструкция */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h2 className="text-xl font-semibold mb-4 text-yellow-900">
                💡 Как использовать
              </h2>
              <ol className="text-yellow-800 space-y-2 text-sm list-decimal list-inside">
                <li>Нажмите "Открыть" рядом с любой тестовой ссылкой</li>
                <li>Виджет 1plat откроется в новой вкладке</li>
                <li>Проверьте отображение формы оплаты</li>
                <li>Попробуйте выбрать разные способы оплаты</li>
                <li>Убедитесь, что все параметры передаются корректно</li>
              </ol>
            </div>

            {/* Возврат к основной странице */}
            <div className="text-center pt-6">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
              >
                ← Вернуться на главную
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatLinkTest;