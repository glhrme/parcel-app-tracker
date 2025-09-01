import { TrackingRepository } from "../repositories/trackingRepository";

export const useHomeViewModel = () => {
    const repository = new TrackingRepository();

    // Busca e salva tracking
    const trackAndSave = async (code: string) => {
        return await repository.trackAndSave(code);
    };

    // Retorna todos os trackings ordenados do mais novo para o mais velho
    const getAllTrackings = async () => {
        return await repository.getAllTrackings();
    };

    // Retorna X trackings mais recentes
    const getRecentTrackings = async (limit: number) => {
        return await repository.getRecentTrackings(limit);
    };

    return {
        trackAndSave,
        getAllTrackings,
        getRecentTrackings,
    };
}