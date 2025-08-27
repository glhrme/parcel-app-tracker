import { axiosInstance } from "@/constants/axios";
import { ParcelResponse } from "../types/parcelResponse.type";

export class TrackingService {

  public async addTracking(code: string): Promise<ParcelResponse> {
    try {
      console.log("Tracking called")

      const response = await axiosInstance.get(`/TrackAndTraceApi/v1/trackedItems?barcode=${code}`);
      
      return response.data;
    } catch (error: any) {
      // Trate erros de requisição
      throw new Error('Failed to add tracking.');
    }
  }
}