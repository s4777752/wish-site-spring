interface PaymentResultProps {
  paymentData: any;
  type: 'success' | 'error';
}

const PaymentResult = ({ paymentData, type }: PaymentResultProps) => {
  if (type === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-xl">❌</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900">Ошибка платежа</h3>
            <p className="text-red-700">Не удалось обработать платеж</p>
          </div>
        </div>
        
        <div className="bg-red-100 rounded-lg p-4">
          <pre className="text-red-800 text-sm overflow-auto">
            {JSON.stringify(paymentData, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-green-600 text-xl">✅</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-900">Платеж создан успешно</h3>
          <p className="text-green-700">ID: {paymentData.guid}</p>
        </div>
      </div>

      {/* Основная информация о платеже */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-semibold text-gray-900 mb-2">💰 Суммы</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">К оплате:</span>
                <span className="font-medium">{paymentData.amount_to_pay} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Магазину:</span>
                <span className="font-medium">{paymentData.amount_to_shop} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Общая сумма:</span>
                <span className="font-medium">{paymentData.amount} ₽</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-semibold text-gray-900 mb-2">📋 Детали</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID платежа:</span>
                <span className="font-medium">{paymentData.payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Статус:</span>
                <span className="font-medium">{paymentData.status === 0 ? 'Создан' : paymentData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Истекает:</span>
                <span className="font-medium">{new Date(paymentData.expired).toLocaleString('ru-RU')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Метод оплаты */}
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-900 mb-2">💳 Метод оплаты</h4>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {paymentData.method_name}
            </span>
            <span className="text-gray-600">({paymentData.method_group})</span>
          </div>
        </div>

        {/* Информация о карте/СБП */}
        {paymentData.cardInfo && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">💳 Информация о карте</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Номер карты:</span>
                <div className="font-mono bg-white p-2 rounded mt-1">{paymentData.cardInfo.pan}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Банк:</span>
                <div className="bg-white p-2 rounded mt-1">{paymentData.cardInfo.bank}</div>
              </div>
              <div className="col-span-2">
                <span className="text-blue-700 font-medium">Владелец:</span>
                <div className="bg-white p-2 rounded mt-1">{paymentData.cardInfo.fio}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Валюта:</span>
                <div className="bg-white p-2 rounded mt-1">{paymentData.cardInfo.currency}</div>
              </div>
            </div>
          </div>
        )}

        {/* QR код информация */}
        {paymentData.qrInfo && (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3">📱 QR код для оплаты</h4>
            <div className="grid grid-cols-1 gap-4">
              {paymentData.qrInfo.qr_img && (
                <div className="text-center">
                  <img 
                    src={paymentData.qrInfo.qr_img} 
                    alt="QR код для оплаты"
                    className="w-48 h-48 mx-auto bg-white p-4 rounded-lg border"
                  />
                  <p className="text-purple-700 text-sm mt-2">Отсканируйте QR код для оплаты</p>
                </div>
              )}
              
              {paymentData.qrInfo.qr && (
                <div>
                  <span className="text-purple-700 font-medium">Ссылка для оплаты:</span>
                  <div className="bg-white p-3 rounded border mt-2">
                    <a 
                      href={paymentData.qrInfo.qr}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {paymentData.qrInfo.qr}
                    </a>
                  </div>
                </div>
              )}
              
              <div>
                <span className="text-purple-700 font-medium">Валюта:</span>
                <div className="bg-white p-2 rounded mt-1">{paymentData.qrInfo.currency}</div>
              </div>
            </div>
          </div>
        )}

        {/* Ссылка на оплату */}
        {paymentData.url && (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-semibold text-gray-900 mb-2">🔗 Прямая ссылка</h4>
            <a 
              href={paymentData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Перейти к оплате ↗
            </a>
          </div>
        )}

        {/* Сырые данные для разработчиков */}
        <details className="bg-gray-50 rounded-lg p-4 border">
          <summary className="cursor-pointer font-semibold text-gray-900 hover:text-gray-700">
            🔧 Данные для разработчиков
          </summary>
          <pre className="mt-3 text-xs bg-gray-100 p-3 rounded overflow-auto text-gray-800">
            {JSON.stringify(paymentData, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default PaymentResult;