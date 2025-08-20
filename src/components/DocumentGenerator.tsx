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

// Функция генерации и скачивания документа
export const generateAndDownloadDocument = (documentData: DocumentData) => {
  if (!documentData) return;
  
  const documentId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('ru-RU');
  
  const pdfContent = `
🌟 ДОКУМЕНТ АФФИРМАЦИИ ЖЕЛАНИЯ
Номер: ${documentId}
Дата активации: ${currentDate}

🎯 ВАШЕ ЖЕЛАНИЕ: "${documentData.wish}"
⚡ УРОВЕНЬ СИЛЫ: ${documentData.intensity}/10
💰 ЭНЕРГЕТИЧЕСКИЙ ВКЛАД: ${documentData.amount} ₽

✨ ПЕРСОНАЛЬНЫЕ АФФИРМАЦИИ:
${getAffirmationsForWish(documentData.wish)}

🔮 ИНСТРУКЦИИ ПО АКТИВАЦИИ:
1. Читайте аффирмации каждое утро после пробуждения
2. Визуализируйте желаемый результат 5-10 минут
3. Повторяйте аффирмации вечером перед сном
4. Верьте в силу своих слов и намерений

💫 ЭНЕРГЕТИЧЕСКИЙ СТАТУС: АКТИВИРОВАН ✅

Получатель: ${documentData.userName}
Email: ${documentData.email}
  `;

  // Создаем blob и скачиваем как текстовый файл
  const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Документ_аффирмации_${documentId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};