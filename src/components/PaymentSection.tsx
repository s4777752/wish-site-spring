import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import PaymentWaitingScreen from './PaymentWaitingScreen';

interface PaymentSectionProps {
  wish: string;
  wishIntensity: number;
  setWishIntensity: (intensity: number) => void;
  setSelectedAmount: (amount: number) => void;
  getAmountFromIntensity: (intensity: number) => number;
  getColorFromIntensity: (intensity: number) => string;
  children: React.ReactNode;
  onReturnToSplash?: () => void;
}

const PaymentSection = ({ 
  wish, 
  wishIntensity, 
  setWishIntensity, 
  setSelectedAmount, 
  getAmountFromIntensity, 
  getColorFromIntensity,
  children,
  onReturnToSplash
}: PaymentSectionProps) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [showWaitingScreen, setShowWaitingScreen] = useState(false);
  return (
    <Card className="border-2 border-indigo-200 shadow-lg animate-scale-in mt-8">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-black mb-4">
          Страница оплаты
        </CardTitle>
        <p className="text-gray-600">
          Ваше желание: "{wish}"
        </p>

      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-4">Укажите силу вашего желания</h3>
          <p className="text-gray-600 text-sm">Чем сильнее желание, тем больше энергии вы вкладываете в его исполнение</p>
        </div>
        
        <div className="space-y-6 mb-6">
          {/* Индикатор силы желания */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Слабое желание</span>
              <span>Сильное желание</span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={wishIntensity}
                onChange={(e) => {
                  const intensity = parseInt(e.target.value);
                  setWishIntensity(intensity);
                  setSelectedAmount(getAmountFromIntensity(intensity));
                }}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    rgb(144, 238, 144) 0%, 
                    rgb(124, 252, 0) 20%, 
                    rgb(50, 205, 50) 40%, 
                    rgb(34, 139, 34) 60%, 
                    rgb(0, 128, 0) 80%, 
                    rgb(0, 100, 0) 100%)`
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${getColorFromIntensity(wishIntensity)};
                  border: 3px solid white;
                  box-shadow: 0 0 10px rgba(0,0,0,0.3);
                  cursor: pointer;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${getColorFromIntensity(wishIntensity)};
                  border: 3px solid white;
                  box-shadow: 0 0 10px rgba(0,0,0,0.3);
                  cursor: pointer;
                }
              `}</style>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <span key={num} className={wishIntensity === num ? 'font-bold text-gray-800' : ''}>
                  {num}
                </span>
              ))}
            </div>
          </div>
          
          {/* Визуальная карточка с силой желания */}
          <div 
            className="p-6 rounded-xl border-3 text-center transition-all duration-300"
            style={{
              backgroundColor: getColorFromIntensity(wishIntensity) + '20',
              borderColor: getColorFromIntensity(wishIntensity)
            }}
          >
            <div className="text-3xl font-bold mb-2" style={{ color: getColorFromIntensity(wishIntensity) }}>
              Сила: {wishIntensity}/10
            </div>
            <div className="text-lg text-gray-700 mb-1">
              Энергия желания: <span className="font-semibold">{getAmountFromIntensity(wishIntensity)} ₽</span>
            </div>
            <div className="text-sm text-gray-600">
              {wishIntensity <= 3 && "Легкое желание - небольшая энергия"}
              {wishIntensity >= 4 && wishIntensity <= 6 && "Умеренное желание - средняя энергия"}
              {wishIntensity >= 7 && wishIntensity <= 8 && "Сильное желание - большая энергия"}
              {wishIntensity >= 9 && "Очень сильное желание - максимальная энергия"}
            </div>
          </div>
        </div>
        
        {wishIntensity && (
          <div className="space-y-4">
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 mb-1">₽ {getAmountFromIntensity(wishIntensity)}</div>
              <p className="text-gray-600">Энергетический вклад в исполнение желания</p>
            </div>


            
            {React.cloneElement(children as React.ReactElement, { deliveryMethod })}
            
            <div className="mt-8 text-center">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                size="lg"
              >
                Отправить запрос и оплатить
              </Button>
            </div>
          </div>
        )}
        
        {/* Модальное окно */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Оформление заявки</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <Label htmlFor="wish-field" className="text-sm font-medium text-gray-700">
                    Ваше желание
                  </Label>
                  <Input
                    id="wish-field"
                    type="text"
                    value={wish}
                    disabled
                    className="mt-1 bg-gray-100"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Фамилия Имя Отчество
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Введите ФИО"
                    className="mt-1"
                    required
                  />
                </div>
                
                
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Сумма к оплате:</p>
                  <p className="text-2xl font-bold text-purple-600">{getAmountFromIntensity(wishIntensity)} ₽</p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!fullName || !email) {
                        alert('Пожалуйста, заполните все поля');
                        return;
                      }
                      setIsQRModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex-1"
                  >
                    Оплатить
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Модальное окно с QR кодом */}
        {isQRModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Оплата</h3>
                <button 
                  onClick={() => setIsQRModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>
              
              <div className="text-center space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Сумма к оплате:</p>
                  <p className="text-2xl font-bold text-purple-600">{getAmountFromIntensity(wishIntensity)} ₽</p>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-800">Для оплаты отсканируйте QR код</h4>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block shadow-sm">
                  <img 
                    src="https://cdn.poehali.dev/files/94c093a9-e696-40cd-99d6-9b1d57dc9e9d.jpg" 
                    alt="QR код для оплаты" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <div className="text-center space-y-2">
                  <div className="font-semibold text-gray-800">Т-Банк ⚡</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>1. Отсканируйте QR-код</div>
                    <div>2. Введите сумму: {getAmountFromIntensity(wishIntensity)} ₽</div>
                    <div>3. Подтвердите оплату</div>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsQRModalOpen(false)}
                    className="flex-1"
                  >
                    Назад
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsQRModalOpen(false);
                      setIsModalOpen(false);
                      setShowWaitingScreen(true);
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1"
                  >
                    Я оплатил
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Заставка ожидания оплаты */}
        {showWaitingScreen && (
          <PaymentWaitingScreen 
            onComplete={() => {
              setShowWaitingScreen(false);
              if (onReturnToSplash) {
                onReturnToSplash();
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSection;