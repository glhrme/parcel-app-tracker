import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrackingService } from "../services/trackingService";
import { ParcelResponse } from "../types/parcelResponse.type";
import { ProcessedTracking } from "../types/processedTracking.type";

export class TrackingRepository {
  private trackingService: TrackingService;

  constructor() {
    this.trackingService = new TrackingService();
  }

  // Processa ParcelResponse em ProcessedTracking
  private processParcelResponse(code: string, response: ParcelResponse): ProcessedTracking {
    const now = Date.now();
    
    // Extrai informações básicas
    const lastMovement = response.movements[response.movements.length - 1];
    const firstMovement = response.movements[0];
    
    // Determina a quantidade de checkpoints baseado nas regras
    const checkpointCount = this.determineCheckpointCount(response);
    
    // Cria checkpoints baseado na quantidade determinada
    const checkPoints = this.createCheckpoints(response, checkpointCount);

    return {
      originalData: response,
      trackingCode: code,
      status: lastMovement.description,
      date: new Date(lastMovement.date).toLocaleDateString(),
      fromLocation: firstMovement.location || 'No Info',
      toLocation: response.destination || 'No Info',
      checkPoints,
      addedAt: now,
      lastUpdated: now,
    };
  }

  // Determina a quantidade de checkpoints baseado nas regras de negócio
  private determineCheckpointCount(response: ParcelResponse): number {
    const firstMovement = response.movements[0];
    
    // 6 checkpoints: ItemCreated + isForeignMovement + location != Malta + isEasipikParcel
    if (firstMovement.code === 'EMC' || firstMovement.code === 'EMA' && 
        firstMovement.isForeignMovement && 
        firstMovement.location !== 'MaltaPost' && 
        firstMovement.location !== 'MT' && 
        response.isEasipikParcel) {
      return 6;
    }
    
    // 5 checkpoints: isEasipikParcel false OU (easipik true + primeiro movimento de Malta)
    if (!response.isEasipikParcel || 
        (response.isEasipikParcel && !firstMovement.isForeignMovement)) {
      return 5;
    }
    
    // 4 checkpoints: não é do exterior + easipik false
    if (!response.isForeign && !response.isEasipikParcel) {
      return 4;
    }
    
    // Default: 4 checkpoints
    return 4;
  }

  // Cria os checkpoints baseado na quantidade e movimentos
  private createCheckpoints(response: ParcelResponse, count: number): { completed: boolean; title?: string }[] {
    const movements = response.movements;
    
    // Define as labels baseado na quantidade de checkpoints
    let labels: string[] = [];
    
    if (count === 4) {
      // 4 checkpoints: Item Created -> In Transit -> Out for Delivery -> Delivered
      labels = ['Item Created', 'In Transit', 'Out for Delivery', 'Delivered'];
    } else if (count === 5) {
      if (response.isForeign) {
        // 5 checkpoints com item do exterior: Item Created -> Arrived in Country -> In Transit -> Out for Delivery -> Delivered
        labels = ['Item Created', 'Arrived in Country', 'In Transit', 'Out for Delivery', 'Delivered'];
      } else {
        // 5 checkpoints com item que não vem do exterior: Item Created -> In Transit -> Out for Delivery -> Ready for Collection -> Delivered
        labels = ['Item Created', 'In Transit', 'Out for Delivery', 'Ready for Collection', 'Delivered'];
      }
    } else if (count === 6) {
      // 6 checkpoints: Item Created -> Arrived in Country -> In Transit -> Out for Delivery -> Ready for Collection -> Delivered
      labels = ['Item Created', 'Arrived in Country', 'In Transit', 'Out for Delivery', 'Ready for Collection', 'Delivered'];
    }
    
    // Cria checkpoints com as labels corretas
    const checkPoints: { completed: boolean; title?: string }[] = [];
    
    // Mapeia códigos para estados dos checkpoints
    const movementCodes = movements.map(m => m.code);
    const hasCode = (code: string) => movementCodes.includes(code);
    
    for (let i = 0; i < count; i++) {
      let isCompleted = false;
      
      // Determina se o checkpoint está completo baseado no código
      switch (i) {
        case 0: // Item Created
          isCompleted = hasCode('EMA') || hasCode('EMC');
          break;
        case 1: // Arrived in Country (para exterior) ou In Transit (para local)
          if (response.isForeign) {
            isCompleted = hasCode('EMD') || hasCode('EDA');
          } else {
            isCompleted = hasCode('EMG');
          }
          break;
        case 2: // In Transit (para exterior) ou Out for Delivery (para local)
          if (response.isForeign) {
            isCompleted = hasCode('EMG');
          } else {
            isCompleted = hasCode('EDG');
          }
          break;
        case 3: // Out for Delivery
          isCompleted = hasCode('EDG');
          break;
        case 4: // Ready for Collection (para local) ou Delivered (para exterior)
          if (count === 5 && !response.isForeign) {
            isCompleted = hasCode('EDH');
          } else {
            isCompleted = hasCode('EMI');
          }
          break;
        case 5: // Delivered (apenas para 6 checkpoints)
          isCompleted = hasCode('EMI');
          break;
      }
      
      checkPoints.push({
        completed: isCompleted,
        title: labels[i] || `Step ${i + 1}`,
      });
    }
    
    return checkPoints;
  }

  // Salva o resultado processado no AsyncStorage
  async trackAndSave(code: string): Promise<ProcessedTracking> {
    // Verifica se já existe no localStorage
    const existingData = await AsyncStorage.getItem(code);
    
    // Faz a requisição da API
    const response = await this.trackingService.addTracking(code);
    
    let processedData: ProcessedTracking;
    
    if (existingData) {
      // Se já existe, mantém a data de criação original
      try {
        const existing = JSON.parse(existingData) as ProcessedTracking;
        processedData = this.processParcelResponse(code, response);
        processedData.addedAt = existing.addedAt; // Mantém data original
        processedData.lastUpdated = Date.now(); // Atualiza data de modificação
      } catch {
        // Se erro no parse, cria novo
        processedData = this.processParcelResponse(code, response);
      }
    } else {
      // Se não existe, cria novo
      processedData = this.processParcelResponse(code, response);
    }
    
    await AsyncStorage.setItem(code, JSON.stringify(processedData));
    return processedData;
  }

  // Verifica se um código de tracking já existe no localStorage
  async exists(code: string): Promise<boolean> {
    const item = await AsyncStorage.getItem(code);
    return item !== null;
  }

  // Retorna todos os ProcessedTracking salvos
  async getAllTrackings(): Promise<ProcessedTracking[]> {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    
    const parsed = items
      .map(([, value]) => {
        if (!value) return null;
        try {
          return JSON.parse(value) as ProcessedTracking;
        } catch {
          return null;
        }
      })
      .filter((item): item is ProcessedTracking => item !== null);

    // Ordena por data de adição (mais novo primeiro)
    parsed.sort((a, b) => b.addedAt - a.addedAt);
    return parsed;
  }

  // Retorna X ProcessedTracking do mais novo para o mais velho
  async getRecentTrackings(limit: number): Promise<ProcessedTracking[]> {
    const allTrackings = await this.getAllTrackings();
    return allTrackings.slice(0, limit);
  }
}