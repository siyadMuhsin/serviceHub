import { userAPI } from "config/axiosConfig"

const cancelBooking=async(bookingId:string)=>{
    try {
        const response= await userAPI.patch(`/bookings/${bookingId}`)
        return response.data
    } catch (error) {
        throw new Error(error?.response?.data?.message)
    }
}
export {cancelBooking}