import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const PROJECT_ID = '9aa305ff-1848-4c99-a221-27caf72212cf';
const WIDGET_SRC = 'https://cdn.cryptumpay.com/2.3.2/widget.min.js';

interface CryptumPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  wish: string;
  wishIntensity: number;
  fullName: string;
  onPaid: (orderId: string) => void;
}

let widgetPromise: Promise<any> | null = null;

const loadWidget = (): Promise<any> => {
  if (widgetPromise) return widgetPromise;
  widgetPromise = new Promise((resolve, reject) => {
    document.addEventListener('CryptumPay:ready', (event: Event) => resolve((event as CustomEvent).detail), { once: true });
    const script = document.createElement('script');
    script.src = WIDGET_SRC;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onerror = () => {
      widgetPromise = null;
      reject(new Error('load'));
    };
    document.body.appendChild(script);
  });
  return widgetPromise;
};

const CryptumPayModal = ({ isOpen, onClose, amount, wish, wishIntensity, fullName, onPaid }: CryptumPayModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const onPaidRef = useRef(onPaid);
  onPaidRef.current = onPaid;

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setError('');
    setLoading(true);

    loadWidget()
      .then((detail) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = '';
        const holder = document.createElement('div');
        holder.id = 'cryptumpay-button';
        containerRef.current.appendChild(holder);

        const button = new detail.Button('cryptumpay-button');
        button.setOptions({
          projectId: PROJECT_ID,
          projectOrderTitle: `Аффирмация, сила желания ${wishIntensity}/10`,
          projectOrderDescription: `${fullName}: ${wish}`.slice(0, 200),
          defaultFiatCurrency: 'RUB',
          defaultFiatAmount: String(amount)
        });
        button.onFinishOrder((orderId: string) => {
          onPaidRef.current(orderId);
        });
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Не удалось загрузить платёжную систему. Попробуйте ещё раз позже.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [isOpen, amount, wish, wishIntensity, fullName]);

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
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{error}</div>
          )}

          {loading && !error && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Icon name="Loader2" size={16} className="animate-spin" />
              Загружаем оплату...
            </div>
          )}

          <div ref={containerRef} className="flex justify-center" />
        </div>
      </div>
    </div>
  );
};

export default CryptumPayModal;
