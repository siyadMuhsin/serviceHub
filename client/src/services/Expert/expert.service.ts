import { expertAPI } from "config/axiosConfig"

const get_expert=async()=>{
    try {
        const response= await expertAPI.get('/fetch-data')
        console.log(response)
        return response.data
    } catch (error) {
        return {success:false,error:error.response.data}
        
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
export {get_expert,availbalePlans,purchaseSubscription,verifyPayment}