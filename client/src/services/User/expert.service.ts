import { userAPI } from "config/axiosConfig"

const getExpertsSpecificService=async (serviceId:string)=>{
    try {
        const response= await userAPI.get(`/user/expert/service/${serviceId}`)
        return response.data
    } catch (error){
        throw new Error(error.response.data.message)
        
    }
}
const getExpertDetails=async(experId:string)=>{
    try {
        const response= await userAPI.get(`/user/expert/${experId}`)
        console.log(response)
        return response.data
    } catch (error) {
        return error.response.data.message
        
    }
}
const getAvailableSlots=async(expertId:string)=>{
    try {
        const response= await userAPI.get(`/slots/${expertId}`)
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
        
    }
}
const handlingBooking=async (formData:FormData)=>{
    try {
        const response= await userAPI.post('/book',formData,{
            headers: {
                "Content-Type": "multipart/form-data",
              },
        })
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
        
    }
}
const getUserBookings=async (page:number,limit:number)=>{
    try {
        const response= await userAPI.get(`/bookings?page=${page}&limit=${limit}`)
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
        
    }
}
export{
    getExpertsSpecificService,
    getExpertDetails,
    getAvailableSlots,
    handlingBooking,
    getUserBookings
}