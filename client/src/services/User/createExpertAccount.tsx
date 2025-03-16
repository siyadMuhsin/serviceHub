import { userAPI } from "../../../axiosConfig"

export const createExpertAccount = async(formDate:FormData)=>{
    try {
      
        const response= await userAPI.post('/experts/create',formDate,{
            headers: {
                "Content-Type": "multipart/form-data", // This is optional
            },
        })
        return response.data
    } catch (error) {
        
    }
}
