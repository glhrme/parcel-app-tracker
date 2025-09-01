import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrackingService } from "../services/trackingService";
import { ParcelResponse } from "../types/parcelResponse.type";

export class TrackingRepository {

  private trackingService: TrackingService;

  constructor() {
    this.trackingService = new TrackingService();
  }


  // Salva o resultado da request no AsyncStorage usando o código como chave
  async trackAndSave(code: string): Promise<ParcelResponse> {
    const response = await this.trackingService.addTracking(code);
    const now = Date.now();
    await AsyncStorage.setItem(code, JSON.stringify({ data: response, addedAt: now }));
    return response;
  }

  // Retorna todos os ParcelResponse salvos
  async getAllTrackings(): Promise<ParcelResponse[]> {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    // Parse e filtra apenas os válidos
    const parsed = items
      .map(([, value]) => {
        if (!value) return null;
        try {
          return JSON.parse(value) as { data: ParcelResponse; addedAt: number };
        } catch {
          return null;
        }
      })
      .filter((item): item is { data: ParcelResponse; addedAt: number } => item !== null);

    // Ordena por data de adição (addedAt)
    parsed.sort((a, b) => b.addedAt - a.addedAt); // Mais novo primeiro
    return parsed.map(item => item.data);
  }

  // Retorna X ParcelResponse do mais novo para o mais velho
  async getRecentTrackings(limit: number): Promise<ParcelResponse[]> {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    const parsed = items
      .map(([, value]) => {
        if (!value) return null;
        try {
          return JSON.parse(value) as { data: ParcelResponse; addedAt: number };
        } catch {
          return null;
        }
      })
      .filter((item): item is { data: ParcelResponse; addedAt: number } => item !== null);
    parsed.sort((a, b) => b.addedAt - a.addedAt); // Mais novo primeiro
    return parsed.slice(0, limit).map(item => item.data);
  }
}