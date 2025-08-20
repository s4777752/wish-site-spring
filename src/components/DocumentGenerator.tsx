export interface DocumentData {
  wish: string;
  intensity: number;
  amount: number;
  email: string;
  userName: string;
  documentId: string;
}

// Функция для генерации сложных аффирмаций в зависимости от желания
export const getAffirmationsForWish = (wish: string) => {
  const lowerWish = wish.toLowerCase();
  
  if (lowerWish.includes('любовь') || lowerWish.includes('отношения')) {
    return `• Моя энергетическая вибрация любви резонирует с космическими частотами, привлекая идеального спутника жизни через закон притяжения
• Квантовые поля моего сердца активированы для приема и передачи безусловной любви на всех измерениях существования
• Архетипические паттерны священного союза проявляются в моей реальности через синхронизацию с высшими планами бытия
• Моя аура любви расширяется экспоненциально, создавая мощное магнетическое поле для привлечения родственной души
• Энергетические блоки в сердечной чакре растворяются под воздействием космических лучей трансформации и исцеления`;
  }
  
  if (lowerWish.includes('деньги') || lowerWish.includes('богатство') || lowerWish.includes('финансы')) {
    return `• Моя финансовая матрица перепрограммируется на частоту изобилия, синхронизируясь с потоками космического процветания
• Квантовые денежные поля активируются в моем биополе, создавая мощный денежный магнетизм и финансовую гравитацию
• Архетип Золотого Дракона пробуждается в моем подсознании, открывая древние каналы притока богатства и изобилия
• Энергетические коды изобилия внедряются в мою ДНК, трансформируя клеточную память о нехватке в память о процветании
• Космические банки Вселенной открывают для меня безлимитные кредитные линии энергии изобилия и материального благополучия`;
  }
  
  if (lowerWish.includes('здоровье') || lowerWish.includes('исцеление')) {
    return `• Активируются дремлющие коды самовосстановления в моей ДНК, включая древние механизмы регенерации и омоложения клеток
• Моя биоэнергетическая система синхронизируется с частотами космического здоровья, перезагружая все органы и системы
• Архетипы Божественного Целителя пробуждаются в моем подсознании, направляя потоки исцеляющей праны через все тела
• Квантовые поля здоровья окутывают мою ауру защитным коконом, отражающим все негативные воздействия и болезни
• Космические лучи витальности проникают в каждую клетку, восстанавливая первозданную программу совершенного здоровья`;
  }
  
  // Универсальные усложненные аффирмации
  return `• Моя энергетическая подпись резонирует с космическими частотами исполнения желаний, активируя квантовые поля возможностей
• Архетипические силы Творца пробуждаются в моем сознании, материализуя желаемую реальность через многомерные порталы
• Синхронистичность Вселенной выстраивает идеальную цепь событий для манифестации моих глубочайших стремлений и целей
• Космические матрицы изобилия перестраивают мою реальность, открывая безграничные возможности для реализации потенциала
• Энергетические коды успеха внедряются в мою ауру, программируя подсознание на автоматическое притяжение желаемых результатов`;
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
  
  // Фон - градиент от светло-зеленого к белому
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#f0fff4'); // Светло-зеленый
  gradient.addColorStop(0.5, '#ffffff');
  gradient.addColorStop(1, '#f0f8f0'); // Очень светло-зеленый
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Водяные знаки по всему документу
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 120px serif';
  ctx.textAlign = 'center';
  
  // Размещаем водяные знаки в шахматном порядке
  for (let x = 200; x < canvas.width; x += 400) {
    for (let y = 300; y < canvas.height - 200; y += 400) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 6); // Поворот на 30 градусов
      ctx.fillText('ЖЕЛАНИЯ', 0, 0);
      ctx.restore();
    }
  }
  
  for (let x = 400; x < canvas.width; x += 400) {
    for (let y = 500; y < canvas.height - 200; y += 400) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 6);
      ctx.fillText('СИЛА', 0, 0);
      ctx.restore();
    }
  }
  
  ctx.restore();
  
  // Декоративная рамка - зеленая
  const borderWidth = 40;
  const borderGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  borderGradient.addColorStop(0, '#16a34a'); // Темно-зеленый
  borderGradient.addColorStop(0.5, '#22c55e'); // Зеленый
  borderGradient.addColorStop(1, '#15803d'); // Темно-зеленый
  
  // Внешняя рамка
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(borderWidth/2, borderWidth/2, canvas.width - borderWidth, canvas.height - borderWidth);
  
  // Внутренняя тонкая рамка
  ctx.strokeStyle = '#166534'; // Темно-зеленый
  ctx.lineWidth = 3;
  ctx.strokeRect(borderWidth + 20, borderWidth + 20, canvas.width - 2*(borderWidth + 20), canvas.height - 2*(borderWidth + 20));
  
  // Декоративные углы - зеленые
  const drawCornerDecoration = (x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = '#22c55e'; // Зеленый
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(50, 0);
    ctx.lineTo(30, 20);
    ctx.lineTo(20, 30);
    ctx.lineTo(0, 50);
    ctx.closePath();
    ctx.fill();
    
    // Добавляем внутренний узор
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(25, 10);
    ctx.lineTo(20, 15);
    ctx.lineTo(15, 20);
    ctx.lineTo(10, 25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  
  drawCornerDecoration(80, 80, 0);
  drawCornerDecoration(canvas.width - 80, 80, Math.PI/2);
  drawCornerDecoration(canvas.width - 80, canvas.height - 80, Math.PI);
  drawCornerDecoration(80, canvas.height - 80, -Math.PI/2);
  
  // Заголовок - изменен на "АФФИРМАЦИЯ ЖЕЛАНИЙ"
  ctx.textAlign = 'center';
  ctx.fillStyle = '#166534'; // Темно-зеленый
  ctx.font = 'bold 48px serif';
  ctx.fillText('АФФИРМАЦИЯ ЖЕЛАНИЙ', canvas.width/2, 180);
  
  // Подзаголовок
  ctx.font = 'italic 28px serif';
  ctx.fillStyle = '#16a34a'; // Зеленый
  ctx.fillText('Документ квантовой активации энергетических полей', canvas.width/2, 220);
  
  // Номер документа
  ctx.font = '20px monospace';
  ctx.fillStyle = '#374151'; // Темно-серый
  ctx.fillText(`№ ${documentId}`, canvas.width/2, 260);
  ctx.fillText(`Дата активации: ${currentDate}`, canvas.width/2, 290);
  
  // Центральный блок с желанием
  const wishBox = {
    x: 120,
    y: 350,
    width: canvas.width - 240,
    height: 200
  };
  
  // Фон для блока желания - зеленый градиент
  const wishGradient = ctx.createLinearGradient(wishBox.x, wishBox.y, wishBox.x, wishBox.y + wishBox.height);
  wishGradient.addColorStop(0, '#f0fdf4'); // Очень светло-зеленый
  wishGradient.addColorStop(1, '#dcfce7'); // Светло-зеленый
  ctx.fillStyle = wishGradient;
  ctx.fillRect(wishBox.x, wishBox.y, wishBox.width, wishBox.height);
  
  // Рамка блока желания - зеленая
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 3;
  ctx.strokeRect(wishBox.x, wishBox.y, wishBox.width, wishBox.height);
  
  // Текст "ВАШЕ ЖЕЛАНИЕ"
  ctx.fillStyle = '#14532d'; // Темно-зеленый
  ctx.font = 'bold 24px serif';
  ctx.fillText('КВАНТОВЫЙ ЗАПРОС ВСЕЛЕННОЙ', canvas.width/2, wishBox.y + 40);
  
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
  ctx.fillStyle = '#16a34a'; // Зеленый
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(`Квантовый уровень силы: ${documentData.intensity}/10`, canvas.width/2, paramsY);
  ctx.fillText(`Энергетическая инвестиция: ${documentData.amount} ₽`, canvas.width/2, paramsY + 35);
  
  // Аффирмации
  const affirmations = getAffirmationsForWish(documentData.wish);
  const affirmationLines = affirmations.split('\\n');
  
  ctx.fillStyle = '#2c1810';
  ctx.font = '18px serif';
  ctx.textAlign = 'left';
  
  let affirmationY = paramsY + 100;
  ctx.fillStyle = '#14532d'; // Темно-зеленый
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('КВАНТОВЫЕ ЭНЕРГЕТИЧЕСКИЕ КОДЫ', canvas.width/2, affirmationY);
  
  affirmationY += 50;
  ctx.font = '14px serif'; // Уменьшил размер из-за длинного текста
  ctx.textAlign = 'left';
  ctx.fillStyle = '#374151'; // Темно-серый
  
  affirmationLines.forEach((line, index) => {
    const cleanLine = line.replace('•', '').trim();
    if (cleanLine) {
      // Рисуем зеленый маркер
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(150, affirmationY + (index * 35) - 5, 4, 0, Math.PI * 2); // Увеличил маркер и интервал
      ctx.fill();
      
      // Рисуем текст аффирмации
      ctx.fillStyle = '#374151';
      const wrappedLines = wrapText(ctx, cleanLine, canvas.width - 200);
      wrappedLines.forEach((wrappedLine, lineIndex) => {
        ctx.fillText(wrappedLine, 170, affirmationY + (index * 35) + (lineIndex * 18));
      });
      if (wrappedLines.length > 1) {
        affirmationY += (wrappedLines.length - 1) * 18;
      }
    }
  });
  
  // Печать сайта (внизу справа) - синяя
  const sealX = canvas.width - 250;
  const sealY = canvas.height - 250;
  const sealRadius = 80;
  
  // Круглая печать - синяя
  ctx.strokeStyle = '#1e40af'; // Синий
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Внутренний круг печати - светло-синий
  ctx.strokeStyle = '#3b82f6'; // Светло-синий
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 20, 0, Math.PI * 2);
  ctx.stroke();
  
  // Дополнительные декоративные кольца
  ctx.strokeStyle = '#60a5fa'; // Еще светлее синий
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 35, 0, Math.PI * 2);
  ctx.stroke();
  
  // Текст печати - синий
  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 14px serif';
  ctx.textAlign = 'center';
  ctx.fillText('САЙТ ЖЕЛАНИЙ', sealX, sealY - 10);
  ctx.font = '12px serif';
  ctx.fillText('POEHALI.DEV', sealX, sealY + 10);
  ctx.fillText(currentDate.split(' ')[2], sealX, sealY + 30);
  
  // Звездочки вокруг печати для красоты
  const stars = ['⭐', '✨', '🌟', '💫'];
  stars.forEach((star, index) => {
    const angle = (Math.PI * 2 * index) / stars.length;
    const starX = sealX + Math.cos(angle) * (sealRadius + 25);
    const starY = sealY + Math.sin(angle) * (sealRadius + 25);
    ctx.font = '16px serif';
    ctx.fillText(star, starX, starY);
  });
  
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