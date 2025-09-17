import { DocumentData } from './types';

export function drawFooterInfo(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, documentId: string, activationDateStr: string) {
  const docInfoX = 150;
  const docInfoY = canvas.height - 280;
  
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Документ №: ${documentId}`, docInfoX, docInfoY - 20);
  
  ctx.font = '20px serif';
  ctx.fillText(`Дата активации:`, docInfoX, docInfoY + 20);
  ctx.fillText(activationDateStr, docInfoX, docInfoY + 50);
}

export function drawSeal(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, documentId: string, currentDate: string) {
  const sealX = canvas.width - 280;
  const sealY = canvas.height - 280;
  const sealRadius = 90;
  
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 8;
  ctx.beginPath();
  
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
  
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 45, 0, Math.PI * 2);
  ctx.stroke();
  
  const ornamentRadius = 8;
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI * 2 * i) / 4 + Math.PI / 4;
    const ornX = sealX + Math.cos(angle) * (sealRadius - 15);
    const ornY = sealY + Math.sin(angle) * (sealRadius - 15);
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(ornX, ornY, ornamentRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.arc(ornX, ornY, ornamentRadius - 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.fillStyle = '#1e40af';
  ctx.beginPath();
  ctx.moveTo(sealX, sealY - 20);
  ctx.lineTo(sealX + 15, sealY);
  ctx.lineTo(sealX, sealY + 20);
  ctx.lineTo(sealX - 15, sealY);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px serif';
  ctx.textAlign = 'center';
  ctx.fillText('САЙТ ЖЕЛАНИЙ', sealX, sealY - 15);
  ctx.font = '12px serif';
  ctx.fillText('POEHALI.DEV', sealX, sealY);
  ctx.font = '10px serif';
  ctx.fillText(`№${documentId.slice(-6)}`, sealX, sealY + 15);
  ctx.fillText(currentDate.split(' ')[2], sealX, sealY + 30);
}

export function drawBottomText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, documentData: DocumentData) {
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚠️ ДОКУМЕНТ ДЕЙСТВУЕТ ПОСЛЕ ОПЛАТЫ СИЛЫ ⚠️', canvas.width/2, canvas.height - 100);
  
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px sans-serif';
  const emailText = documentData.email ? ` • Email: ${documentData.email}` : '';
  ctx.fillText(`Получатель: ${documentData.userName}${emailText}`, canvas.width/2, canvas.height - 60);
}