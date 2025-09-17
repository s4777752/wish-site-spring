export function drawHeader(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, documentId: string, activationDateStr: string, userName?: string) {
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
}