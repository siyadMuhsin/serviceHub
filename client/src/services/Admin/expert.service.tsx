import { adminAPI } from "axiosConfig";
export const get_experts=async(page:number,limit:number,filter:string)=>{
    try {
        const response= await adminAPI.get(`/experts/?page=${page}&limit=${limit}&filter=${filter}`)
        return response.data
    } catch (error) {
        console.log(error)
        return error.data
        
    }
}
