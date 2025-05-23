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
        throw new Error(error.response.data.message)
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

export const existingExpert= async()=>{
    try {
        const resonse= await userAPI.get('expert')
        return resonse.data
    } catch (error) {
        console.error(error.resonse.data)
        throw new Error (error.response.data.messsage)
    }
}