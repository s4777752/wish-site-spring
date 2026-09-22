import Icon from '@/components/ui/icon';

interface FreeKassaWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

const FreeKassaWidget = ({ isOpen, onClose, amount }: FreeKassaWidgetProps) => {
  if (!isOpen) return null;

  const widgetUrl = `https://widgets.freekassa.net?type=payment-window&lang=ru&theme=dark&default_amount=${Math.round(amount)}&i=${encodeURIComponent('Сайт Желаний')}&api_key=03ba77eb6eccd96e48020c6470d7d2dc&shopID=76166`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 max-w-[340px] w-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-800">Оплата</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="X" size={22} />
          </button>
        </div>

        <iframe
          src={widgetUrl}
          width="300"
          height="590"
          frameBorder="0"
          className="mx-auto rounded-lg"
          title="FreeKassa Payment Widget"
        />
      </div>
    </div>
  );
};

export default FreeKassaWidget;