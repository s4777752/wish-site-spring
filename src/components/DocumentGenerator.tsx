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
  
  // Размер сертификата (A4 пропорции) - увеличен для новых элементов
  canvas.width = 1200;
  canvas.height = 1900;
  
  // Темный фон - градиент от черного к темно-синему
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0f172a'); // Очень темно-синий
  gradient.addColorStop(0.3, '#1e293b'); // Темно-серый
  gradient.addColorStop(0.7, '#334155'); // Серо-синий
  gradient.addColorStop(1, '#475569'); // Светло-серый
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Темные водяные знаки
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 80px serif';
  ctx.textAlign = 'center';
  
  for (let x = 200; x < canvas.width; x += 400) {
    for (let y = 300; y < canvas.height - 200; y += 400) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 8);
      ctx.fillText('МАГИЯ', 0, 0);
      ctx.restore();
    }
  }
  
  for (let x = 400; x < canvas.width; x += 400) {
    for (let y = 500; y < canvas.height - 200; y += 400) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 8);
      ctx.fillText('СИЛА', 0, 0);
      ctx.restore();
    }
  }
  
  ctx.restore();
  
  // Декоративная рамка - синяя
  const borderWidth = 40;
  const borderGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  borderGradient.addColorStop(0, '#1e40af'); // Синий
  borderGradient.addColorStop(0.3, '#3b82f6'); // Светло-синий
  borderGradient.addColorStop(0.6, '#60a5fa'); // Голубой
  borderGradient.addColorStop(1, '#1e40af'); // Синий
  
  // Внешняя рамка
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(borderWidth/2, borderWidth/2, canvas.width - borderWidth, canvas.height - borderWidth);
  
  // Внутренняя рамка
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 4;
  ctx.strokeRect(borderWidth + 20, borderWidth + 20, canvas.width - 2*(borderWidth + 20), canvas.height - 2*(borderWidth + 20));
  
  // Дополнительная декоративная рамка
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 2;
  ctx.strokeRect(borderWidth + 35, borderWidth + 35, canvas.width - 2*(borderWidth + 35), canvas.height - 2*(borderWidth + 35));
  
  // Декоративные углы - синие с орнаментом
  const drawCornerDecoration = (x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    // Основная фигура
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(70, 0);
    ctx.quadraticCurveTo(60, 10, 50, 20);
    ctx.lineTo(40, 30);
    ctx.quadraticCurveTo(30, 40, 20, 50);
    ctx.lineTo(10, 60);
    ctx.quadraticCurveTo(0, 70, 0, 70);
    ctx.closePath();
    ctx.fill();
    
    // Внутренний орнамент 1
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.moveTo(15, 15);
    ctx.lineTo(45, 15);
    ctx.lineTo(35, 25);
    ctx.lineTo(25, 35);
    ctx.lineTo(15, 45);
    ctx.closePath();
    ctx.fill();
    
    // Внутренний орнамент 2
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(25, 25, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };
  
  drawCornerDecoration(80, 80, 0);
  drawCornerDecoration(canvas.width - 80, 80, Math.PI/2);
  drawCornerDecoration(canvas.width - 80, canvas.height - 80, Math.PI);
  drawCornerDecoration(80, canvas.height - 80, -Math.PI/2);
  
  // Красивое оформление титульного листа
  // Фон для заголовка
  const titleBg = ctx.createLinearGradient(0, 120, 0, 280);
  titleBg.addColorStop(0, 'rgba(30, 64, 175, 0.4)');
  titleBg.addColorStop(0.5, 'rgba(59, 130, 246, 0.6)');
  titleBg.addColorStop(1, 'rgba(30, 64, 175, 0.4)');
  ctx.fillStyle = titleBg;
  ctx.fillRect(80, 120, canvas.width - 160, 160);
  
  // Обводка для фона заголовка
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.strokeRect(80, 120, canvas.width - 160, 160);
  
  // Внутренняя декоративная рамка
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1;
  ctx.strokeRect(95, 135, canvas.width - 190, 130);
  
  // Заголовок - белый на темном фоне
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.fillText('АФФИРМАЦИЯ ЖЕЛАНИЙ', canvas.width/2, 180);
  
  // Подзаголовок
  ctx.font = 'italic 26px serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('Персональный документ силы', canvas.width/2, 220);
  
  // Декоративная линия под заголовком
  const lineGradient = ctx.createLinearGradient(200, 240, canvas.width - 200, 240);
  lineGradient.addColorStop(0, 'transparent');
  lineGradient.addColorStop(0.3, '#60a5fa');
  lineGradient.addColorStop(0.7, '#60a5fa');
  lineGradient.addColorStop(1, 'transparent');
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, 240);
  ctx.lineTo(canvas.width - 200, 240);
  ctx.stroke();
  
  // Сброс тени
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Номер документа
  ctx.font = '20px monospace';
  ctx.fillStyle = '#374151'; // Темно-серый
  ctx.fillText(`№ ${documentId}`, canvas.width/2, 260);
  ctx.fillText(`Дата активации: ${currentDate}`, canvas.width/2, 290);
  
  // Центральный блок с желанием - темный дизайн
  const wishBox = {
    x: 120,
    y: 350,
    width: canvas.width - 240,
    height: 180
  };
  
  // Фон для блока желания - темный с синим оттенком
  const wishGradient = ctx.createLinearGradient(wishBox.x, wishBox.y, wishBox.x, wishBox.y + wishBox.height);
  wishGradient.addColorStop(0, 'rgba(30, 58, 138, 0.3)');
  wishGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
  wishGradient.addColorStop(1, 'rgba(30, 58, 138, 0.3)');
  ctx.fillStyle = wishGradient;
  ctx.fillRect(wishBox.x, wishBox.y, wishBox.width, wishBox.height);
  
  // Рамка блока желания
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 4;
  ctx.strokeRect(wishBox.x, wishBox.y, wishBox.width, wishBox.height);
  
  // Внутренняя рамка
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1;
  ctx.strokeRect(wishBox.x + 15, wishBox.y + 15, wishBox.width - 30, wishBox.height - 30);
  
  // Текст "ЖЕЛАНИЕ"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px serif';
  ctx.fillText('ЖЕЛАНИЕ', canvas.width/2, wishBox.y + 45);
  
  // Само желание (с переносом строк)
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 20px serif';
  const maxWishWidth = wishBox.width - 40;
  const wishLines = wrapText(ctx, documentData.wish, maxWishWidth);
  wishLines.forEach((line, index) => {
    ctx.fillText(line, canvas.width/2, wishBox.y + 90 + (index * 28));
  });
  
  // Параметры документа
  const paramsY = wishBox.y + wishBox.height + 80;
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`Уровень силы: ${documentData.intensity}/10`, canvas.width/2, paramsY);
  ctx.fillText(`Энергетический вклад: ${documentData.amount} ₽`, canvas.width/2, paramsY + 40);
  
  // Аффирмации
  const affirmations = getAffirmationsForWish(documentData.wish);
  const affirmationLines = affirmations.split('\\n');
  
  ctx.fillStyle = '#2c1810';
  ctx.font = '18px serif';
  ctx.textAlign = 'left';
  
  let affirmationY = paramsY + 100;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px serif';
  ctx.textAlign = 'center';
  ctx.fillText('ПЕРСОНАЛЬНЫЕ АФФИРМАЦИИ', canvas.width/2, affirmationY);
  
  affirmationY += 60;
  ctx.font = '16px serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#e2e8f0';
  
  affirmationLines.forEach((line, index) => {
    const cleanLine = line.replace('•', '').trim();
    if (cleanLine) {
      // Рисуем синий маркер с двумя кругами
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(150, affirmationY + (index * 35) - 5, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Внутренний светлый круг
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(150, affirmationY + (index * 35) - 5, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Рисуем текст аффирмации
      ctx.fillStyle = '#e2e8f0';
      const wrappedLines = wrapText(ctx, cleanLine, canvas.width - 200);
      wrappedLines.forEach((wrappedLine, lineIndex) => {
        ctx.fillText(wrappedLine, 170, affirmationY + (index * 35) + (lineIndex * 20));
      });
      if (wrappedLines.length > 1) {
        affirmationY += (wrappedLines.length - 1) * 20;
      }
    }
  });
  
  // Правила и инструкция использования
  affirmationY += 80;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px serif';
  ctx.textAlign = 'center';
  ctx.fillText('ПРАВИЛА И ИНСТРУКЦИЯ ИСПОЛЬЗОВАНИЯ', canvas.width/2, affirmationY);
  
  affirmationY += 50;
  ctx.font = '14px serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#e2e8f0';
  
  const instructions = [
    '• Читайте аффирмации каждое утро в течение 14 дней подряд для максимального эффекта',
    '• Произносите каждую аффирмацию вслух с верой и эмоциональной вовлеченностью',
    '• Визуализируйте исполнение вашего желания во время чтения аффирмаций',
    '• Сохраняйте позитивный настрой и избегайте сомнений в процессе работы',
    '• Сохраните документ в надежном месте на устройстве или в облачном хранилище',
    '• Не передавайте документ другим - это ваша персональная энергетическая матрица',
    '• После исполнения желания поблагодарите Вселенную и удалите файл навсегда'
  ];
  
  instructions.forEach((instruction, index) => {
    const cleanInstruction = instruction.replace('•', '').trim();
    
    // Синий маркер
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(150, affirmationY + (index * 30) - 3, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Внутренний светлый круг
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(150, affirmationY + (index * 30) - 3, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Текст инструкции
    ctx.fillStyle = '#cbd5e1';
    const wrappedInstructions = wrapText(ctx, cleanInstruction, canvas.width - 200);
    wrappedInstructions.forEach((wrappedLine, lineIndex) => {
      ctx.fillText(wrappedLine, 170, affirmationY + (index * 30) + (lineIndex * 16));
    });
    if (wrappedInstructions.length > 1) {
      affirmationY += (wrappedInstructions.length - 1) * 16;
    }
  });
  
  // Фигурная печать с орнаментом (без звездочек)
  const sealX = canvas.width - 280;
  const sealY = canvas.height - 280;
  const sealRadius = 90;
  
  // Основная печать - фигурная форма
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 8;
  ctx.beginPath();
  
  // Создаем фигурную печать из лепестков
  const petals = 8;
  for (let i = 0; i < petals; i++) {
    const angle = (Math.PI * 2 * i) / petals;
    const petalRadius = sealRadius + Math.sin(angle * 4) * 15;
    const x = sealX + Math.cos(angle) * petalRadius;
    const y = sealY + Math.sin(angle) * petalRadius;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  
  // Внутреннее фигурное кольцо
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < petals; i++) {
    const angle = (Math.PI * 2 * i) / petals;
    const petalRadius = (sealRadius - 25) + Math.sin(angle * 4) * 8;
    const x = sealX + Math.cos(angle) * petalRadius;
    const y = sealY + Math.sin(angle) * petalRadius;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  
  // Центральный круг
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 45, 0, Math.PI * 2);
  ctx.stroke();
  
  // Декоративные элементы в углах печати
  const ornamentRadius = 8;
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI * 2 * i) / 4 + Math.PI / 4;
    const ornX = sealX + Math.cos(angle) * (sealRadius - 15);
    const ornY = sealY + Math.sin(angle) * (sealRadius - 15);
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(ornX, ornY, ornamentRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Внутренний светлый круг
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.arc(ornX, ornY, ornamentRadius - 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Центральный орнамент - ромб
  ctx.fillStyle = '#1e40af';
  ctx.beginPath();
  ctx.moveTo(sealX, sealY - 20);
  ctx.lineTo(sealX + 15, sealY);
  ctx.lineTo(sealX, sealY + 20);
  ctx.lineTo(sealX - 15, sealY);
  ctx.closePath();
  ctx.fill();
  
  // Текст печати - белый
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px serif';
  ctx.textAlign = 'center';
  ctx.fillText('САЙТ ЖЕЛАНИЙ', sealX, sealY - 5);
  ctx.font = '14px serif';
  ctx.fillText('POEHALI.DEV', sealX, sealY + 15);
  ctx.font = '12px serif';
  ctx.fillText(currentDate.split(' ')[2], sealX, sealY + 35);
  
  // Важная надпись внизу
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚠️ ДОКУМЕНТ ДЕЙСТВУЕТ ПОСЛЕ ОПЛАТЫ СИЛЫ ⚠️', canvas.width/2, canvas.height - 100);
  
  // Дополнительная информация
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px sans-serif';
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