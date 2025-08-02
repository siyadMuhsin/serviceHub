import { expertAPI } from "config/axiosConfig"


const get_expert=async()=>{
    try {
        const response= await expertAPI.get('/fetch-data')
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
        
    }
}

const availbalePlans=async()=>{
    try {
        const response= await expertAPI.get('/plans')
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
        
    }
}
const purchaseSubscription =async(planId:string)=>{
    try {
        const response= await expertAPI.post(`/plan/purchase/${planId}`)
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}
const verifyPayment= async (paymentIntentId:string,planId:string)=>{
    try {
        const response=await expertAPI.post('/payment/verify',{paymentIntentId,planId})
return response.data
    } catch (error) {
        throw new Error(error.response.data.message ||'Payment verification failed')
    }
}
const getBookingsToExpert=async(status?: string,page?: number,limit?: number)=>{
    try {
        const response= await expertAPI.get(`/booking?status=${status}&page=${page}&limit=${limit}`)
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}
const updateBookingStatus=async(bookingId:string,status:string,reason?:string)=>{
    try{
        console.log(status,reason);
        
        const response= await expertAPI.patch(`/booking/${bookingId}`,{status,reason})
        return response.data
    }catch(error){
        console.log(error)
        throw new Error(error.response.data.message)

    }
}
const get_expert_bookings=async ()=>{
    try {
        const response= await expertAPI.get('/booking/stats')
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}
export {get_expert,availbalePlans,purchaseSubscription,verifyPayment,getBookingsToExpert, updateBookingStatus,get_expert_bookings}