import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            <Icon name="X" className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Оплата отменена
        </h1>

        <p className="text-gray-600 mb-6">
          Вы отменили оплату или она не была завершена. Ничего страшного — можно попробовать ещё раз.
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
