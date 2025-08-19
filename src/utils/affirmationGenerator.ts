import jsPDF from 'jspdf';
import { AffirmationData } from '@/components/WishAffirmationForm';

const affirmationTemplates = {
  health: [
    'Я наполняюсь энергией и жизненной силой каждый день',
    'Мое тело здорово и сильно',
    'Я легко поддерживаю идеальное здоровье',
    'Каждая клетка моего тела излучает здоровье'
  ],
  love: [
    'Я достойна/достоин глубокой и взаимной любви',
    'Любовь приходит ко мне легко и естественно',
    'Я притягиваю гармоничные отношения',
    'Мое сердце открыто для настоящей любви'
  ],
  career: [
    'Я успешно достигаю всех профессиональных целей',
    'Моя карьера процветает с каждым днем',
    'Я легко нахожу работу своей мечты',
    'Успех приходит ко мне естественно'
  ],
  money: [
    'Деньги приходят ко мне из разных источников',
    'Я легко привлекаю финансовое изобилие',
    'Моё благосостояние растет каждый день',
    'Я достойна/достоин богатства и процветания'
  ],
  family: [
    'Моя семья наполнена любовью и гармонией',
    'Мы поддерживаем друг друга во всем',
    'В нашем доме царит мир и понимание',
    'Семейные узы становятся крепче день ото дня'
  ],
  dreams: [
    'Все мои мечты осуществляются в идеальное время',
    'Вселенная поддерживает мои самые заветные желания',
    'Я легко достигаю всего, о чем мечтаю',
    'Мои мечты становятся реальностью'
  ]
};

export const generateAffirmations = (data: AffirmationData): string[] => {
  const templates = affirmationTemplates[data.category as keyof typeof affirmationTemplates] || affirmationTemplates.dreams;
  const personalAffirmations = data.wishes.map(wish => 
    `Я легко и радостно получаю: ${wish.toLowerCase()}`
  );
  
  return [...personalAffirmations, ...templates.slice(0, 4)];
};

export const generatePDF = async (data: AffirmationData): Promise<Blob> => {
  const pdf = new jsPDF();
  const affirmations = generateAffirmations(data);
  
  // Настройка шрифтов и стилей
  pdf.setFont('helvetica');
  
  // Заголовок
  pdf.setFontSize(24);
  pdf.setTextColor(66, 139, 202);
  pdf.text('Персональные Аффирмации', 20, 30);
  pdf.text(`для ${data.name}`, 20, 45);
  
  // Дата создания
  pdf.setFontSize(12);
  pdf.setTextColor(128, 128, 128);
  const today = new Date().toLocaleDateString('ru-RU');
  pdf.text(`Создано: ${today}`, 20, 60);
  
  // Категория
  const categoryNames = {
    health: 'Здоровье',
    love: 'Любовь', 
    career: 'Карьера',
    money: 'Финансы',
    family: 'Семья',
    dreams: 'Мечты'
  };
  pdf.text(`Категория: ${categoryNames[data.category as keyof typeof categoryNames]}`, 20, 70);
  
  // Линия разделитель
  pdf.setDrawColor(66, 139, 202);
  pdf.line(20, 80, 190, 80);
  
  // Аффирмации
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  let yPosition = 100;
  
  affirmations.forEach((affirmation, index) => {
    // Проверка на новую страницу
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 30;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}.`, 20, yPosition);
    
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(affirmation, 160);
    pdf.text(lines, 30, yPosition);
    
    yPosition += lines.length * 7 + 10;
  });
  
  // Добавляем инструкции
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.setTextColor(66, 139, 202);
  pdf.text('Как использовать аффирмации', 20, 30);
  
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  const instructions = [
    '1. Читайте аффирмации каждое утро после пробуждения',
    '2. Повторяйте их вечером перед сном',
    '3. Говорите с чувством и верой в каждое слово',
    '4. Визуализируйте желаемый результат',
    '5. Будьте терпеливы - изменения требуют времени',
    '6. Верьте в силу ваших слов и намерений'
  ];
  
  let instructionY = 50;
  instructions.forEach(instruction => {
    pdf.text(instruction, 20, instructionY);
    instructionY += 15;
  });
  
  // Мотивационная подпись
  pdf.setFontSize(14);
  pdf.setTextColor(66, 139, 202);
  pdf.text('Верьте в себя - вы достойны всего самого лучшего!', 20, instructionY + 20);
  
  return pdf.output('blob');
};

export const generateHTMLPreview = (data: AffirmationData): string => {
  const affirmations = generateAffirmations(data);
  const categoryNames = {
    health: 'Здоровье',
    love: 'Любовь',
    career: 'Карьера', 
    money: 'Финансы',
    family: 'Семья',
    dreams: 'Мечты'
  };
  
  return `
    <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: 'Georgia', serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <div style="background: rgba(255,255,255,0.95); color: #333; padding: 40px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        <h1 style="text-align: center; color: #667eea; margin-bottom: 10px; font-size: 2.5em;">✨ Персональные Аффирмации ✨</h1>
        <h2 style="text-align: center; color: #666; margin-bottom: 30px;">для ${data.name}</h2>
        
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <p style="margin: 5px 0; color: #666;"><strong>Дата создания:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Категория:</strong> ${categoryNames[data.category as keyof typeof categoryNames]}</p>
        </div>
        
        <div style="margin: 30px 0;">
          ${affirmations.map((affirmation, index) => `
            <div style="margin: 20px 0; padding: 15px; background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
              <strong style="font-size: 1.1em;">${index + 1}. ${affirmation}</strong>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 40px; padding: 20px; background: #e8f5e8; border-radius: 10px;">
          <h3 style="color: #2d5a2d; text-align: center; margin-bottom: 15px;">🌟 Как использовать аффирмации</h3>
          <ul style="color: #2d5a2d; line-height: 1.6;">
            <li>Читайте аффирмации каждое утро после пробуждения</li>
            <li>Повторяйте их вечером перед сном</li>
            <li>Говорите с чувством и верой в каждое слово</li>
            <li>Визуализируйте желаемый результат</li>
            <li>Будьте терпеливы - изменения требуют времени</li>
            <li>Верьте в силу ваших слов и намерений</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 1.2em; color: #667eea; font-weight: bold;">
          ✨ Верьте в себя - вы достойны всего самого лучшего! ✨
        </div>
      </div>
    </div>
  `;
};