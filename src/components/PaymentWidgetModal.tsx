import { useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface PaymentWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaid: () => void;
}

const WIDGET_URL = 'https://r45-12-form.com/widget?shop_id=872&sign=9e4ce1e724350f650ba4cc0384b7bcefd18951e150afd2005bb8ea9ff108988c';

const PaymentWidgetModal = ({ isOpen, onClose, onPaid }: PaymentWidgetModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">Оплата</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <iframe
            src={WIDGET_URL}
            title="Оплата"
            className="w-full h-full border-0"
            allow="payment"
          />
        </div>

        <div className="px-6 py-4 border-t">
          <button
            onClick={onPaid}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Я оплатил(а)
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentWidgetModal;
