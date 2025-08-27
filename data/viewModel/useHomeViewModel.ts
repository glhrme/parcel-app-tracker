import { TrackingService } from "../services/trackingService"

export const useHomeViewModel = () => {


    const search = (async (code: string) => {
        const service = new TrackingService()
        let response = await service.addTracking(code)
        return response
    })

    return {
        search
    }
}