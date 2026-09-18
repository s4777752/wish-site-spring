import React, { useState, useEffect } from 'react';
import { sendAffirmationEmail } from '@/utils/emailService';

interface PaymentFormProps {
  terminalKey: string;
  wish?: string;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

declare global {
  interface Window {
    pay: (form: HTMLFormElement) => void;
  }
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  terminalKey, 
  wish = '',
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.amount) {
      alert('Пожалуйста, укажите сумму');
      return;
    }

    if (!formData.email && !formData.phone) {
      alert('Поле E-mail или телефон не должно быть пустым');
      return;
    }

    const form = e.currentTarget;
    
    // Устанавливаем receipt если нужен чек
    const receiptInput = form.querySelector('input[name="receipt"]') as HTMLInputElement;
    if (receiptInput) {
      receiptInput.value = JSON.stringify({
        "EmailCompany": "mail@mail.com",
        "Taxation": "patent",
        "FfdVersion": "1.2",
        "Items": [
          {
            "Name": formData.description || "Энергетический вклад",
            "Price": Math.round(parseFloat(formData.amount) * 100),
            "Quantity": 1.00,
            "Amount": Math.round(parseFloat(formData.amount) * 100),
            "PaymentMethod": "full_prepayment",
            "PaymentObject": "service",
            "Tax": "none",
            "MeasurementUnit": "pc"
          }
        ]
      });
    }

    try {
      if (window.pay) {
        window.pay(form);
        
        // Отправляем документ аффирмации после успешной оплаты
        const orderNumber = `order_${Date.now()}`;
        const timestamp = new Date().toLocaleString('ru-RU');
        
        if (formData.email && formData.name) {
          setTimeout(async () => {
            try {
              await sendAffirmationEmail({
                name: formData.name,
                email: formData.email,
                wish: wish || formData.description || 'Исполнение желания',
                amount: parseFloat(formData.amount),
                orderNumber,
                timestamp
              });
              console.log('Документ аффирмации отправлен на', formData.email);
            } catch (emailError) {
              console.error('Ошибка при отправке документа аффирмации:', emailError);
            }
          }, 2000); // Задержка 2 секунды после успешной оплаты
        }
        
        onPaymentSuccess?.();
      } else {
        throw new Error('Платежная система не загружена');
      }
    } catch (error) {
      onPaymentError?.(error instanceof Error ? error.message : 'Ошибка при обработке платежа');
    }
  };

  return (
    <div className="payment-form-container max-w-md mx-auto">
      <form 
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
      >
        <input type="hidden" name="terminalkey" value={terminalKey} />
        <input type="hidden" name="frame" value="false" />
        <input type="hidden" name="language" value="ru" />
        <input type="hidden" name="receipt" value="" />
        <input type="hidden" name="order" value={`order_${Date.now()}`} />

        <div className="space-y-4">
          <div>
            <input
              type="number"
              name="amount"
              placeholder="Сумма (руб.)"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="1"
              step="1"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <input
              type="text"
              name="description"
              placeholder="Описание платежа"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <input
              type="text"
              name="name"
              placeholder="ФИО плательщика"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Контактный телефон"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            💳 Оплатить
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;