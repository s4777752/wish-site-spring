import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentSystem {
  system_group: string;
  min: number;
  max: number;
}

interface PaymentMethodSelectorProps {
  onPaymentInitiated?: (method: string, amount: number, currency?: string) => void;
}

const PaymentMethodSelector = ({ onPaymentInitiated }: PaymentMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('100');
  const [selectedCrypto, setSelectedCrypto] = useState<string>('USDT');

  // Данные из API 1plat
  const paymentSystems: PaymentSystem[] = [
    { system_group: "card", min: 100, max: 500000 },
    { system_group: "sbp", min: 100, max: 500000 },
    { system_group: "qr", min: 100, max: 500000 },
    { system_group: "crypto", min: 1, max: 500000 }
  ];

  const cryptoCurrencies = ["USDT", "TRX"];

  const getMethodName = (systemGroup: string) => {
    const names: Record<string, string> = {
      card: "💳 Банковская карта",
      sbp: "📱 Система быстрых платежей (СБП)",
      qr: "📷 QR-код оплата",
      crypto: "₿ Криптовалюта"
    };
    return names[systemGroup] || systemGroup;
  };

  const getMethodDescription = (systemGroup: string) => {
    const descriptions: Record<string, string> = {
      card: "Visa, MasterCard, МИР",
      sbp: "Мгновенные переводы через банк",
      qr: "Сканирование QR-кода",
      crypto: "USDT, TRX и другие криптовалюты"
    };
    return descriptions[systemGroup] || '';
  };

  const getCurrentMethod = () => {
    return paymentSystems.find(sys => sys.system_group === selectedMethod);
  };

  const isAmountValid = () => {
    const currentMethod = getCurrentMethod();
    if (!currentMethod) return false;
    
    const numAmount = parseFloat(amount);
    return numAmount >= currentMethod.min && numAmount <= currentMethod.max;
  };

  const handlePayment = () => {
    if (!selectedMethod || !isAmountValid()) return;
    
    const numAmount = parseFloat(amount);
    const currency = selectedMethod === 'crypto' ? selectedCrypto : undefined;
    
    onPaymentInitiated?.(selectedMethod, numAmount, currency);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value);
  };

  return (
    <div className="space-y-6 p-6 border border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center">
        <h3 className="text-xl font-bold text-purple-900 mb-2">
          💫 Выберите способ оплаты
        </h3>
        <p className="text-purple-700">
          Безопасная оплата через платежную систему 1plat
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">Способ оплаты:</Label>
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          {paymentSystems.map((system) => (
            <div key={system.system_group} className="flex items-center space-x-3 p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
              <RadioGroupItem value={system.system_group} id={system.system_group} />
              <div className="flex-1">
                <Label htmlFor={system.system_group} className="cursor-pointer">
                  <div className="font-medium">{getMethodName(system.system_group)}</div>
                  <div className="text-sm text-gray-600">{getMethodDescription(system.system_group)}</div>
                  <div className="text-xs text-purple-600 mt-1">
                    {formatCurrency(system.min)} - {formatCurrency(system.max)} ₽
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {selectedMethod === 'crypto' && (
        <div className="space-y-2">
          <Label>Криптовалюта:</Label>
          <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите криптовалюту" />
            </SelectTrigger>
            <SelectContent>
              {cryptoCurrencies.map((crypto) => (
                <SelectItem key={crypto} value={crypto}>
                  {crypto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">Сумма платежа:</Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму"
            className={`pr-12 ${!isAmountValid() && amount ? 'border-red-500' : ''}`}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {selectedMethod === 'crypto' ? selectedCrypto : '₽'}
          </span>
        </div>
        {getCurrentMethod() && (
          <p className="text-sm text-gray-600">
            Лимиты: {formatCurrency(getCurrentMethod()!.min)} - {formatCurrency(getCurrentMethod()!.max)} 
            {selectedMethod === 'crypto' ? ` ${selectedCrypto}` : ' ₽'}
          </p>
        )}
        {!isAmountValid() && amount && (
          <p className="text-sm text-red-600">
            Сумма должна быть от {getCurrentMethod()?.min} до {getCurrentMethod()?.max}
          </p>
        )}
      </div>

      <Button
        onClick={handlePayment}
        disabled={!selectedMethod || !isAmountValid()}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
        size="lg"
      >
        {selectedMethod ? (
          <>
            ✨ Оплатить {amount} {selectedMethod === 'crypto' ? selectedCrypto : '₽'}
          </>
        ) : (
          'Выберите способ оплаты'
        )}
      </Button>

      <div className="text-xs text-gray-500 space-y-1">
        <p>🔒 Все платежи защищены SSL-шифрованием</p>
        <p>💯 Соответствие стандартам безопасности PCI DSS</p>
        <p>⚡ Мгновенное зачисление средств</p>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;