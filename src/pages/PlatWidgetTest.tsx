import { useState } from 'react';
import PlatWidget from '@/components/PlatWidget';
import PaymentResult from '@/components/PaymentResult';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PlatWidgetTest = () => {
  const [amount, setAmount] = useState(100);
  const [description, setDescription] = useState('Тестовый платеж через 1plat');
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handlePaymentSuccess = (data: any) => {
    setPaymentResult({ type: 'success', data });
    console.log('✅ Платеж успешно завершен:', data);
  };

  const handlePaymentError = (error: any) => {
    setPaymentResult({ type: 'error', data: error });
    console.error('❌ Ошибка платежа:', error);
  };

  const resetTest = () => {
    setPaymentResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            🏪 Тестирование виджета 1plat
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Настройки платежа */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h2 className="text-xl font-semibold mb-4 text-blue-900">
                  ⚙️ Настройки платежа
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Сумма платежа (₽):</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min="1"
                      max="500000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Описание платежа:</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Описание товара или услуги"
                    />
                  </div>

                  <Button onClick={resetTest} variant="outline" className="w-full">
                    🔄 Сбросить результат
                  </Button>
                </div>
              </div>

              {/* Информация о конфигурации */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-3">📋 Конфигурация:</h3>
                <div className="text-green-800 space-y-2 text-sm">
                  <p><strong>Shop ID:</strong> 872</p>
                  <p><strong>Sign:</strong> b257e45aebcb85375302281aaf02ec4c...</p>
                  <p><strong>Виджет URL:</strong> https://1plat.cash/widget</p>
                  <p><strong>Meta тег:</strong> &lt;meta name="1plat" content="872"&gt;</p>
                </div>
              </div>

              {/* Результат платежа */}
              {paymentResult && (
                <PaymentResult
                  paymentData={paymentResult.data}
                  type={paymentResult.type}
                />
              )}
            </div>

            {/* Виджет 1plat */}
            <div className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h2 className="text-xl font-semibold mb-4 text-purple-900">
                  💳 Виджет оплаты 1plat
                </h2>
                
                <PlatWidget
                  amount={amount}
                  description={description}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>

              {/* Инструкция */}
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-900 mb-3">💡 Как тестировать:</h3>
                <ol className="text-yellow-800 space-y-2 text-sm list-decimal list-inside">
                  <li>Измените сумму и описание слева</li>
                  <li>Нажмите "Оплатить в новом окне" или "Встроенный виджет"</li>
                  <li>Выберите способ оплаты в виджете 1plat</li>
                  <li>Следуйте инструкциям для завершения платежа</li>
                  <li>Результат отобразится в панели слева</li>
                </ol>
              </div>

              {/* Поддерживаемые методы */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">🎯 Доступные методы:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>💳 Банковские карты</div>
                  <div>📱 СБП</div>
                  <div>📷 QR-код оплата</div>
                  <div>₿ Криптовалюты</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatWidgetTest;