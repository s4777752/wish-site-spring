import { useState, useEffect } from 'react';
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

const CrocoPayModal = ({ isOpen, onClose, amount, wish, wishIntensity, fullName }: CrocoPayModalProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setIsCreating(false);
    }
  }, [isOpen]);

  const createPaymentLink = async () => {
    setIsCreating(true);
    setError('');
    try {
      const response = await fetch(funcUrls['crocopay-payment'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, wish, wishIntensity, fullName })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Не удалось создать счёт');
        return;
      }

      window.location.href = data.redirect_url;
    } catch (e) {
      setError('Ошибка соединения с платёжной системой');
    } finally {
      setIsCreating(false);
    }
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

          <p className="text-gray-600 text-sm text-center">
            Вы перейдёте на защищённую страницу оплаты CrocoPay, где сможете выбрать способ оплаты
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            onClick={createPaymentLink}
            disabled={isCreating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
          >
            {isCreating ? 'Переходим к оплате...' : 'Перейти к оплате'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrocoPayModal;
