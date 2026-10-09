import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '../../backend/func2url.json';

interface BetaTransferPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  wish: string;
  wishIntensity: number;
  fullName: string;
}

const BetaTransferPayModal = ({ isOpen, onClose, amount, wish, wishIntensity }: BetaTransferPayModalProps) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState('');
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      startedRef.current = false;
      setPaymentUrl('');
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    setError('');
    setLoading(true);

    const orderId = `order-${Date.now()}`;
    const origin = window.location.origin;
    const successUrl = `${origin}/payment-success?orderId=${orderId}&amount=${amount}&intensity=${wishIntensity}&wish=${encodeURIComponent(wish)}`;

    fetch(func2url['betatransfer-pay'], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        orderId,
        urlSuccess: successUrl,
        urlFail: origin,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.payment_url) {
          localStorage.setItem('betatransfer_order', JSON.stringify({ orderId, invoiceId: data.invoice_id }));
          setPaymentUrl(data.payment_url);
          setLoading(false);
        } else {
          throw new Error('no url');
        }
      })
      .catch(() => {
        setError('Не удалось создать счёт. Попробуйте ещё раз позже.');
        setLoading(false);
        startedRef.current = false;
      });
  }, [isOpen, amount, wish, wishIntensity]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Оплата</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-center mb-4">
          <p className="text-sm text-gray-600 mb-1">Сумма к оплате:</p>
          <p className="text-2xl font-bold text-purple-600">{amount} ₽</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{error}</div>
        )}

        {loading && !error && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-6">
            <Icon name="Loader2" size={16} className="animate-spin" />
            Готовим окно оплаты...
          </div>
        )}

        {paymentUrl && (
          <div className="space-y-3">
            <iframe
              src={paymentUrl}
              title="Оплата"
              className="w-full h-[480px] rounded-lg border border-gray-200"
            />
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm text-purple-600 hover:underline"
            >
              Окно не открывается? Оплатить в новой вкладке
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetaTransferPayModal;
