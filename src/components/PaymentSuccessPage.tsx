import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import SimpleConfetti from '@/components/SimpleConfetti';

interface PaymentSuccessPageProps {
  onDownload: () => void;
  onClose: () => void;
  amount: number;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({
  onDownload,
  onClose,
  amount
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const playConfettiSound = () => {
    // Создаем звук конфетти с помощью Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Звук взрыва конфетти (быстрая последовательность нот)
    const frequencies = [523, 659, 784, 1047, 1319]; // C5, E5, G5, C6, E6
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'triangle';
      
      // Быстрое затухание для каждой ноты
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.05 + 0.2);
      
      oscillator.start(audioContext.currentTime + index * 0.05);
      oscillator.stop(audioContext.currentTime + index * 0.05 + 0.2);
    });
  };

  const handleDownload = () => {
    setShowConfetti(true);
    playConfettiSound();
    onDownload();
  };

  const handleClose = () => {
    setShowConfetti(true);
    playConfettiSound();
    setTimeout(() => {
      onClose();
    }, 1000); // Даём время для конфетти
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      {/* Конфетти компонент */}
      <SimpleConfetti isActive={showConfetti} />
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
        {/* Иконка успеха */}
        <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Icon name="Check" className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Оплачено
        </h1>

        {/* Сумма */}
        <div className="text-lg text-gray-600 mb-8">
          {amount} ₽
        </div>

        {/* Кнопка скачивания */}
        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 mb-4 flex items-center justify-center gap-2"
        >
          <Icon name="Download" size={20} />
          Скачать документ
        </button>

        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Закрыть окно
        </button>

        {/* Дополнительная информация */}
        <p className="text-sm text-gray-500 mt-6">
          Ваш документ готов к скачиванию. 
          Если скачивание не началось автоматически, нажмите на кнопку выше.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;