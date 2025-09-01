import { TrackingRepository } from "../repositories/trackingRepository";
import { ProcessedTracking } from "../types/processedTracking.type";

export const useHomeViewModel = () => {
    const repository = new TrackingRepository();

    // Busca e salva tracking
    const trackAndSave = async (code: string): Promise<ProcessedTracking> => {
        return await repository.trackAndSave(code);
    };

    // Retorna todos os trackings ordenados do mais novo para o mais velho
    const getAllTrackings = async (): Promise<ProcessedTracking[]> => {
        return await repository.getAllTrackings();
    };

    // Retorna X trackings mais recentes
    const getRecentTrackings = async (limit: number): Promise<ProcessedTracking[]> => {
        return await repository.getRecentTrackings(limit);
    };

    // Verifica se um código já existe
    const exists = async (code: string): Promise<boolean> => {
        return await repository.exists(code);
    };

    // Busca um tracking específico pelo código
    const getTrackingByCode = async (code: string): Promise<ProcessedTracking | null> => {
        return await repository.getTrackingByCode(code);
    };

    // Atualiza um tracking específico
    const updateTracking = async (code: string): Promise<ProcessedTracking | null> => {
        return await repository.updateTracking(code);
    };

    return {
        trackAndSave,
        getAllTrackings,
        getRecentTrackings,
        exists,
        getTrackingByCode,
        updateTracking,
    };
}