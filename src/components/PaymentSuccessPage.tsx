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
    
    // Создаем конвольвер для реверберации
    const convolver = audioContext.createConvolver();
    const reverbGain = audioContext.createGain();
    const dryGain = audioContext.createGain();
    const masterGain = audioContext.createGain();
    
    // Настройки для mix dry/wet сигнала
    dryGain.gain.value = 0.6; // Сухой сигнал
    reverbGain.gain.value = 0.4; // Сигнал с реверберацией
    masterGain.gain.value = 0.3; // Общая громкость
    
    // Создаем импульсную характеристику для реверберации (имитация большого зала)
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * 2; // 2 секунды реверберации
    const impulse = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Создаем затухающий белый шум для имитации реверберации зала
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.1;
      }
    }
    
    convolver.buffer = impulse;
    
    // Подключаем цепочку эффектов
    dryGain.connect(masterGain);
    reverbGain.connect(convolver);
    convolver.connect(masterGain);
    masterGain.connect(audioContext.destination);
    
    // Торжественные ноты (расширенная последовательность)
    const frequencies = [
      261, 330, 392, 523, // C4, E4, G4, C5 - основной аккорд
      659, 784, 1047, 1319, 1568 // E5, G5, C6, E6, G6 - высокие ноты
    ];
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Подключаем к обеим цепочкам (сухой и с реверберацией)
      oscillator.connect(gainNode);
      gainNode.connect(dryGain);
      gainNode.connect(reverbGain);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'triangle';
      
      // Более плавное нарастание и затухание для торжественности
      const startTime = audioContext.currentTime + index * 0.08;
      const duration = 0.6;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
    
    // Добавляем дополнительный "взрыв" в начале
    const explosionOsc = audioContext.createOscillator();
    const explosionGain = audioContext.createGain();
    
    explosionOsc.connect(explosionGain);
    explosionGain.connect(dryGain);
    explosionGain.connect(reverbGain);
    
    explosionOsc.type = 'sawtooth';
    explosionOsc.frequency.setValueAtTime(80, audioContext.currentTime);
    explosionOsc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    explosionGain.gain.setValueAtTime(0.2, audioContext.currentTime);
    explosionGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    explosionOsc.start(audioContext.currentTime);
    explosionOsc.stop(audioContext.currentTime + 0.15);
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