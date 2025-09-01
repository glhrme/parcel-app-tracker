import { ParcelResponse } from './parcelResponse.type';

export interface ProcessedTracking {
  // Dados originais da API
  originalData: ParcelResponse;
  
  // Dados processados para o TrackingCard
  trackingCode: string;
  status: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  checkPoints: {
    completed: boolean;
    title?: string;
  }[];
  
  // Metadados
  addedAt: number; // timestamp de quando foi adicionado
  lastUpdated: number; // timestamp da última atualização
}
