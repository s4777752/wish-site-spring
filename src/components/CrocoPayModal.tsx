import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import funcUrls from '../../backend/func2url.json';

interface CrocoPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  wish: string;
  wishIntensity: number;
  fullName: string;
  onPaid: () => void;
}

interface InvoiceData {
  order_id: string;
  status: string;
  amount: number;
  card: string;
  bank_receiver: string;
  card_owner: string;
  payment_option: 'TO_CARD' | 'SBP';
}

const CrocoPayModal = ({ isOpen, onClose, amount, wish, wishIntensity, fullName, onPaid }: CrocoPayModalProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setIsCreating(false);
      setInvoice(null);
      setCopied(false);
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

  const startPolling = (orderId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${funcUrls['crocopay-payment']}?orderId=${orderId}`);
        const data = await res.json();
        if (data.status === 'Success') {
          if (pollRef.current) clearInterval(pollRef.current);
          onPaid();
        }
      } catch {
        // игнорируем ошибки поллинга
      }
    }, 4000);
  };

  const createInvoice = async (paymentOption: 'TO_CARD' | 'SBP') => {
    setIsCreating(true);
    setError('');
    try {
      const response = await fetch(funcUrls['crocopay-payment'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, wish, wishIntensity, fullName, paymentOption })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Не удалось создать счёт');
        return;
      }

      setInvoice(data);
      startPolling(data.order_id);
    } catch (e) {
      setError('Ошибка соединения с платёжной системой');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Сумма к оплате:</p>
            <p className="text-2xl font-bold text-purple-600">{amount} ₽</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!invoice && (
            <div className="space-y-3">
              <p className="text-gray-600 text-sm text-center">Выберите способ оплаты</p>
              <Button
                onClick={() => createInvoice('TO_CARD')}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              >
                {isCreating ? 'Создаём счёт...' : 'Оплатить на карту'}
              </Button>
              <Button
                onClick={() => createInvoice('SBP')}
                disabled={isCreating}
                variant="outline"
                className="w-full font-semibold py-3"
              >
                {isCreating ? 'Создаём счёт...' : 'Оплатить по СБП'}
              </Button>
            </div>
          )}

          {invoice && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {invoice.payment_option === 'SBP' ? 'Номер телефона' : 'Номер карты'}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-gray-800">{invoice.card}</p>
                    <button
                      onClick={() => copyToClipboard(invoice.card)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Icon name={copied ? 'Check' : 'Copy'} size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Банк получателя</p>
                  <p className="text-sm font-medium text-gray-800">{invoice.bank_receiver}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Получатель</p>
                  <p className="text-sm font-medium text-gray-800">{invoice.card_owner}</p>
                </div>
              </div>

              <p className="text-gray-600 text-xs text-center">
                Переведите точную сумму {amount} ₽ по указанным реквизитам. После оплаты статус обновится автоматически.
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Icon name="Loader2" size={16} className="animate-spin" />
                Ожидаем поступление оплаты...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrocoPayModal;
