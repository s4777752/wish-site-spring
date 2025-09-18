import React, { useState, useEffect } from 'react';
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
  const [showConfetti, setShowConfetti] = useState(true);
  const [showFireworks, setShowFireworks] = useState(true);
  
  console.log('PaymentSuccessPage рендерится, showConfetti:', showConfetti);

  const playConfettiSound = async () => {
    try {
      // Создаем звук конфетти с помощью Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Возобновляем контекст если он приостановлен (нужно для современных браузеров)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    
      // Создаем конвольвер для реверберации
      const convolver = audioContext.createConvolver();
      const reverbGain = audioContext.createGain();
      const dryGain = audioContext.createGain();
      const masterGain = audioContext.createGain();
      
      // Настройки для mix dry/wet сигнала
      dryGain.gain.value = 0.6; // Сухой сигнал
      reverbGain.gain.value = 0.4; // Сигнал с реверберацией
      masterGain.gain.value = 0.3; // Общая громкость
      
      // Создаем импульсную характеристику для реверберации
      const impulseLength = audioContext.sampleRate * 0.5; // 0.5 секунды
      const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);
      
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < impulseLength; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2);
        }
      }
      convolver.buffer = impulse;
      
      // Подключаем эффекты
      const oscillators = [];
      const now = audioContext.currentTime;
      
      // Создаем несколько тонов для имитации взрыва конфетти
      const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      
      frequencies.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.3);
        
        // Envelope для каждого тона
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + index * 0.1);
        
        // Подключаем через dry/wet mix
        osc.connect(gain);
        gain.connect(dryGain);
        gain.connect(convolver);
        convolver.connect(reverbGain);
        
        dryGain.connect(masterGain);
        reverbGain.connect(masterGain);
        masterGain.connect(audioContext.destination);
        
        osc.start(now + index * 0.05);
        osc.stop(now + 0.5 + index * 0.1);
        
        oscillators.push(osc);
      });
      
      console.log('🔊 Звук конфетти воспроизведен успешно');
    } catch (error) {
      console.error('Ошибка воспроизведения звука:', error);
      
      // Fallback - простой beep
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        await audioContext.resume();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        
        console.log('🔊 Fallback звук воспроизведен');
      } catch (fallbackError) {
        console.error('Даже fallback звук не работает:', fallbackError);
      }
    }
  };

  // Автоматически запускаем конфетти и звук при загрузке страницы
  useEffect(() => {
    console.log('🎉 PaymentSuccessPage загружена! Запускаем конфетти и звук!');
    setShowConfetti(true);
    setShowFireworks(true);
    playConfettiSound();
  }, []);

  const handleDownload = () => {
    console.log('🎉 Запускаем конфетти при скачивании!');
    setShowConfetti(true);
    setShowFireworks(true);
    playConfettiSound();
    onDownload();
  };

  const handleClose = () => {
    console.log('🎉 Запускаем конфетти при закрытии!');
    setShowConfetti(true);
    setShowFireworks(true);
    playConfettiSound();
    setTimeout(() => {
      onClose();
    }, 1000); // Даём время для конфетти
  };

  // Компонент салюта
  const Fireworks = () => (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 99998 }}>
      {showFireworks && Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
          style={{
            left: `${20 + i * 10}%`,
            top: `${15 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.5s'
          }}
        >
          {/* Искры салюта */}
          {Array.from({ length: 6 }).map((_, j) => (
            <div
              key={j}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                backgroundColor: ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'][j],
                left: `${Math.cos(j * 60 * Math.PI / 180) * 20}px`,
                top: `${Math.sin(j * 60 * Math.PI / 180) * 20}px`,
                animationDelay: `${i * 0.2 + j * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      ))}
      
      {/* Дополнительные большие салюты */}
      {showFireworks && Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`big-${i}`}
          className="absolute"
          style={{
            left: `${30 + i * 15}%`,
            top: `${25 + (i % 2) * 30}%`,
            animation: `firework-${i} 2s ease-out infinite`,
            animationDelay: `${i * 0.5}s`
          }}
        >
          {Array.from({ length: 12 }).map((_, j) => (
            <div
              key={j}
              className="absolute w-1 h-6 rounded-full origin-bottom"
              style={{
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'][j % 6],
                transform: `rotate(${j * 30}deg)`,
                animation: 'spark 2s ease-out infinite',
                animationDelay: `${i * 0.5 + j * 0.05}s`
              }}
            />
          ))}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes firework-0 {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          20% { transform: scale(0.5) rotate(180deg); opacity: 1; }
          100% { transform: scale(1.5) rotate(360deg); opacity: 0; }
        }
        @keyframes firework-1 {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          25% { transform: scale(0.7) rotate(90deg); opacity: 1; }
          100% { transform: scale(2) rotate(270deg); opacity: 0; }
        }
        @keyframes firework-2 {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          30% { transform: scale(0.8) rotate(180deg); opacity: 1; }
          100% { transform: scale(1.8) rotate(540deg); opacity: 0; }
        }
        @keyframes firework-3 {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          35% { transform: scale(0.6) rotate(270deg); opacity: 1; }
          100% { transform: scale(2.2) rotate(720deg); opacity: 0; }
        }
        @keyframes spark {
          0% { transform: scaleY(0); opacity: 1; }
          50% { transform: scaleY(1); opacity: 0.8; }
          100% { transform: scaleY(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center z-50">
      {/* Салют */}
      <Fireworks />
      
      {/* Конфетти компонент */}
      <div style={{ zIndex: 99999 }}>
        <SimpleConfetti isActive={showConfetti} />
      </div>
      
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center relative z-10">
        {/* Иконка успеха с анимацией */}
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Icon name="Check" className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-pulse">
          🎉 Поздравляем! 🎉
        </h1>
        
        <h2 className="text-xl font-semibold text-green-600 mb-4">
          Желание активировано!
        </h2>

        {/* Сумма */}
        <div className="text-lg text-gray-600 mb-8">
          Энергетический вклад: <span className="font-bold text-green-600">{amount} ₽</span>
        </div>

        {/* Кнопка скачивания */}
        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 mb-4 flex items-center justify-center gap-2 transform hover:scale-105"
        >
          <Icon name="Download" size={20} />
          Скачать документ аффирмации
        </button>

        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
        >
          ✨ Завершить ритуал ✨
        </button>

        {/* Вдохновляющее сообщение */}
        <p className="text-sm text-gray-600 mt-6 italic">
          🌟 Ваше желание получило мощную энергетическую поддержку! 
          <br />
          💫 Вселенная уже работает над его исполнением...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;