import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import funcUrls from '../../backend/func2url.json';

interface PaymentWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  wish: string;
  wishIntensity: number;
  fullName: string;
}


const PaymentWidgetModal = ({ isOpen, onClose, amount, wish, wishIntensity, fullName }: PaymentWidgetModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    setError('');
    setIsLoading(true);

    fetch(funcUrls['paysweb-payment'], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, wish, wishIntensity, fullName })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.form_action) {
          throw new Error(data.error || 'Не удалось создать платёж');
        }
        const form = document.createElement('form');
        form.method = 'post';
        form.action = data.form_action;
        Object.entries(data.fields as Record<string, string>).forEach(([name, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || 'Не удалось создать платёж');
      });

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, amount, wish, wishIntensity, fullName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm p-8 text-center">
        <div className="flex justify-end -mt-2 -mr-2 mb-2">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="X" size={22} />
          </button>
        </div>

        {isLoading && !error && (
          <>
            <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Переходим к оплате...</p>
          </>
        )}

        {error && (
          <>
            <Icon name="AlertCircle" size={40} className="text-red-500 mx-auto mb-3" />
            <p className="text-gray-800 font-medium mb-4">{error}</p>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-6 rounded-xl transition-colors duration-200"
            >
              Закрыть
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentWidgetModal;
