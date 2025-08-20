export type { DocumentData } from './types';
export { getAffirmationsForWish } from './affirmations';
export { 
  setupCanvas, 
  drawBackground, 
  drawWatermarks, 
  drawBorders, 
  drawCornerDecorations 
} from './canvas-setup';
export { drawHeader } from './header-section';
export { drawWishSection } from './wish-section';
export { 
  drawAffirmationsSection, 
  drawPsychologySection, 
  drawInstructionsSection 
} from './content-sections';
export { drawFooterInfo, drawSeal, drawBottomText } from './footer-section';