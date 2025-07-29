import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [wish, setWish] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const amounts = [250, 500, 1000, 1500, 2000, 2500];

  const handleWishSubmit = () => {
    if (wish.trim()) {
      setShowPayment(true);
    }
  };

  return (
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
                        
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6 rounded-lg">
                          <Icon name="Sparkles" size={20} className="mr-2" />
                          Оплатить {selectedAmount} руб
                        </Button>
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
  );
};

export default Index;