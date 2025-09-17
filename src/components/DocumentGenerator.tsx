import type { DocumentData } from './document-generator/types';
import { getAffirmationsForWish } from './document-generator/affirmations';
import { 
  setupCanvas, 
  drawBackground, 
  drawWatermarks, 
  drawBorders, 
  drawCornerDecorations 
} from './document-generator/canvas-setup';
import { drawHeader } from './document-generator/header-section';
import { drawWishSection } from './document-generator/wish-section';
import { drawAffirmationsSection } from './document-generator/content-sections';
import { drawFooterInfo, drawSeal, drawBottomText } from './document-generator/footer-section';

export { DocumentData, getAffirmationsForWish };

export const generateAndDownloadDocument = (documentData: DocumentData) => {
  if (!documentData) return;
  
  const documentId = documentData.documentId || `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const currentDate = documentData.timestamp || new Date().toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const canvasResult = setupCanvas();
  if (!canvasResult) return;
  
  const { canvas, ctx } = canvasResult;
  
  const activationDate = new Date();
  activationDate.setDate(activationDate.getDate() + 1);
  const activationDateStr = activationDate.toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  drawBackground(ctx, canvas);
  drawWatermarks(ctx, canvas);
  drawBorders(ctx, canvas);
  drawCornerDecorations(ctx, canvas);
  drawHeader(ctx, canvas, documentId, activationDateStr);
  
  const affirmationStartY = drawWishSection(ctx, canvas, documentData);
  drawAffirmationsSection(ctx, canvas, documentData.wish, affirmationStartY);
  
  drawFooterInfo(ctx, canvas, documentId, activationDateStr);
  drawSeal(ctx, canvas, documentId, currentDate);
  drawBottomText(ctx, canvas, documentData);
  
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