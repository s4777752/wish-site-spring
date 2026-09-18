import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface PaymentComplaintProps {
  paymentId?: string;
  onComplaintSubmitted?: (failUrl: string) => void;
}

const PaymentComplaint = ({ paymentId: initialPaymentId, onComplaintSubmitted }: PaymentComplaintProps) => {
  const [paymentId, setPaymentId] = useState(initialPaymentId || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitComplaint = async () => {
    if (!paymentId.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите ID платежа",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/1da138ed-0167-47c5-8fb7-6c8dce558dd5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Жалоба подана",
          description: "Ваша жалоба успешно отправлена в платежную систему 1plat",
        });

        if (onComplaintSubmitted && data.fail_url) {
          onComplaintSubmitted(data.fail_url);
        }
      } else {
        throw new Error(data.error || 'Ошибка при подаче жалобы');
      }
    } catch (error) {
      console.error('Payment complaint error:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось подать жалобу",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 border border-red-200 rounded-lg bg-red-50">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">⚠️</span>
        <h3 className="text-lg font-semibold text-red-900">
          Проблема с платежом?
        </h3>
      </div>
      
      <p className="text-red-800">
        Если у вас возникли проблемы с платежом, вы можете подать жалобу через платежную систему 1plat.
      </p>

      <div className="space-y-3">
        <div>
          <label htmlFor="payment-id" className="block text-sm font-medium text-red-900 mb-1">
            ID платежа:
          </label>
          <Input
            id="payment-id"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="Введите ID платежа"
            className="border-red-300 focus:border-red-500"
          />
        </div>

        <Button
          onClick={handleSubmitComplaint}
          disabled={loading || !paymentId.trim()}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Подача жалобы...
            </>
          ) : (
            'Подать жалобу на платеж'
          )}
        </Button>
      </div>

      <div className="text-xs text-red-600 space-y-1">
        <p>• Жалоба будет обработана платежной системой 1plat</p>
        <p>• Вы получите уведомление о результате на email</p>
        <p>• Обработка может занять от 1 до 3 рабочих дней</p>
      </div>
    </div>
  );
};

export default PaymentComplaint;