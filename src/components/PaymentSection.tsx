import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentSectionProps {
  wish: string;
  wishIntensity: number;
  setWishIntensity: (intensity: number) => void;
  setSelectedAmount: (amount: number) => void;
  getAmountFromIntensity: (intensity: number) => number;
  getColorFromIntensity: (intensity: number) => string;
  children: React.ReactNode;
}

const PaymentSection = ({ 
  wish, 
  wishIntensity, 
  setWishIntensity, 
  setSelectedAmount, 
  getAmountFromIntensity, 
  getColorFromIntensity,
  children 
}: PaymentSectionProps) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSection;