import { getAffirmationsForWish } from './affirmations';
import { wrapText } from './utils';

export function drawAffirmationsSection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, wish: string, affirmationY: number) {
  const affirmations = getAffirmationsForWish(wish);
  const affirmationLines = affirmations.split('\\n');
  
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
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(150, affirmationY + (index * 35) - 5, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(150, affirmationY + (index * 35) - 5, 3, 0, Math.PI * 2);
      ctx.fill();
      
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
  
  return affirmationY + 60;
}

export function drawPsychologySection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, affirmationY: number) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('ПСИХОЛОГИЧЕСКАЯ ОСНОВА АФФИРМАЦИЙ', canvas.width/2, affirmationY);
  
  affirmationY += 40;
  ctx.font = '15px serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#cbd5e1';
  
  const psychologyDescription = [
    '• Аффирмации работают через механизм нейропластичности - способность мозга формировать новые нейронные связи',
    '• Повторение позитивных утверждений активирует префронтальную кору, отвечающую за целеполагание и планирование',
    '• Визуализация во время произнесения аффирмаций стимулирует зеркальные нейроны, создавая эффект "проживания" желаемого',
    '• Эмоциональная вовлеченность активирует лимбическую систему, закрепляя новые убеждения в долговременной памяти',
    '• Регулярная практика в течение 14 дней формирует устойчивые паттерны мышления и поведения',
    '• Утреннее время оптимально для аффирмаций из-за высокого уровня кортизола и восприимчивости подсознания'
  ];
  
  psychologyDescription.forEach((description, index) => {
    const cleanDescription = description.replace('•', '').trim();
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(150, affirmationY + (index * 28) - 3, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(150, affirmationY + (index * 28) - 3, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#cbd5e1';
    const wrappedDescriptions = wrapText(ctx, cleanDescription, canvas.width - 200);
    wrappedDescriptions.forEach((wrappedLine, lineIndex) => {
      ctx.fillText(wrappedLine, 170, affirmationY + (index * 28) + (lineIndex * 16));
    });
    if (wrappedDescriptions.length > 1) {
      affirmationY += (wrappedDescriptions.length - 1) * 16;
    }
  });
  
  return affirmationY + 80;
}

export function drawInstructionsSection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, affirmationY: number) {
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
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(150, affirmationY + (index * 30) - 3, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(150, affirmationY + (index * 30) - 3, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#cbd5e1';
    const wrappedInstructions = wrapText(ctx, cleanInstruction, canvas.width - 200);
    wrappedInstructions.forEach((wrappedLine, lineIndex) => {
      ctx.fillText(wrappedLine, 170, affirmationY + (index * 30) + (lineIndex * 16));
    });
    if (wrappedInstructions.length > 1) {
      affirmationY += (wrappedInstructions.length - 1) * 16;
    }
  });
}