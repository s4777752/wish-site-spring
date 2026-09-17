import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface FreeKassaModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaid: () => void;
}

const FREEKASSA_API_KEY = '162c9f4960b208b3b6e9d1e04ad96e7c';
const FREEKASSA_SHOP_ID = '76166';

const FreeKassaModal = ({ isOpen, onClose, amount, onPaid }: FreeKassaModalProps) => {
  if (!isOpen) return null;

  const widgetUrl = `https://widgets.freekassa.net?type=payment-window&lang=ru&theme=dark&default_amount=${amount}&api_key=${FREEKASSA_API_KEY}&shopID=${FREEKASSA_SHOP_ID}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Оплата</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center mb-4">
          <p className="text-sm text-gray-600 mb-1">Сумма к оплате:</p>
          <p className="text-2xl font-bold text-purple-600">{amount} ₽</p>
        </div>

        <div className="flex justify-center mb-4">
          <iframe
            src={widgetUrl}
            width="300"
            height="590"
            frameBorder="0"
            title="FreeKassa Payment Widget"
            className="rounded-lg"
          />
        </div>

        <Button
          onClick={onPaid}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
        >
          Я оплатил(а)
        </Button>
      </div>
    </div>
  );
};

export default FreeKassaModal;
