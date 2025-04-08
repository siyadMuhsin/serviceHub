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
export{
    getExpertsSpecificService,
    getExpertDetails
}