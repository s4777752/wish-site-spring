import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { sendWishAffirmationDocument } from '@/components/DocumentEmailService';
import { generateAndDownloadDocument, DocumentData } from '@/components/DocumentGenerator';
import SimpleConfetti from '@/components/SimpleConfetti';
import FinalScreen from '@/components/FinalScreen';
import func2url from '../../backend/func2url.json';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Получаем данные из URL параметров
  const amount = searchParams.get('amount') || '500';
  const wish = searchParams.get('wish') || 'Исполнение желания';
  const intensity = searchParams.get('intensity') || '5';
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const orderId = searchParams.get('orderId') || '';
  const userName = searchParams.get('name') || 'Пользователь';

  const [stars] = useState(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 2 + 1,
    }))
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const [payState, setPayState] = useState<'checking' | 'paid' | 'unpaid' | 'error'>('checking');

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    let stored: { orderId?: string; invoiceId?: string } = {};
    try {
      stored = JSON.parse(localStorage.getItem('coinso_order') || '{}');
    } catch {
      stored = {};
    }

    const invoiceId = searchParams.get('invoice_id') || (stored.orderId === orderId ? stored.invoiceId : '');

    if (searchParams.get('manual') === '1' && orderId) {
      setPayState('paid');
      return;
    }

    if (!orderId || !invoiceId) {
      setPayState('unpaid');
      return;
    }

    const check = async () => {
      attempts += 1;
      try {
        const r = await fetch(
          `${func2url['coinso-status']}?invoice_id=${encodeURIComponent(invoiceId)}&order_id=${encodeURIComponent(orderId)}`
        );
        const data = await r.json();
        if (cancelled) return;
        if (data.paid) {
          setPayState('paid');
          return;
        }
        if (attempts < 6) {
          timer = setTimeout(check, 3000);
        } else {
          setPayState('unpaid');
        }
      } catch {
        if (!cancelled) setPayState('error');
      }
    };
    check();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId]);

  useEffect(() => {
    if (payState !== 'paid') return;
    if (wish && amount) {
      const docData: DocumentData = {
        wish: decodeURIComponent(wish),
        intensity: parseInt(intensity),
        amount: parseInt(amount),
        email: email || 'user@example.com',
        userName,
        documentId: orderId || `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      };
      
      setDocumentData(docData);
      
      // Автоматически отправляем документ на email
      sendDocumentByEmail(docData);
    }
  }, [payState, wish, amount, intensity, email, phone, orderId, userName]);

  const sendDocumentByEmail = async (docData: DocumentData) => {
    if (emailSent || isEmailSending) return;
    
    setIsEmailSending(true);
    
    try {
      const result = await sendWishAffirmationDocument(
        docData.wish,
        docData.intensity,
        docData.amount,
        docData.email,
        phone || '+7 999 123-45-67',
        docData.userName
      );
      
      if (result.success) {
        console.log(`✅ Документ аффирмации #${result.documentId} отправлен на ${docData.email}`);
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Ошибка при отправке документа:', error);
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleDownloadDocument = async () => {
    if (isDownloading || !documentData) return;
    
    setIsDownloading(true);
    
    try {
      // Используем локальную генерацию документа
      generateAndDownloadDocument(documentData);
      setShowFinal(true);
      
      console.log(`📄 Документ #${documentData.documentId} скачан локально`);
    } catch (error) {
      console.error('Ошибка при скачивании документа:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmailResend = () => {
    if (documentData) {
      setEmailSent(false);
      sendDocumentByEmail(documentData);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (showFinal) {
    return <FinalScreen onHome={handleBackToHome} />;
  }

  if (payState !== 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          {payState === 'checking' ? (
            <>
              <div className="animate-spin w-10 h-10 mx-auto mb-4 border-4 border-purple-600 border-t-transparent rounded-full"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Проверяем оплату...</h1>
              <p className="text-gray-600">Это займёт несколько секунд</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {payState === 'error' ? 'Не удалось проверить оплату' : 'Оплата не найдена'}
              </h1>
              <p className="text-gray-600 mb-6">
                Если вы уже оплатили, подождите минуту и обновите страницу.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl mb-3"
              >
                Проверить ещё раз
              </button>
              <button
                onClick={handleBackToHome}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl"
              >
                Вернуться на главную
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <style>{`@keyframes grow-shrink{0%,100%{transform:scale(0.92)}50%{transform:scale(1.08)}}@keyframes twinkle{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle 3s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <SimpleConfetti isActive={true} />
      <div className="relative max-w-xl w-full text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide mb-6 bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
          ИСПОЛНЕНИЕ ЖЕЛАНИЯ
        </h2>
        <h1
          style={{ animation: 'grow-shrink 2s ease-in-out infinite' }}
          className="text-xl md:text-2xl font-semibold mb-4 text-emerald-300"
        >
          Документ начнёт действовать после оплаты силы
        </h1>
        <p className="text-gray-300 mb-2">Ваш документ аффирмации готов!</p>
        <p className="text-sm text-gray-400 mb-8">
          {amount} ₽{orderId && ` • Заказ #${orderId}`}
        </p>

        <button
          onClick={handleDownloadDocument}
          disabled={isDownloading || !documentData}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-4 px-6 rounded-xl transition-colors mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
              Подготовка документа...
            </>
          ) : !documentData ? (
            <>
              <Icon name="AlertCircle" size={20} />
              Документ не готов
            </>
          ) : (
            <>
              <Icon name="Download" size={20} />
              Скачать документ аффирмации (по желанию)
            </>
          )}
        </button>

        <button
          onClick={() => setShowFinal(true)}
          className="w-full bg-transparent border border-emerald-400 hover:bg-emerald-400/10 text-emerald-300 font-medium py-3 px-6 rounded-xl transition-colors mb-4"
        >
          Продолжить без скачивания
        </button>

        <button
          onClick={handleBackToHome}
          className="w-full bg-white/10 hover:bg-white/20 text-gray-200 font-medium py-3 px-6 rounded-xl transition-colors mb-6"
        >
          Вернуться на главную
        </button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>Документ сохранится в папке "Загрузки"</p>
          <p>Формат: PDF • Размер: ~200 КБ</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;