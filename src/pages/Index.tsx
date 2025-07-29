import { useState } from 'react';

export default function Index() {
  const [wishes, setWishes] = useState('');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Главная надпись */}
        <h1 className="text-5xl md:text-7xl font-bold text-black mb-12">
          САЙТ ЖЕЛАНИЙ
        </h1>
        
        {/* Поле для ввода желаний */}
        <div className="space-y-6">
          <p className="text-xl text-gray-700 mb-4">
            Напишите желания
          </p>
          
          <textarea
            value={wishes}
            onChange={(e) => setWishes(e.target.value)}
            placeholder="Введите ваши желания здесь..."
            className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg text-lg resize-none focus:border-blue-500 focus:outline-none"
          />
          
          <div className="space-y-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors">
              ОК
            </button>
            
            <p className="text-lg text-gray-600">
              После "ОК" → Оплата
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}