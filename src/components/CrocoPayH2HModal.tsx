import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import funcUrls from '../../backend/func2url.json';

interface CrocoPayH2HModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  wish: string;
  wishIntensity: number;
  fullName: string;
  onPaid: () => void;
}

type PaymentOption = 'TO_CARD' | 'SBP' | 'SBP_ALFA' | 'SBP_TBANK' | 'QR_NSPK';

interface InvoiceData {
  order_ref: string;
  status: string;
  amount: number;
  currency: string;
  payment_option: PaymentOption;
  requisite: string;
  bank_receiver: string;
  card_owner: string;
  expires_at: string | null;
}

const optionLabels: Record<PaymentOption, { title: string; desc: string; emoji: string }> = {
  TO_CARD: { title: 'Банковская карта', desc: 'Перевод на карту любого банка РФ', emoji: '💳' },
  SBP: { title: 'СБП', desc: 'Перевод по номеру телефона — любой банк РФ', emoji: '📱' },
  SBP_ALFA: { title: 'СБП Альфа-Банк', desc: 'Перевод по номеру телефона', emoji: '📱' },
  SBP_TBANK: { title: 'СБП Т-Банк', desc: 'Перевод по номеру телефона', emoji: '📱' },
  QR_NSPK: { title: 'QR-код', desc: 'Оплата по QR-коду НСПК', emoji: '🔳' }
};

const CrocoPayH2HModal = ({ isOpen, onClose, amount, wish, wishIntensity, fullName, onPaid }: CrocoPayH2HModalProps) => {
  const [option, setOption] = useState<PaymentOption>('TO_CARD');
  const [isCreating, setIsCreating] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setInvoice(null);
      setError('');
      setOption('TO_CARD');
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
      const response = await fetch(funcUrls['crocopay-h2h'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          wish,
          wishIntensity,
          fullName,
          paymentOption: option
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Не удалось создать счёт');
        return;
      }

      setInvoice(data);
      startPolling(data.order_ref);
    } catch (e) {
      setError('Ошибка соединения с платёжной системой');
    } finally {
      setIsCreating(false);
    }
  };

  const startPolling = (orderRef: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${funcUrls['crocopay-h2h']}?id=${orderRef}`);
        const data = await response.json();

        if (data.status === 'Success') {
          if (pollRef.current) clearInterval(pollRef.current);
          onPaid();
        } else if (data.status === 'Expired' || data.status === 'Cancelled' || data.status === 'Failed') {
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
              <RadioGroup value={option} onValueChange={(v) => setOption(v as PaymentOption)}>
                {(Object.keys(optionLabels) as PaymentOption[]).map((key) => (
                  <div key={key} className="flex items-center space-x-3 p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key} className="cursor-pointer flex-1">
                      <div className="font-medium">{optionLabels[key].emoji} {optionLabels[key].title}</div>
                      <div className="text-sm text-gray-600">{optionLabels[key].desc}</div>
                    </Label>
                  </div>
                ))}
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
              <p className="text-2xl font-bold text-purple-600">{(invoice.amount / 100).toFixed(0)} ₽</p>
            </div>

            {invoice.payment_option === 'QR_NSPK' && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center space-y-2">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Отсканируйте QR-код</h4>
                {invoice.requisite ? (
                  <img src={invoice.requisite} alt="QR для оплаты" className="mx-auto max-w-[200px]" />
                ) : (
                  <p className="text-sm text-gray-600">QR-код формируется...</p>
                )}
              </div>
            )}

            {invoice.payment_option !== 'QR_NSPK' && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2 text-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {invoice.payment_option === 'TO_CARD' ? 'Переведите на карту' : 'Переведите по СБП'}
                </h4>
                {invoice.bank_receiver && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Банк:</span>
                    <span className="font-medium">{invoice.bank_receiver}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{invoice.payment_option === 'TO_CARD' ? 'Номер карты:' : 'Телефон:'}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{invoice.requisite}</span>
                    <button
                      onClick={() => copyToClipboard(invoice.requisite)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Icon name="Copy" size={14} />
                    </button>
                  </div>
                </div>
                {invoice.card_owner && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Получатель:</span>
                    <span className="font-medium">{invoice.card_owner}</span>
                  </div>
                )}
              </div>
            )}

            <div className="text-center text-sm text-gray-600 animate-pulse">
              Ожидаем поступление оплаты...
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrocoPayH2HModal;
