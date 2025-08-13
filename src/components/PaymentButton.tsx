interface PaymentButtonProps {
  onPayment?: () => void;
}

const PaymentButton = ({ onPayment }: PaymentButtonProps) => {
  const handlePayment = () => {
    if (onPayment) {
      onPayment();
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 transform hover:scale-105"
    >
      Оплатить и активировать желание
    </button>
  );
};

export default PaymentButton;