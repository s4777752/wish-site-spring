import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WishActivatedProps {
  wish: string;
  onBackToHome: () => void;
}

const WishActivated = ({ wish, onBackToHome }: WishActivatedProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <div className={`transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <div className="mb-6 relative">
              <div className="text-8xl animate-bounce">✨</div>
              <div className="absolute inset-0 animate-pulse">
                <div className="text-8xl">🌟</div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Ваше желание активировано!
            </h1>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700 font-medium text-lg">
                "{wish}"
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Icon name="CheckCircle" size={24} />
                <span className="font-medium">Оплата успешно обработана</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Icon name="FileText" size={24} />
                <span className="font-medium">Документ аффирмации отправлен</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Icon name="Sparkles" size={24} />
                <span className="font-medium">Энергия желания активирована</span>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">
                <Icon name="Info" size={16} className="inline mr-2" />
                Документ аффирмации содержит специальные инструкции для усиления вашего желания. 
                Следуйте рекомендациям для достижения максимального результата.
              </p>
            </div>
            
            <Button 
              onClick={onBackToHome}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 rounded-lg"
            >
              <Icon name="Home" size={20} className="mr-2" />
              Вернуться на главную
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WishActivated;