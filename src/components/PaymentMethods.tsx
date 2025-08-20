import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import TinkoffPayForm from '@/components/TinkoffPayForm';

interface PaymentMethodsProps {
  getAmountFromIntensity: (intensity: number) => number;
  wishIntensity: number;
  wish: string;
  onPaymentComplete: () => void;
  deliveryMethod?: 'whatsapp' | 'email' | 'both';
  onUserDataChange?: (email: string, phone: string) => void;
}

const PaymentMethods = ({ getAmountFromIntensity, wishIntensity, wish, onPaymentComplete, deliveryMethod = 'whatsapp', onUserDataChange }: PaymentMethodsProps) => {
  const [showTinkoffForm, setShowTinkoffForm] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Уведомляем родительский компонент об изменении данных пользователя
  const handleUserDataChange = (email: string, phone: string) => {
    setUserEmail(email);
    setWhatsappPhone(phone);
    if (onUserDataChange) {
      onUserDataChange(email, phone);
    }
  };

  const needsWhatsappPhone = deliveryMethod === 'whatsapp' || deliveryMethod === 'both';
  const needsEmail = deliveryMethod === 'email' || deliveryMethod === 'both';



  if (!showTinkoffForm) {
    return (
      <div className="space-y-4">


        <Button 
          onClick={() => setShowTinkoffForm(true)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6 rounded-lg"
          aria-label="Выбрать оплату через Тинькофф Эквайринг"
        >
          <Icon name="Banknote" size={20} className="mr-2" />
          Тинькофф Эквайринг
        </Button>
        
        {((needsWhatsappPhone && !whatsappPhone.includes('+7 (')) || (needsEmail && !userEmail.includes('@'))) && (
          <p className="text-sm text-amber-600 text-center">
            💡 Заполните контакты для получения документа аффирмации
          </p>
        )}
      </div>
    );
  }

  if (showTinkoffForm) {
    return (
      <div className="space-y-4">
        <TinkoffPayForm 
          amount={getAmountFromIntensity(wishIntensity)} 
          wish={wish}
          wishIntensity={wishIntensity}
          userEmail={userEmail}
          whatsappPhone={whatsappPhone}
          onPaymentComplete={onPaymentComplete}
          onUserDataChange={handleUserDataChange}
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

  return null;
};

export default PaymentMethods;