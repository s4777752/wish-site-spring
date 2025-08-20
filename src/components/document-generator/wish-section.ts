import { DocumentData } from './types';
import { wrapText } from './utils';

export function drawWishSection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, documentData: DocumentData) {
  const wishBox = {
    x: 120,
    y: 300,
    width: canvas.width - 240,
    height: 180
  };
  
  const wishGradient = ctx.createLinearGradient(wishBox.x, wishBox.y, wishBox.x, wishBox.y + wishBox.height);
  wishGradient.addColorStop(0, 'rgba(30, 58, 138, 0.3)');
  wishGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
  wishGradient.addColorStop(1, 'rgba(30, 58, 138, 0.3)');
  ctx.fillStyle = wishGradient;
  ctx.fillRect(wishBox.x, wishBox.y, wishBox.width, wishBox.height);
  
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 4;
  ctx.strokeRect(wishBox.x, wishBox.y, wishBox.width, wishBox.height);
  
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1;
  ctx.strokeRect(wishBox.x + 15, wishBox.y + 15, wishBox.width - 30, wishBox.height - 30);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px serif';
  ctx.textAlign = 'center';
  ctx.fillText('ЖЕЛАНИЕ', canvas.width/2, wishBox.y + 45);
  
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 20px serif';
  const maxWishWidth = wishBox.width - 40;
  const wishLines = wrapText(ctx, documentData.wish, maxWishWidth);
  wishLines.forEach((line, index) => {
    ctx.fillText(line, canvas.width/2, wishBox.y + 90 + (index * 28));
  });
  
  const paramsY = wishBox.y + wishBox.height + 80;
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`Уровень силы: ${documentData.intensity}/10`, canvas.width/2, paramsY);
  ctx.fillText(`Энергетический вклад: ${documentData.amount} ₽`, canvas.width/2, paramsY + 40);
  
  return paramsY + 100;
}