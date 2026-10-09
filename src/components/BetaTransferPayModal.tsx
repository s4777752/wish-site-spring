import Icon from '@/components/ui/icon';

interface PayWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  wish: string;
  wishIntensity: number;
  fullName: string;
}

const BetaTransferPayModal = ({ isOpen, onClose, amount, wish, wishIntensity }: PayWidgetModalProps) => {
  if (!isOpen) return null;

  const handlePaid = () => {
    const orderId = `order-${Date.now()}`;
    window.location.href = `/payment-success?manual=1&orderId=${orderId}&amount=${amount}&intensity=${wishIntensity}&wish=${encodeURIComponent(wish)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Оплата</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-center mb-4">
          <p className="text-sm text-gray-600 mb-1">Сумма к оплате:</p>
          <p className="text-2xl font-bold text-purple-600">{amount} ₽</p>
          <p className="text-xs text-gray-500 mt-1">Укажите эту сумму в окне оплаты ниже</p>
        </div>

        <iframe
          src="https://donat24.ru/w/89"
          title="Оплата"
          width="100%"
          height="300"
          frameBorder="0"
        />

        <button
          onClick={handlePaid}
          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
        >
          Я оплатил
        </button>
      </div>
    </div>
  );
};

export default BetaTransferPayModal;