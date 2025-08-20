export interface DocumentData {
  wish: string;
  intensity: number;
  amount: number;
  email: string;
  userName: string;
  documentId: string;
}

// Экспорт типа как константы для совместимости с Vite
export const DocumentDataType = {} as DocumentData;