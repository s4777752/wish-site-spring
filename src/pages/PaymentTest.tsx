import PaymentComplaint from '@/components/PaymentComplaint';

const PaymentTest = () => {
  const handleComplaintSubmitted = (failUrl: string) => {
    console.log('Complaint submitted, fail URL:', failUrl);
    // Можно перенаправить пользователя на fail_url или показать дополнительную информацию
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-6">Тестирование жалоб на платежи</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Интеграция с 1plat API</h2>
              <p className="text-gray-600 mb-4">
                Компонент для подачи жалоб на платежи через API 1plat.
                Используется endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/merchant/order/req/complaint/by-api</code>
              </p>
            </div>

            <PaymentComplaint 
              paymentId="test_payment_123"
              onComplaintSubmitted={handleComplaintSubmitted}
            />

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Как это работает:</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Пользователь вводит ID платежа</li>
                <li>• Отправляется запрос к нашему backend функции</li>
                <li>• Backend делает запрос к API 1plat</li>
                <li>• Возвращается fail_url для дальнейших действий</li>
                <li>• Пользователь получает подтверждение</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-2">Meta тег установлен:</h3>
              <code className="text-yellow-800 bg-yellow-100 px-2 py-1 rounded">
                &lt;meta name="1plat" content="API Shop"&gt;
              </code>
              <p className="text-yellow-800 text-sm mt-2">
                Этот тег позволяет платежной системе 1plat идентифицировать ваш магазин.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;