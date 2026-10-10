import Icon from '@/components/ui/icon';

interface PayWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  wish: string;
  wishIntensity: number;
  fullName: string;
}

const BetaTransferPayModal = ({ isOpen, onClose, amount, wish, wishIntensity, fullName }: PayWidgetModalProps) => {
  if (!isOpen) return null;

  const handlePaid = () => {
    const orderId = `order-${Date.now()}`;
    window.location.href = `/payment-success?manual=1&orderId=${orderId}&amount=${amount}&intensity=${wishIntensity}&wish=${encodeURIComponent(wish)}&name=${encodeURIComponent(fullName)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[95vh] overflow-y-auto">
        <div className="relative mb-4 text-center">
          <h3 className="text-2xl font-bold text-gray-800">Оплата</h3>
          <p className="text-xs text-gray-500">донат</p>
          <button onClick={onClose} className="absolute top-0 right-0 text-gray-400 hover:text-gray-600">
            <Icon name="X" size={24} />
          </button>
        </div>

        <form
          action="https://donat24.ru/index.php"
          method="post"
          target="_blank"
          className="space-y-3"
        >
          <input type="hidden" name="url" value="w" />
          <input type="hidden" name="p" value="90" />
          <input type="hidden" name="widget" value="90" />
          <input
            type="text"
            name="name"
            defaultValue={fullName}
            placeholder="Ваше имя"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
          <input
            type="number"
            name="total"
            defaultValue={amount}
            placeholder="Сумма оплаты"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
          >
            Оплатить {amount} ₽
          </button>
        </form>

        <button
          onClick={handlePaid}
          className="w-full mt-4 border border-purple-600 text-purple-700 hover:bg-purple-50 font-semibold py-3 px-6 rounded-xl"
        >
          Я оплатил
        </button>
      </div>
    </div>
  );
};

export default BetaTransferPayModal;