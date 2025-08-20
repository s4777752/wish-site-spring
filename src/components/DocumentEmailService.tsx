import React, { useRef } from 'react';
import WishAffirmationDocument from './WishAffirmationDocument';

interface DocumentEmailServiceProps {
  wishText: string;
  wishIntensity: number;
  amount: number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  onDocumentReady?: (documentId: string) => void;
}

const DocumentEmailService: React.FC<DocumentEmailServiceProps> = ({
  wishText,
  wishIntensity,
  amount,
  userName,
  userEmail,
  userPhone,
  onDocumentReady
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const generateAndSendDocument = async () => {
    try {
      if (!documentRef.current) return;

      // В реальном приложении здесь будет:
      // 1. Генерация PDF из HTML
      // 2. Отправка на email
      // 3. Отправка в WhatsApp
      
      console.log('Генерирую документ аффирмации...', {
        documentId,
        wishText,
        wishIntensity,
        amount,
        userName,
        userEmail,
        userPhone
      });

      // Эмуляция процесса отправки
      const emailData = {
        to: userEmail,
        subject: `✨ Ваш документ аффирмации желания #${documentId}`,
        html: `
          <h2>🌟 Поздравляем! Ваше желание активировано!</h2>
          <p>Уважаемый(ая) ${userName || 'дорогой клиент'},</p>
          <p>Ваш энергетический вклад в размере <strong>${amount} ₽</strong> успешно принят!</p>
          <p><strong>Ваше желание:</strong> "${wishText}"</p>
          <p><strong>Уровень силы:</strong> ${wishIntensity} из 10</p>
          <p><strong>Номер документа:</strong> ${documentId}</p>
          <p>Во вложении находится ваш персональный документ аффирмации с официальной печатью сайта.</p>
          <p>Читайте аффирмации каждый день утром и вечером для максимального эффекта!</p>
          <p>С уважением,<br/>Команда САЙТ ЖЕЛАНИЙ ✨</p>
        `,
        attachments: [
          {
            filename: `Аффирмация_желания_${documentId}.pdf`,
            content: 'PDF_DOCUMENT_BASE64' // В реальности здесь будет PDF
          }
        ]
      };

      // WhatsApp сообщение
      const whatsappMessage = `🌟 *САЙТ ЖЕЛАНИЙ*

Поздравляем! Ваше желание активировано!

📜 *Документ №:* ${documentId}
💰 *Энергетический вклад:* ${amount} ₽
⚡ *Уровень силы:* ${wishIntensity}/10

*Ваше желание:* "${wishText}"

📧 Документ аффирмации отправлен на email: ${userEmail}

Читайте аффирмации каждый день для максимального эффекта! ✨`;

      // Имитация успешной отправки
      setTimeout(() => {
        console.log('Email отправлен:', emailData);
        console.log('WhatsApp сообщение:', whatsappMessage);
        
        if (onDocumentReady) {
          onDocumentReady(documentId);
        }

        // Показываем уведомление пользователю
        alert(`✅ Документ аффирмации отправлен!

📧 Email: ${userEmail}
📱 WhatsApp: ${userPhone || 'не указан'}
📜 Номер документа: ${documentId}

Проверьте почту и WhatsApp!`);
      }, 2000);

    } catch (error) {
      console.error('Ошибка при отправке документа:', error);
      alert('❌ Произошла ошибка при отправке документа. Попробуйте еще раз.');
    }
  };

  return (
    <div>
      {/* Скрытый документ для генерации PDF */}
      <div ref={documentRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <WishAffirmationDocument
          wishText={wishText}
          wishIntensity={wishIntensity}
          amount={amount}
          userName={userName}
          userEmail={userEmail}
          createdDate={new Date().toLocaleDateString('ru-RU')}
          documentId={documentId}
        />
      </div>

      {/* Кнопка для тестирования (в реальном приложении это будет автоматически) */}
      <div className="hidden">
        <button onClick={generateAndSendDocument}>
          Отправить документ
        </button>
      </div>
    </div>
  );
};

// Функция для интеграции с системой оплаты
export const sendWishAffirmationDocument = async (
  wishText: string,
  wishIntensity: number,
  amount: number,
  userEmail: string,
  userPhone?: string,
  userName?: string
) => {
  const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  
  try {
    // В реальном приложении здесь будет API вызов к бэкенду
    const response = await fetch('/api/send-wish-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wishText,
        wishIntensity,
        amount,
        userEmail,
        userPhone,
        userName,
        documentId,
        createdDate: new Date().toISOString()
      })
    });

    if (response.ok) {
      console.log('✅ Документ аффирмации успешно отправлен');
      return { success: true, documentId };
    } else {
      throw new Error('Ошибка API');
    }
  } catch (error) {
    // Fallback - локальная имитация отправки
    console.log('📧 Отправляю документ локально (демо режим)');
    
    setTimeout(() => {
      console.log(`✨ Документ аффирмации #${documentId} создан для:
      
🎯 Желание: "${wishText}"
⚡ Сила: ${wishIntensity}/10 (${amount} ₽)
👤 Получатель: ${userName || 'Пользователь'}
📧 Email: ${userEmail}
📱 WhatsApp: ${userPhone || 'не указан'}`);
    }, 1000);

    return { success: true, documentId };
  }
};

export default DocumentEmailService;