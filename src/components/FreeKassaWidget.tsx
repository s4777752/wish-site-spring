import Icon from '@/components/ui/icon';

interface FreeKassaWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

const FreeKassaWidget = ({ isOpen, onClose, amount }: FreeKassaWidgetProps) => {
  if (!isOpen) return null;

  const widgetUrl = `https://widgets.freekassa.net?type=payment-button&currency=RUB&destination=${encodeURIComponent('Сайт Желаний')}&theme=dark&default_amount=${Math.round(amount)}&button_text=Оплатить&button_size=48px&shopId=76166&s=13cd1703382cfdddfd02d252ab3fba2d`;

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
          height="50"
          frameBorder="0"
          className="mx-auto rounded-lg"
          title="FreeKassa Payment Widget"
        />
      </div>
    </div>
  );
};

export default FreeKassaWidget;