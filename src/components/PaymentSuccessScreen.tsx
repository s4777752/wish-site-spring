import React from 'react';

interface DocumentData {
  wish: string;
  intensity: number;
  amount: number;
  email: string;
  userName: string;
  documentId: string;
}

interface PaymentSuccessScreenProps {
  documentData: DocumentData;
  onDownload: () => void;
  onBackToHome: () => void;
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({
  documentData,
  onDownload,
  onBackToHome
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
      <div className="mb-6">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Оплата успешна!</h2>
        <p className="text-gray-600">Ваш документ аффирмации готов</p>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-green-800 font-medium">
          🎯 Желание: "{documentData.wish}"
        </p>
        <p className="text-green-600 text-sm mt-1">
          💫 Документ #{documentData.documentId}
        </p>
      </div>

      <button
        onClick={onDownload}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mb-4 transition-colors"
      >
        📄 Скачать документ аффирмации
      </button>

      <button
        onClick={onBackToHome}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Вернуться на главную
      </button>
    </div>
  );
};

export default PaymentSuccessScreen;