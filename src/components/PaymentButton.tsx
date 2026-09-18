import { useState } from 'react';
import PaymentSuccessAnimation from './PaymentSuccessAnimation';

const PaymentButton = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  const handlePayment = () => {
    // Симуляция успешной оплаты
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  return (
    <>
      <button
        onClick={handlePayment}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 transform hover:scale-105"
      >
        Оплатить и активировать желание
      </button>

      {showAnimation && (
        <PaymentSuccessAnimation onComplete={handleAnimationComplete} />
      )}
    </>
  );
};

export default PaymentButton;