import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import TinkoffPayForm from '@/components/TinkoffPayForm';
import PaymentSuccessAnimation from '@/components/PaymentSuccessAnimation';

interface PaymentMethodsProps {
  getAmountFromIntensity: (intensity: number) => number;
  wishIntensity: number;
  onPaymentComplete: () => void;
}

const PaymentMethods = ({ getAmountFromIntensity, wishIntensity, onPaymentComplete }: PaymentMethodsProps) => {
  const [showTinkoffForm, setShowTinkoffForm] = useState(false);
  const [showSBPForm, setShowSBPForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    terminal: '',
    password: ''
  });

  const handlePaymentSuccess = () => {
    // Имитируем переход на банковскую страницу и возврат
    alert('Перенаправляем на страницу банка для завершения оплаты...');
    
    // Через 3 секунды завершаем оплату без заставки
    setTimeout(() => {
      onPaymentComplete();
    }, 3000);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    onPaymentComplete();
  };

  if (!showTinkoffForm && !showSBPForm && !showCardForm) {
    return (
      <Button 
        onClick={() => setShowTinkoffForm(true)}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6 rounded-lg"
        aria-label="Выбрать оплату через Тинькофф Эквайринг"
      >
        <Icon name="Banknote" size={20} className="mr-2" />
        Тинькофф Эквайринг
      </Button>
    );
  }

  if (showTinkoffForm) {
    return (
      <div className="space-y-4">
        <TinkoffPayForm 
          amount={getAmountFromIntensity(wishIntensity)} 
          onPaymentComplete={onPaymentComplete}
        />
        <Button 
          onClick={() => setShowTinkoffForm(false)}
          variant="outline"
          className="w-full"
        >
          Назад к выбору способа оплаты
        </Button>
      </div>
    );
  }

  if (showSBPForm) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold text-blue-600 mb-2">Система быстрых платежей</h4>
          <p className="text-sm text-gray-600">Оплата по номеру телефона через банковское приложение</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Номер телефона
          </label>
          <Input
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={phoneNumber}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.startsWith('8')) value = '7' + value.slice(1);
              if (value.startsWith('7') && value.length <= 11) {
                const formatted = value.length > 1 ? 
                  `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}` :
                  value;
                setPhoneNumber(formatted);
              } else if (value.length <= 11) {
                setPhoneNumber(value);
              }
            }}
            className="text-lg"
            aria-required="true"
            aria-describedby="phone-help"
          />
          <div id="phone-help" className="text-xs text-gray-500 mt-1">
            Введите номер телефона в формате +7 (999) 999-99-99
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выберите банк
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Сбербанк', icon: '🟢' },
              { name: 'ВТБ', icon: '🔵' },
              { name: 'Тинькофф', icon: '🟡' },
              { name: 'Альфа-Банк', icon: '🔴' },
              { name: 'Газпромбанк', icon: '⚫' },
              { name: 'Другой банк', icon: '💳' }
            ].map((bank) => (
              <button
                key={bank.name}
                onClick={() => setSelectedBank(bank.name)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105 ${
                  selectedBank === bank.name
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                }`}
                role="radio"
                aria-checked={selectedBank === bank.name}
                aria-label={`Выбрать банк ${bank.name}`}
              >
                <div className="text-lg mb-1">{bank.icon}</div>
                {bank.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={() => {
              setShowSBPForm(false);
              setPhoneNumber('');
              setSelectedBank('');
            }}
            variant="outline"
            className="flex-1"
          >
            Назад
          </Button>
          <Button 
            onClick={handlePaymentSuccess}
            disabled={!phoneNumber.includes('+7') || !selectedBank}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Icon name="Smartphone" size={20} className="mr-2" />
            Оплатить {getAmountFromIntensity(wishIntensity)} ₽
          </Button>
        </div>
      </div>
    );
  }

  if (showCardForm) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер карты
            </label>
            <Input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                if (value.length <= 19) {
                  setCardData({...cardData, number: value});
                }
              }}
              className="text-lg"
              aria-required="true"
              aria-label="Номер банковской карты"
              autoComplete="cc-number"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Срок действия
              </label>
              <Input
                type="text"
                placeholder="ММ/ГГ"
                value={cardData.expiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.substring(0,2) + '/' + value.substring(2,4);
                  }
                  if (value.length <= 5) {
                    setCardData({...cardData, expiry: value});
                  }
                }}
                className="text-lg"
                aria-required="true"
                aria-label="Срок действия карты"
                autoComplete="cc-exp"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <Input
                type="password"
                placeholder="123"
                maxLength={3}
                value={cardData.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCardData({...cardData, cvv: value});
                }}
                className="text-lg"
                aria-required="true"
                aria-label="CVV код безопасности"
                autoComplete="cc-csc"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя на карте
            </label>
            <Input
              type="text"
              placeholder="IVAN PETROV"
              value={cardData.name}
              onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})}
              className="text-lg"
              aria-required="true"
              aria-label="Имя держателя карты"
              autoComplete="cc-name"
            />
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={() => setShowCardForm(false)}
            variant="outline"
            className="flex-1"
          >
            Назад
          </Button>
          <Button 
            onClick={handlePaymentSuccess}
            disabled={!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Icon name="Sparkles" size={20} className="mr-2" />
            Оплатить {getAmountFromIntensity(wishIntensity)} ₽
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showAnimation && (
        <PaymentSuccessAnimation onComplete={handleAnimationComplete} />
      )}
    </>
  );
};

export default PaymentMethods;