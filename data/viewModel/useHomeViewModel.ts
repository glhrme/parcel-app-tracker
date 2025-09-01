import { TrackingService } from "../services/trackingService"

export const useHomeViewModel = () => {


    const search = (async (code: string) => {
        const service = new TrackingService()
        service.addTracking(code).then((response) => {
            return response
        })
        .catch((error) => {
            throw error
        })
    })

    return {
        search
    }
}