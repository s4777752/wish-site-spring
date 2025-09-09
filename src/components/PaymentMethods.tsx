import React from 'react';
import { Button } from '@/components/ui/button';

interface PaymentMethodsProps {
  getAmountFromIntensity: (intensity: number) => number;
  wishIntensity: number;
  wish: string;
  onPaymentComplete: () => void;
  deliveryMethod?: 'whatsapp' | 'email' | 'both';
  onUserDataChange?: (email: string, phone: string) => void;
}

const PaymentMethods = ({ getAmountFromIntensity, wishIntensity, wish }: PaymentMethodsProps) => {
  return (
    <div className="space-y-6">
      {/* QR код для оплаты */}
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Для оплаты отсканируйте QR код</h3>
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block shadow-sm">
          <img 
            src="https://cdn.poehali.dev/files/f8b182d3-f618-41a7-be07-1c7313360372.jpg" 
            alt="QR код для оплаты" 
            className="w-48 h-48 mx-auto"
          />
        </div>
        <p className="text-sm text-gray-600">
          Отсканируйте код камерой телефона или в банковском приложении
        </p>

      </div>
      
      {/* Кнопка скачивания документа аффирмации */}
      <Button 
        onClick={() => {
          const documentData = {
            wish: wish,
            intensity: wishIntensity,
            amount: getAmountFromIntensity(wishIntensity),
            email: 'user@example.com',
            userName: 'Пользователь',
            documentId: `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`
          };
          
          // Импортируем и вызываем функцию генерации
          import('../components/DocumentGenerator').then(({ generateAndDownloadDocument }) => {
            generateAndDownloadDocument(documentData);
          });
        }}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 transition-colors duration-200 text-lg hidden"
      >
        📄 Скачать документ аффирмации
      </Button>
    </div>
  );
};

export default PaymentMethods;