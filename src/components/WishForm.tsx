import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface WishFormProps {
  wish: string;
  setWish: (wish: string) => void;
  onSubmit: () => void;
  showPayment: boolean;
  paymentSection?: React.ReactNode;
  onConfettiStart?: () => void;
}

const WishForm = ({ wish, setWish, onSubmit, showPayment, paymentSection, onConfettiStart }: WishFormProps) => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4" aria-labelledby="main-heading">
      <div className="text-center max-w-2xl mx-auto">
        <h1 id="main-heading" className="text-6xl md:text-8xl font-bold text-black mb-8 animate-fade-in">
          САЙТ ЖЕЛАНИЙ
        </h1>
        
        <div className="space-y-6 animate-fade-in">
          <p id="wish-description" className="text-lg text-gray-600 mb-8">
            Напишите желания после "ОК" оплата
          </p>
          
          <div className="max-w-lg mx-auto space-y-4">
            <Textarea
              placeholder="Напишите ваше желание..."
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-indigo-500 transition-colors"
              aria-label="Поле для ввода желания"
              aria-describedby="wish-description"
              aria-required="true"
            />
            
            <Button 
              onClick={() => {
                onSubmit();
                if (onConfettiStart) {
                  onConfettiStart();
                }
                console.log('ОК кнопка нажата! Запускаю конфетти...');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-6 rounded-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              disabled={!wish.trim()}
              aria-describedby="wish-description"
              type="button"
            >
              ОК
            </Button>
            
            {/* Payment Section - показывается рядом с кнопкой ОК */}
            {showPayment && paymentSection && (
              <div className="mt-8">
                {paymentSection}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WishForm;