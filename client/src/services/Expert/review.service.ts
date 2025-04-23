import { expertAPI } from "config/axiosConfig"

const getReviewsByExpertId=async (page:number,limit:number)=>{
    try {
        const response=await expertAPI.get(`/reviews/?page=${page}&limit=${limit}`)
        return response.data
    } catch (error) {
        throw new Error(error?.response?.data?.message)
        
    }
}
export {
    getReviewsByExpertId
}