import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import TinkoffPayForm from '@/components/TinkoffPayForm';

interface PaymentMethodsProps {
  getAmountFromIntensity: (intensity: number) => number;
  wishIntensity: number;
  onPaymentComplete: () => void;
  deliveryMethod?: 'whatsapp' | 'email' | 'both';
}

const PaymentMethods = ({ getAmountFromIntensity, wishIntensity, onPaymentComplete, deliveryMethod = 'whatsapp' }: PaymentMethodsProps) => {
  const [showTinkoffForm, setShowTinkoffForm] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const needsWhatsappPhone = deliveryMethod === 'whatsapp' || deliveryMethod === 'both';
  const needsEmail = deliveryMethod === 'email' || deliveryMethod === 'both';



  if (!showTinkoffForm) {
    return (
      <div className="space-y-4">
        {/* Поля для доставки документа */}
        {(needsWhatsappPhone || needsEmail) && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            
            {needsWhatsappPhone && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📱 WhatsApp номер
                </label>
                <Input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={whatsappPhone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.startsWith('8')) value = '7' + value.slice(1);
                    if (value.startsWith('7') && value.length <= 11) {
                      const formatted = value.length > 1 ? 
                        `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}` :
                        '+7';
                      setWhatsappPhone(formatted);
                    }
                  }}
                  className="text-base"
                  required={needsWhatsappPhone}
                />
              </div>
            )}
            
            {needsEmail && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📧 Email адрес
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="text-base"
                  required={needsEmail}
                />
              </div>
            )}
          </div>
        )}

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

  return null;
};

export default PaymentMethods;