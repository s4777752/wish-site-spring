import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import WishActivated from '@/components/WishActivated';
import { sendWishAffirmationDocument } from '@/components/DocumentEmailService';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Получаем параметры из URL
  const wish = searchParams.get('wish') || '';
  const amount = parseInt(searchParams.get('amount') || '0');
  const wishIntensity = parseInt(searchParams.get('intensity') || '5');
  const userEmail = searchParams.get('email') || '';
  const whatsappPhone = searchParams.get('phone') || '';
  
  const [showActivated, setShowActivated] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Форматирование номера карты
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Форматирование даты истечения
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Обработчик оплаты
  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      alert('Заполните все поля карты');
      return;
    }

    setIsProcessing(true);

    // Симулируем процесс оплаты
    setTimeout(async () => {
      setIsProcessing(false);
      
      // Отправляем документ аффирмации
      try {
        const result = await sendWishAffirmationDocument(
          wish,
          wishIntensity,
          amount,
          userEmail || 'user@example.com',
          whatsappPhone || '+7 999 123-45-67',
          cardHolder || 'Пользователь'
        );
        
        if (result.success) {
          console.log(`✅ Документ аффирмации #${result.documentId} отправлен на ${userEmail} и ${whatsappPhone}`);
        }
      } catch (error) {
        console.error('Ошибка при отправке документа аффирмации:', error);
      }
      
      // Показываем экран активации
      setShowActivated(true);
    }, 2000);
  };

  // Обработчик возврата на главную
  const handleBackToHome = () => {
    navigate('/');
  };

  // Если показываем экран активации
  if (showActivated) {
    return <WishActivated wish={wish} onBackToHome={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center justify-center">
              <Icon name="CreditCard" size={24} className="mr-2" />
              Оплата картой
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Информация о заказе */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-amber-800">К оплате: {amount} ₽</div>
                  <div className="text-sm text-amber-600">Исполнение желания</div>
                </div>
                <span className="text-3xl">💰</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                "{wish}"
              </div>
            </div>

            {/* Форма карты */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер карты
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MM/ГГ
                  </label>
                  <input
                    type="text"
                    placeholder="12/25"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    maxLength={5}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    maxLength={3}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя держателя карты
                </label>
                <input
                  type="text"
                  placeholder="IVAN PETROV"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            </div>

            {/* Кнопки */}
            <div className="space-y-3">
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 rounded-lg"
              >
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Обработка платежа...
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Оплатить {amount} ₽
                  </>
                )}
              </Button>

              <Button
                onClick={handleBackToHome}
                variant="outline"
                className="w-full"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Вернуться назад
              </Button>
            </div>

            {/* Безопасность */}
            <div className="text-center text-xs text-gray-500">
              <Icon name="Shield" size={16} className="inline mr-1" />
              Защищенное соединение SSL
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;