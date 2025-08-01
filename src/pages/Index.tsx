import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import TinkoffPayForm from '@/components/TinkoffPayForm';

const Index = () => {
  const [wish, setWish] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [wishIntensity, setWishIntensity] = useState(5);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showSBPForm, setShowSBPForm] = useState(false);
  const [showTinkoffForm, setShowTinkoffForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    terminal: '',
    password: ''
  });

  // Функция для расчета суммы по интенсивности
  const getAmountFromIntensity = (intensity: number) => intensity * 100;
  
  // Функция для получения цвета по интенсивности (от светло-зеленого до темно-зеленого)
  const getColorFromIntensity = (intensity: number) => {
    const lightGreen = { r: 144, g: 238, b: 144 }; // светло-зеленый
    const darkGreen = { r: 0, g: 100, b: 0 }; // темно-зеленый
    
    const ratio = (intensity - 1) / 9; // нормализуем от 0 до 1
    
    const r = Math.round(lightGreen.r + (darkGreen.r - lightGreen.r) * ratio);
    const g = Math.round(lightGreen.g + (darkGreen.g - lightGreen.g) * ratio);
    const b = Math.round(lightGreen.b + (darkGreen.b - lightGreen.b) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handlePayment = () => {
    setShowConfetti(true);
  };

  useEffect(() => {
    let confettiInterval: NodeJS.Timeout;
    
    if (showConfetti) {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a6f', '#c44569', '#786fa6', '#f8b500'];
      
      const createConfetti = () => {
        const confettiPiece = document.createElement('div');
        const size = Math.random() * 8 + 4; // от 4px до 12px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = Math.random() > 0.5 ? 'circle' : 'square';
        
        confettiPiece.style.position = 'fixed';
        confettiPiece.style.width = size + 'px';
        confettiPiece.style.height = size + 'px';
        confettiPiece.style.backgroundColor = color;
        confettiPiece.style.left = Math.random() * 100 + '%';
        confettiPiece.style.top = '-20px';
        confettiPiece.style.zIndex = '1000';
        confettiPiece.style.pointerEvents = 'none';
        confettiPiece.style.borderRadius = shape === 'circle' ? '50%' : '0';
        
        const duration = Math.random() * 4 + 3; // от 3s до 7s
        const rotation = Math.random() * 360;
        
        confettiPiece.style.animation = `confetti-fall ${duration}s linear infinite`;
        confettiPiece.style.transform = `rotate(${rotation}deg)`;
        
        document.body.appendChild(confettiPiece);
        
        // Удаляем элемент после анимации
        setTimeout(() => {
          if (confettiPiece.parentNode) {
            confettiPiece.parentNode.removeChild(confettiPiece);
          }
        }, duration * 1000);
      };
      
      // Создаем конфетти каждые 100мс
      confettiInterval = setInterval(createConfetti, 100);
    }
    
    return () => {
      if (confettiInterval) {
        clearInterval(confettiInterval);
      }
    };
  }, [showConfetti]);

  const handleWishSubmit = () => {
    if (wish.trim()) {
      setShowPayment(true);
    }
  };

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0.3;
          }
        }
      `}</style>
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-black mb-8 animate-fade-in">
            САЙТ ЖЕЛАНИЙ
          </h1>
          
          <div className="space-y-6 animate-fade-in">
            <p className="text-lg text-gray-600 mb-8">
              Напишите желания после "ОК" оплата
            </p>
            
            <div className="max-w-lg mx-auto space-y-4">
              <Textarea
                placeholder="Напишите ваше желание..."
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-indigo-500 transition-colors"
              />
              
              <Button 
                onClick={handleWishSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-6 rounded-lg transition-all hover:scale-105"
                disabled={!wish.trim()}
              >
                ОК
              </Button>
              
              {/* Payment Section - показывается сразу на той же странице */}
              {showPayment && (
                <Card className="border-2 border-indigo-200 shadow-lg animate-scale-in mt-8">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-black mb-4">
                      Страница оплаты
                    </CardTitle>
                    <p className="text-gray-600">
                      Ваше желание: "{wish}"
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold mb-4">Укажите силу вашего желания</h3>
                      <p className="text-gray-600 text-sm">Чем сильнее желание, тем больше энергии вы вкладываете в его исполнение</p>
                    </div>
                    
                    <div className="space-y-6 mb-6">
                      {/* Индикатор силы желания */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Слабое желание</span>
                          <span>Сильное желание</span>
                        </div>
                        
                        <div className="relative">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={wishIntensity}
                            onChange={(e) => {
                              const intensity = parseInt(e.target.value);
                              setWishIntensity(intensity);
                              setSelectedAmount(getAmountFromIntensity(intensity));
                            }}
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, 
                                rgb(144, 238, 144) 0%, 
                                rgb(124, 252, 0) 20%, 
                                rgb(50, 205, 50) 40%, 
                                rgb(34, 139, 34) 60%, 
                                rgb(0, 128, 0) 80%, 
                                rgb(0, 100, 0) 100%)`
                            }}
                          />
                          <style>{`
                            input[type="range"]::-webkit-slider-thumb {
                              appearance: none;
                              width: 24px;
                              height: 24px;
                              border-radius: 50%;
                              background: ${getColorFromIntensity(wishIntensity)};
                              border: 3px solid white;
                              box-shadow: 0 0 10px rgba(0,0,0,0.3);
                              cursor: pointer;
                            }
                            input[type="range"]::-moz-range-thumb {
                              width: 24px;
                              height: 24px;
                              border-radius: 50%;
                              background: ${getColorFromIntensity(wishIntensity)};
                              border: 3px solid white;
                              box-shadow: 0 0 10px rgba(0,0,0,0.3);
                              cursor: pointer;
                            }
                          `}</style>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <span key={num} className={wishIntensity === num ? 'font-bold text-gray-800' : ''}>
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Визуальная карточка с силой желания */}
                      <div 
                        className="p-6 rounded-xl border-3 text-center transition-all duration-300"
                        style={{
                          backgroundColor: getColorFromIntensity(wishIntensity) + '20',
                          borderColor: getColorFromIntensity(wishIntensity)
                        }}
                      >
                        <div className="text-3xl font-bold mb-2" style={{ color: getColorFromIntensity(wishIntensity) }}>
                          Сила: {wishIntensity}/10
                        </div>
                        <div className="text-lg text-gray-700 mb-1">
                          Энергия желания: <span className="font-semibold">{getAmountFromIntensity(wishIntensity)} ₽</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {wishIntensity <= 3 && "Легкое желание - небольшая энергия"}
                          {wishIntensity >= 4 && wishIntensity <= 6 && "Умеренное желание - средняя энергия"}
                          {wishIntensity >= 7 && wishIntensity <= 8 && "Сильное желание - большая энергия"}
                          {wishIntensity >= 9 && "Очень сильное желание - максимальная энергия"}
                        </div>
                      </div>
                    </div>
                    
                    {wishIntensity && (
                      <div className="space-y-4">
                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-indigo-600 mb-1">₽ {getAmountFromIntensity(wishIntensity)}</div>
                          <p className="text-gray-600">Энергетический вклад в исполнение желания</p>
                        </div>
                        
                        {!showTinkoffForm ? (
                          <Button 
                            onClick={() => setShowTinkoffForm(true)}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6 rounded-lg"
                          >
                            <Icon name="Banknote" size={20} className="mr-2" />
                            Тинькофф Эквайринг
                          </Button>
                        ) : showTinkoffForm ? (
                          <div className="space-y-4">
                            <TinkoffPayForm 
                              amount={getAmountFromIntensity(wishIntensity)} 
                              onPaymentComplete={handlePayment}
                            />
                            <Button 
                              onClick={() => setShowTinkoffForm(false)}
                              variant="outline"
                              className="w-full"
                            >
                              Назад к выбору способа оплаты
                            </Button>
                          </div>
                        ) : showSBPForm ? (
                          <div className="space-y-4">
                            <div className="text-center mb-4">
                              <h4 className="text-lg font-semibold text-blue-600 mb-2">Система быстрых платежей</h4>
                              <p className="text-sm text-gray-600">Оплата по номеру телефона через банковское приложение</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Номер телефона
                              </label>
                              <Input
                                type="tel"
                                placeholder="+7 (___) ___-__-__"
                                value={phoneNumber}
                                onChange={(e) => {
                                  let value = e.target.value.replace(/\D/g, '');
                                  if (value.startsWith('8')) value = '7' + value.slice(1);
                                  if (value.startsWith('7') && value.length <= 11) {
                                    const formatted = value.length > 1 ? 
                                      `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}` :
                                      value;
                                    setPhoneNumber(formatted);
                                  } else if (value.length <= 11) {
                                    setPhoneNumber(value);
                                  }
                                }}
                                className="text-lg"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Выберите банк
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { name: 'Сбербанк', icon: '🟢' },
                                  { name: 'ВТБ', icon: '🔵' },
                                  { name: 'Тинькофф', icon: '🟡' },
                                  { name: 'Альфа-Банк', icon: '🔴' },
                                  { name: 'Газпромбанк', icon: '⚫' },
                                  { name: 'Другой банк', icon: '💳' }
                                ].map((bank) => (
                                  <button
                                    key={bank.name}
                                    onClick={() => setSelectedBank(bank.name)}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105 ${
                                      selectedBank === bank.name
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                                    }`}
                                  >
                                    <div className="text-lg mb-1">{bank.icon}</div>
                                    {bank.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex space-x-3">
                              <Button 
                                onClick={() => {
                                  setShowSBPForm(false);
                                  setPhoneNumber('');
                                  setSelectedBank('');
                                }}
                                variant="outline"
                                className="flex-1"
                              >
                                Назад
                              </Button>
                              <Button 
                                onClick={handlePayment}
                                disabled={!phoneNumber.includes('+7') || !selectedBank}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Icon name="Smartphone" size={20} className="mr-2" />
                                Оплатить {getAmountFromIntensity(wishIntensity)} ₽
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Номер карты
                                </label>
                                <Input
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  value={cardData.number}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                    if (value.length <= 19) {
                                      setCardData({...cardData, number: value});
                                    }
                                  }}
                                  className="text-lg"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Срок действия
                                  </label>
                                  <Input
                                    type="text"
                                    placeholder="ММ/ГГ"
                                    value={cardData.expiry}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/\D/g, '');
                                      if (value.length >= 2) {
                                        value = value.substring(0,2) + '/' + value.substring(2,4);
                                      }
                                      if (value.length <= 5) {
                                        setCardData({...cardData, expiry: value});
                                      }
                                    }}
                                    className="text-lg"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CVV
                                  </label>
                                  <Input
                                    type="text"
                                    placeholder="123"
                                    maxLength={3}
                                    value={cardData.cvv}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '');
                                      setCardData({...cardData, cvv: value});
                                    }}
                                    className="text-lg"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Имя на карте
                                </label>
                                <Input
                                  type="text"
                                  placeholder="IVAN PETROV"
                                  value={cardData.name}
                                  onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                                  className="text-lg"
                                />
                              </div>
                            </div>
                            
                            <div className="flex space-x-3">
                              <Button 
                                onClick={() => setShowCardForm(false)}
                                variant="outline"
                                className="flex-1"
                              >
                                Назад
                              </Button>
                              <Button 
                                onClick={handlePayment}
                                disabled={!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                <Icon name="Sparkles" size={20} className="mr-2" />
                                Оплатить {getAmountFromIntensity(wishIntensity)} ₽
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Rules Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            Правила использования
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Icon name="BookOpen" size={24} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Как это работает</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Напишите ваше желание в форме выше</li>
                    <li>• Нажмите "ОК" для перехода к оплате</li>
                    <li>• Выберите удобный способ оплаты</li>
                    <li>• Ваше желание будет передано во Вселенную</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Icon name="Shield" size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Гарантии безопасности</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Данные защищены SSL-шифрованием</li>
                    <li>• Соответствие ФЗ-152 о персональных данных</li>
                    <li>• Безопасная оплата через банки РФ</li>
                    <li>• Поддержка 24/7 на русском языке</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Icon name="Star" size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Позитивные желания</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Любовь и гармоничные отношения</li>
                    <li>• Карьерный рост и самореализация</li>
                    <li>• Здоровье и внутренний баланс</li>
                    <li>• Финансовое благополучие</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Icon name="AlertTriangle" size={24} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Этические ограничения</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Запрет на причинение вреда людям</li>
                    <li>• Соблюдение морально-этических норм</li>
                    <li>• Исключение противоправных желаний</li>
                    <li>• Фокус на личностном росте</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <Icon name="Heart" size={24} className="text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Психологический эффект</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Активация подсознательных процессов</li>
                    <li>• Формирование позитивного мышления</li>
                    <li>• Усиление внутренней мотивации</li>
                    <li>• Направление энергии на цель</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Icon name="Scale" size={24} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Правовые основы</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Соглашение согласно ГК РФ</li>
                    <li>• Защита прав потребителей</li>
                    <li>• Возврат средств в течение 14 дней</li>
                    <li>• Разрешение споров в РФ</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Используя сервис, вы соглашаетесь с 
              <a href="/terms" className="text-purple-600 hover:text-purple-700 underline ml-1">
                Пользовательским соглашением
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Психологическое воздействие основано на принципах позитивной психологии и не является медицинской услугой
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2024 Сайт Желаний. Все права защищены.
          </p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Index;