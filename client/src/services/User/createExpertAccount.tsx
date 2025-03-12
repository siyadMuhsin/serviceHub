import { userAPI } from "../../../axiosConfig"

export const createExpertAccount = async(formDate:FormData)=>{
    try {
      
        const response= await userAPI.post('/auth/experts/create',formDate,{
            headers: {
                "Content-Type": "multipart/form-data", // This is optional
            },
        })
        return response.data
    } catch (error) {
        
    }
}

export const category_serviceFetch=async()=>{
    try {
        const response= await userAPI.get('/categories')
    } catch (error) {
        
    }
}
