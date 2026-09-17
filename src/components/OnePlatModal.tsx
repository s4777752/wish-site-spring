import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import funcUrls from '../../backend/func2url.json';

interface OnePlatModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  wish: string;
  wishIntensity: number;
  fullName: string;
  onPaid: () => void;
}

type PaymentMethod = 'card' | 'sbp' | 'qr';

interface InvoiceData {
  merchant_order_id: string;
  status: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  pan: string;
  bank: string;
  fio: string;
  phone: string;
  qr_link: string;
  qr_img: string;
}

const OnePlatModal = ({ isOpen, onClose, amount, wish, wishIntensity, fullName, onPaid }: OnePlatModalProps) => {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [isCreating, setIsCreating] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setInvoice(null);
      setError('');
      setMethod('card');
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const createInvoice = async () => {
    setIsCreating(true);
    setError('');
    try {
      const response = await fetch(funcUrls['oneplat-payment'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          wish,
          wishIntensity,
          fullName,
          method
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Не удалось создать счёт');
        return;
      }

      setInvoice(data);
      startPolling(data.merchant_order_id);
    } catch (e) {
      setError('Ошибка соединения с платёжной системой');
    } finally {
      setIsCreating(false);
    }
  };

  const startPolling = (merchantOrderId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${funcUrls['oneplat-payment']}?id=${merchantOrderId}`);
        const data = await response.json();

        if (data.status === 1 || data.status === 2) {
          if (pollRef.current) clearInterval(pollRef.current);
          onPaid();
        } else if (data.status === -2) {
          if (pollRef.current) clearInterval(pollRef.current);
          setError('Оплата не была завершена. Попробуйте ещё раз.');
          setInvoice(null);
        }
      } catch (e) {
        // Игнорируем единичные сбои опроса
      }
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Оплата</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="X" size={24} />
          </button>
        </div>

        {!invoice && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Сумма к оплате:</p>
              <p className="text-2xl font-bold text-purple-600">{amount} ₽</p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Способ оплаты:</Label>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                <div className="flex items-center space-x-3 p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer flex-1">
                    <div className="font-medium">💳 Банковская карта</div>
                    <div className="text-sm text-gray-600">Перевод на карту любого банка РФ</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                  <RadioGroupItem value="sbp" id="sbp" />
                  <Label htmlFor="sbp" className="cursor-pointer flex-1">
                    <div className="font-medium">📱 СБП</div>
                    <div className="text-sm text-gray-600">Перевод по номеру телефона</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                  <RadioGroupItem value="qr" id="qr" />
                  <Label htmlFor="qr" className="cursor-pointer flex-1">
                    <div className="font-medium">🔳 QR-код</div>
                    <div className="text-sm text-gray-600">Оплата через QR-код</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              onClick={createInvoice}
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
            >
              {isCreating ? 'Создание счёта...' : 'Продолжить'}
            </Button>
          </div>
        )}

        {invoice && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Сумма к оплате:</p>
              <p className="text-2xl font-bold text-purple-600">{invoice.amount} ₽</p>
            </div>

            {invoice.method === 'qr' && invoice.qr_img && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center space-y-2">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Отсканируйте QR-код</h4>
                <img src={invoice.qr_img} alt="QR для оплаты" className="mx-auto max-w-[200px]" />
              </div>
            )}

            {invoice.method !== 'qr' && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2 text-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {invoice.method === 'card' ? 'Переведите на карту' : 'Переведите по СБП'}
                </h4>
                {invoice.bank && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Банк:</span>
                    <span className="font-medium">{invoice.bank}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{invoice.method === 'card' ? 'Номер карты:' : 'Телефон:'}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{invoice.pan || invoice.phone}</span>
                    <button
                      onClick={() => copyToClipboard(invoice.pan || invoice.phone)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Icon name="Copy" size={14} />
                    </button>
                  </div>
                </div>
                {invoice.fio && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Получатель:</span>
                    <span className="font-medium">{invoice.fio}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-2">
              <Icon name="Loader2" size={16} className="animate-spin" />
              Ожидаем поступление оплаты...
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button variant="outline" onClick={onClose} className="w-full">
              Закрыть
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnePlatModal;
