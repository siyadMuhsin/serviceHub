import { expertAPI, userAPI } from "../../../config/axiosConfig"

export const createExpertAccount = async(formDate:FormData)=>{
    try {
      
        const response= await userAPI.post('/expert/create',formDate,{
            headers: {
                "Content-Type": "multipart/form-data", // This is optional
            },
        })
        return response.data
    } catch (error) {
       
        // throw new Error(error)
        return {success:false,message:error.response?.data?.error}


        
    }
}
export const switchExpert=async()=>{
    try {
        const response=await userAPI.get('/switch_expert')
        return response.data
    } catch (error) {
        return error?.response?.data
    }
}

export const switchUser=async()=>{
    try {
        const response=await expertAPI.get('/switch_user')
        return response.data
    } catch (error) {
        return error?.response?.data
    }
}
