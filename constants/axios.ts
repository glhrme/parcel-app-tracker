import axios from "axios";

// export const maltaPostAxiosInstance = axios.create({
//     url: "https://www.maltapost.com/TrackAndTraceApi/v1/trackedItems?barcode=BF235681477MT",
// })

export const axiosInstance = axios.create({
    baseURL: "https://www.maltapost.com"
})