export interface DocumentData {
  wish: string;
  intensity: number;
  amount: number;
  email: string;
  userName: string;
  documentId: string;
}

// Функция для генерации аффирмаций в зависимости от желания
export const getAffirmationsForWish = (wish: string) => {
  const lowerWish = wish.toLowerCase();
  
  if (lowerWish.includes('любовь') || lowerWish.includes('отношения')) {
    return `• Я притягиваю настоящую любовь в свою жизнь
• Моё сердце открыто для глубоких и искренних чувств
• Я достоин/достойна безусловной любви и счастья
• Любовь приходит ко мне легко и естественно
• Я излучаю любовь и привлекаю её в ответ`;
  }
  
  if (lowerWish.includes('деньги') || lowerWish.includes('богатство') || lowerWish.includes('финансы')) {
    return `• Деньги легко и свободно текут в мою жизнь
• Я притягиваю финансовое изобилие во всех сферах
• Мои доходы растут с каждым днем
• Я достоин/достойна богатства и процветания
• Вселенная поддерживает мое финансовое благополучие`;
  }
  
  if (lowerWish.includes('здоровье') || lowerWish.includes('исцеление')) {
    return `• Мое тело исцеляется с каждым днем
• Я излучаю жизненную энергию и силу
• Каждая клетка моего тела наполнена здоровьем
• Я принимаю решения, которые поддерживают мое благополучие
• Мое тело и разум находятся в гармонии`;
  }
  
  // Универсальные аффирмации
  return `• Я притягиваю в свою жизнь все, что мне нужно
• Вселенная работает в мою пользу
• Мои желания исполняются легко и гармонично
• Я открыт/открыта для получения всех благословений
• Каждый день приближает меня к цели`;
};

// Функция генерации и скачивания документа как изображение
export const generateAndDownloadDocument = (documentData: DocumentData) => {
  if (!documentData) return;
  
  const documentId = documentData.documentId || `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Создаем canvas для рисования сертификата
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Размер сертификата (A4 пропорции)
  canvas.width = 1200;
  canvas.height = 1600;
  
  // Фон - градиент от белого к кремовому
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.5, '#fefefe');
  gradient.addColorStop(1, '#f8f6f0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Декоративная рамка
  const borderWidth = 40;
  const borderGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  borderGradient.addColorStop(0, '#d4af37'); // Золотой
  borderGradient.addColorStop(0.5, '#f4e4bc');
  borderGradient.addColorStop(1, '#d4af37');
  
  // Внешняя рамка
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(borderWidth/2, borderWidth/2, canvas.width - borderWidth, canvas.height - borderWidth);
  
  // Внутренняя тонкая рамка
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 3;
  ctx.strokeRect(borderWidth + 20, borderWidth + 20, canvas.width - 2*(borderWidth + 20), canvas.height - 2*(borderWidth + 20));
  
  // Декоративные углы
  const drawCornerDecoration = (x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(50, 0);
    ctx.lineTo(30, 20);
    ctx.lineTo(20, 30);
    ctx.lineTo(0, 50);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  
  drawCornerDecoration(80, 80, 0);
  drawCornerDecoration(canvas.width - 80, 80, Math.PI/2);
  drawCornerDecoration(canvas.width - 80, canvas.height - 80, Math.PI);
  drawCornerDecoration(80, canvas.height - 80, -Math.PI/2);
  
  // Заголовок
  ctx.textAlign = 'center';
  ctx.fillStyle = '#2c1810';
  ctx.font = 'bold 48px serif';
  ctx.fillText('СЕРТИФИКАТ АФФИРМАЦИИ', canvas.width/2, 180);
  
  // Подзаголовок
  ctx.font = 'italic 28px serif';
  ctx.fillStyle = '#8b4513';
  ctx.fillText('Документ энергетической активации желания', canvas.width/2, 220);
  
  // Номер документа
  ctx.font = '20px monospace';
  ctx.fillStyle = '#666';
  ctx.fillText(`№ ${documentId}`, canvas.width/2, 260);
  ctx.fillText(`Дата выдачи: ${currentDate}`, canvas.width/2, 290);
  
  // Центральный блок с желанием
  const wishBox = {
    x: 120,
    y: 350,
    width: canvas.width - 240,
    height: 200
  };
  
  // Фон для блока желания
  const wishGradient = ctx.createLinearGradient(wishBox.x, wishBox.y, wishBox.x, wishBox.y + wishBox.height);
  wishGradient.addColorStop(0, '#f0f8ff');
  wishGradient.addColorStop(1, '#e6f3ff');
  ctx.fillStyle = wishGradient;
  ctx.fillRect(wishBox.x, wishBox.y, wishBox.width, wishBox.height);
  
  // Рамка блока желания
  ctx.strokeStyle = '#4682b4';
  ctx.lineWidth = 2;
  ctx.strokeRect(wishBox.x, wishBox.y, wishBox.width, wishBox.height);
  
  // Текст "ВАШЕ ЖЕЛАНИЕ"
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 24px serif';
  ctx.fillText('ВАШЕ ЖЕЛАНИЕ', canvas.width/2, wishBox.y + 40);
  
  // Само желание (с переносом строк)
  ctx.fillStyle = '#2c1810';
  ctx.font = 'italic 22px serif';
  const maxWishWidth = wishBox.width - 40;
  const wishLines = wrapText(ctx, documentData.wish, maxWishWidth);
  wishLines.forEach((line, index) => {
    ctx.fillText(line, canvas.width/2, wishBox.y + 100 + (index * 30));
  });
  
  // Параметры документа
  const paramsY = wishBox.y + wishBox.height + 80;
  ctx.fillStyle = '#8b4513';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(`Уровень силы: ${documentData.intensity}/10`, canvas.width/2, paramsY);
  ctx.fillText(`Энергетический вклад: ${documentData.amount} ₽`, canvas.width/2, paramsY + 35);
  
  // Аффирмации
  const affirmations = getAffirmationsForWish(documentData.wish);
  const affirmationLines = affirmations.split('\\n');
  
  ctx.fillStyle = '#2c1810';
  ctx.font = '18px serif';
  ctx.textAlign = 'left';
  
  let affirmationY = paramsY + 100;
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('ПЕРСОНАЛЬНЫЕ АФФИРМАЦИИ', canvas.width/2, affirmationY);
  
  affirmationY += 50;
  ctx.font = '16px serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2c1810';
  
  affirmationLines.forEach((line, index) => {
    const cleanLine = line.replace('•', '').trim();
    if (cleanLine) {
      // Рисуем маркер
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(150, affirmationY + (index * 30) - 5, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Рисуем текст аффирмации
      ctx.fillStyle = '#2c1810';
      const wrappedLines = wrapText(ctx, cleanLine, canvas.width - 200);
      wrappedLines.forEach((wrappedLine, lineIndex) => {
        ctx.fillText(wrappedLine, 170, affirmationY + (index * 30) + (lineIndex * 20));
      });
      if (wrappedLines.length > 1) {
        affirmationY += (wrappedLines.length - 1) * 20;
      }
    }
  });
  
  // Печать сайта (внизу справа)
  const sealX = canvas.width - 250;
  const sealY = canvas.height - 250;
  const sealRadius = 80;
  
  // Круглая печать
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Внутренний круг печати
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 20, 0, Math.PI * 2);
  ctx.stroke();
  
  // Текст печати
  ctx.fillStyle = '#8b4513';
  ctx.font = 'bold 14px serif';
  ctx.textAlign = 'center';
  ctx.fillText('САЙТ ЖЕЛАНИЙ', sealX, sealY - 10);
  ctx.font = '12px serif';
  ctx.fillText('POEHALI.DEV', sealX, sealY + 10);
  ctx.fillText(currentDate.split(' ')[2], sealX, sealY + 30);
  
  // Важная надпись внизу
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚠️ ДОКУМЕНТ ДЕЙСТВУЕТ ПОСЛЕ ОПЛАТЫ СИЛЫ ⚠️', canvas.width/2, canvas.height - 100);
  
  // Дополнительная информация
  ctx.fillStyle = '#666';
  ctx.font = '14px sans-serif';
  ctx.fillText(`Получатель: ${documentData.userName} • Email: ${documentData.email}`, canvas.width/2, canvas.height - 60);
  
  // Скачиваем как изображение
  canvas.toBlob((blob) => {
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Сертификат_аффирмации_${documentId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }, 'image/png');
};

// Вспомогательная функция для переноса текста
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}