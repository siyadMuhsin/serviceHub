import { adminAPI } from "axiosConfig";
export const get_experts=async(page:number,limit:number,filter:string,search:string)=>{
    try {
        const response= await adminAPI.get(`/experts/?page=${page+1}&limit=${limit}&filter=${filter}&search=${search}`)
        return response.data
    } catch (error) {
        console.log(error)
        return error.data
        
    }
}

export const expert_change_action=async(id:string,action:string)=>{
    try {
        const response= await adminAPI.patch(`/expert/${id}`,{action})
        return response.data
    } catch (error) {
        return error.data
        
    }
}
export const block_unlbock_expert=async(id:string,active:boolean)=>{
    try {
        console.log(id)
        const response= await adminAPI.patch(`/expert/block/${id}`,{active})
        return response.data
    } catch (error) {
        return error.data
    }

}
export const getExpertData=async(id:string)=>{
    try {
        const response=await adminAPI.get(`/expert/${id}`)
        return response.data
    } catch (error) {
        return error.data
        
    }
}
