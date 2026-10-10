import { TOP_BLOCKS_OFFSET } from './utils';

export function drawHeader(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, documentId: string, activationDateStr: string, userName?: string) {
  ctx.save();
  ctx.translate(0, TOP_BLOCKS_OFFSET);
  const titleBg = ctx.createLinearGradient(0, 120, 0, 280);
  titleBg.addColorStop(0, 'rgba(30, 64, 175, 0.4)');
  titleBg.addColorStop(0.5, 'rgba(59, 130, 246, 0.6)');
  titleBg.addColorStop(1, 'rgba(30, 64, 175, 0.4)');
  ctx.fillStyle = titleBg;
  ctx.fillRect(80, 120, canvas.width - 160, 160);
  
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.strokeRect(80, 120, canvas.width - 160, 160);
  
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1;
  ctx.strokeRect(95, 135, canvas.width - 190, 130);
  
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.fillText('АФФИРМАЦИЯ ЖЕЛАНИЙ', canvas.width/2, 180);
  
  ctx.font = 'italic 26px serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('Персональный документ силы', canvas.width/2, 220);
  
  // Добавляем ФИО получателя под "Персональный документ силы"
  if (userName) {
    ctx.font = 'bold 20px serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`Получатель: ${userName}`, canvas.width/2, 250);
  }
  
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Рисуем декоративную линию ниже ФИО
  const lineY = userName ? 270 : 240; // Если есть ФИО, линия ниже, иначе на прежнем месте
  const lineGradient = ctx.createLinearGradient(200, lineY, canvas.width - 200, lineY);
  lineGradient.addColorStop(0, 'transparent');
  lineGradient.addColorStop(0.3, '#60a5fa');
  lineGradient.addColorStop(0.7, '#60a5fa');
  lineGradient.addColorStop(1, 'transparent');
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, lineY);
  ctx.lineTo(canvas.width - 200, lineY);
  ctx.stroke();
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outer: number) {
  const inner = outer * 0.45;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (Math.PI * i) / 5;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

export function drawDocumentLabel(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 72px serif';
  ctx.fillText('ДОКУМЕНТ', canvas.width / 2, 190);
  ctx.restore();
}

export function drawStarsBetweenBlocks(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const top = 120 + 160 + TOP_BLOCKS_OFFSET;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
  ctx.shadowBlur = 8;
  drawStar(ctx, canvas.width / 2, top + 40, 16);
  drawStar(ctx, 140, top + 40, 16);
  drawStar(ctx, canvas.width - 140, top + 40, 16);
  ctx.restore();
}
