interface AffirmationDocumentData {
  name: string;
  email: string;
  wish: string;
  amount: number;
  orderNumber: string;
  timestamp: string;
}

export const generateAffirmationDocument = (data: AffirmationDocumentData): string => {
  const { name, wish, amount, orderNumber, timestamp } = data;
  
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Документ Аффирмации</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .document {
            background: white;
            max-width: 800px;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            position: relative;
            overflow: hidden;
        }
        
        .document::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(90deg, #f093fb 0%, #f5576c 25%, #4facfe 50%, #00f2fe 75%, #43e97b 100%);
        }
        
        .header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .title {
            font-family: 'Playfair Display', serif;
            font-size: 2.5em;
            color: #2d3748;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .subtitle {
            color: #718096;
            font-size: 1.1em;
            margin-bottom: 30px;
        }
        
        .content {
            margin: 40px 0;
        }
        
        .greeting {
            font-size: 1.3em;
            color: #4a5568;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .affirmation-text {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 40px;
            border-radius: 15px;
            border-left: 5px solid #8b5cf6;
            margin: 30px 0;
            position: relative;
        }
        
        .affirmation-text::before {
            content: '✨';
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 2em;
            opacity: 0.3;
        }
        
        .wish {
            font-size: 1.4em;
            color: #2d3748;
            font-weight: 500;
            line-height: 1.8;
            text-align: center;
            font-style: italic;
        }
        
        .energy-info {
            background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
        }
        
        .energy-amount {
            font-size: 1.5em;
            font-weight: 700;
            color: #c53030;
            margin-bottom: 10px;
        }
        
        .instructions {
            background: #f0fff4;
            padding: 30px;
            border-radius: 12px;
            border-left: 4px solid #48bb78;
            margin: 30px 0;
        }
        
        .instructions h3 {
            color: #2f855a;
            margin-bottom: 15px;
            font-size: 1.2em;
        }
        
        .instructions ul {
            color: #2d3748;
            margin: 0;
            padding-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 8px;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e2e8f0;
        }
        
        .order-info {
            color: #718096;
            font-size: 0.9em;
            margin-bottom: 15px;
        }
        
        .blessing {
            color: #8b5cf6;
            font-size: 1.1em;
            font-weight: 500;
            margin-top: 20px;
        }
        
        .signature {
            margin-top: 40px;
            text-align: right;
            color: #718096;
            font-style: italic;
        }
        
        @media (max-width: 600px) {
            body { padding: 20px; }
            .document { padding: 30px; }
            .title { font-size: 2em; }
            .wish { font-size: 1.2em; }
        }
    </style>
</head>
<body>
    <div class="document">
        <div class="header">
            <h1 class="title">Документ Аффирмации</h1>
            <p class="subtitle">Персональное энергетическое воздействие</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Дорог${name.includes('а') || name.includes('я') ? 'ая' : 'ой'} ${name}!
            </div>
            
            <p>Ваше желание было принято Вселенной и активировано с помощью энергетического вклада. 
            Этот документ подтверждает начало процесса исполнения и служит якорем для концентрации 
            ваших намерений.</p>
            
            <div class="affirmation-text">
                <div class="wish">${wish}</div>
            </div>
            
            <div class="energy-info">
                <div class="energy-amount">Энергетический вклад: ${amount} рублей</div>
                <p>Ваш вклад создал необходимую энергетическую волну для реализации желания</p>
            </div>
            
            <div class="instructions">
                <h3>💫 Рекомендации для усиления эффекта:</h3>
                <ul>
                    <li>Читайте вашу аффирмацию каждое утро после пробуждения</li>
                    <li>Представляйте свое желание уже исполненным</li>
                    <li>Сохраняйте позитивный настрой и благодарность</li>
                    <li>Действуйте в направлении своей цели</li>
                    <li>Доверьтесь процессу и позвольте Вселенной действовать</li>
                </ul>
            </div>
            
            <p>Помните: энергия, которую вы вложили, уже начала работать. Ваше подсознание 
            получило четкий сигнал, и теперь все силы Вселенной направлены на исполнение 
            вашего желания. Будьте открыты к возможностям и синхроничностям!</p>
        </div>
        
        <div class="footer">
            <div class="order-info">
                Заказ №${orderNumber} • ${timestamp}
            </div>
            <div class="blessing">
                ✨ Пусть ваше желание исполнится наилучшим для вас образом ✨
            </div>
            <div class="signature">
                С верой в вашу мечту,<br>
                Команда Вселенной желаний
            </div>
        </div>
    </div>
</body>
</html>
  `.trim();
};

export const sendAffirmationEmail = async (data: AffirmationDocumentData): Promise<boolean> => {
  try {
    // В реальном проекте здесь будет вызов API для отправки email
    // Например, через EmailJS, SendGrid, или собственный backend
    
    const htmlContent = generateAffirmationDocument(data);
    
    // Имитация отправки email (замените на реальную отправку)
    console.log('Отправка документа аффирмации на:', data.email);
    console.log('Содержимое документа сгенерировано');
    
    // Здесь должна быть интеграция с email-сервисом
    // Пример для EmailJS:
    // await emailjs.send('service_id', 'template_id', {
    //   to_email: data.email,
    //   to_name: data.name,
    //   html_content: htmlContent,
    //   subject: `Документ аффирмации - Заказ №${data.orderNumber}`
    // });
    
    return true;
  } catch (error) {
    console.error('Ошибка при отправке документа аффирмации:', error);
    return false;
  }
};