import { expertAPI } from "axiosConfig"

const get_expert=async()=>{
    try {
        const response= await expertAPI.get('/fetch-data')
        return response.data
    } catch (error) {
        return {success:false,error:error.response.data}
        
    }
}
export {get_expert}