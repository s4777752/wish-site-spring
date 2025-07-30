import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [wish, setWish] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const amounts = [250, 500, 1000, 1500, 2000, 2500];

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
                      <h3 className="text-xl font-semibold mb-4">Выберите сумму оплаты</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {amounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setSelectedAmount(amount)}
                          className={`p-4 rounded-lg border-2 text-lg font-semibold transition-all hover:scale-105 ${
                            selectedAmount === amount
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-300'
                          }`}
                        >
                          ₽ {amount}
                        </button>
                      ))}
                    </div>
                    
                    {selectedAmount && (
                      <div className="space-y-4">
                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-indigo-600 mb-1">₽ {selectedAmount}</div>
                          <p className="text-gray-600">За исполнение желания</p>
                        </div>
                        
                        {!showCardForm ? (
                          <Button 
                            onClick={() => setShowCardForm(true)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-6 rounded-lg"
                          >
                            <Icon name="CreditCard" size={20} className="mr-2" />
                            Оплатить картой
                          </Button>
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
                                Оплатить {selectedAmount} ₽
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <h3 className="text-xl font-semibold mb-3">Гарантии</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Ваши данные защищены</li>
                    <li>• Анонимность гарантирована</li>
                    <li>• Безопасная оплата</li>
                    <li>• Поддержка 24/7</li>
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
                  <h3 className="text-xl font-semibold mb-3">Что можно желать</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Любовь и отношения</li>
                    <li>• Карьера и успех</li>
                    <li>• Здоровье и благополучие</li>
                    <li>• Материальное благосостояние</li>
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
                  <h3 className="text-xl font-semibold mb-3">Ограничения</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Не навредить другим людям</li>
                    <li>• Желания должны быть этичными</li>
                    <li>• Исполнение может занять время</li>
                    <li>• Результат не гарантирован</li>
                  </ul>
                </div>
              </div>
            </Card>
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