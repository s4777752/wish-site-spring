import { getAffirmationsForWish } from './affirmations';
import { wrapText } from './utils';

export function drawAffirmationsSection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, wish: string, affirmationY: number) {
  const affirmations = getAffirmationsForWish(wish);
  const affirmationLines = affirmations.split('\\n');
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px serif';
  ctx.textAlign = 'center';
  ctx.fillText('ПЕРСОНАЛЬНЫЕ АФФИРМАЦИИ', canvas.width/2, affirmationY);
  
  affirmationY += 80;
  
  affirmationLines.forEach((line, index) => {
    if (line.trim()) {
      const [title, text] = line.split('|');
      
      if (title && text) {
        // Заголовок аффирмации
        ctx.fillStyle = '#60a5fa';
        ctx.font = 'bold 24px serif';
        ctx.textAlign = 'center';
        ctx.fillText(title.trim(), canvas.width/2, affirmationY);
        
        affirmationY += 40;
        
        // Текст аффирмации
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        const wrappedLines = wrapText(ctx, text.trim(), canvas.width - 160);
        wrappedLines.forEach((wrappedLine, lineIndex) => {
          ctx.fillText(wrappedLine, canvas.width/2, affirmationY + (lineIndex * 28));
        });
        
        affirmationY += wrappedLines.length * 28 + 50;
      }
    }
  });
  
  return affirmationY;
}

