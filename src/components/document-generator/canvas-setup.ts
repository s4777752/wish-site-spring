export function setupCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  canvas.width = 1200;
  canvas.height = 2100;
  
  return { canvas, ctx };
}

export function drawBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(0.3, '#1e293b');
  gradient.addColorStop(0.7, '#334155');
  gradient.addColorStop(1, '#475569');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawWatermarks(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
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
}

export function drawBorders(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const borderWidth = 40;
  const borderGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  borderGradient.addColorStop(0, '#1e40af');
  borderGradient.addColorStop(0.3, '#3b82f6');
  borderGradient.addColorStop(0.6, '#60a5fa');
  borderGradient.addColorStop(1, '#1e40af');
  
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(borderWidth/2, borderWidth/2, canvas.width - borderWidth, canvas.height - borderWidth);
  
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 4;
  ctx.strokeRect(borderWidth + 20, borderWidth + 20, canvas.width - 2*(borderWidth + 20), canvas.height - 2*(borderWidth + 20));
  
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 2;
  ctx.strokeRect(borderWidth + 35, borderWidth + 35, canvas.width - 2*(borderWidth + 35), canvas.height - 2*(borderWidth + 35));
}

export function drawCornerDecorations(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const drawCornerDecoration = (x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
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
    
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.moveTo(15, 15);
    ctx.lineTo(45, 15);
    ctx.lineTo(35, 25);
    ctx.lineTo(25, 35);
    ctx.lineTo(15, 45);
    ctx.closePath();
    ctx.fill();
    
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
}