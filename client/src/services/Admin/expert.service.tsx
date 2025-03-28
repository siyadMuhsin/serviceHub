import { adminAPI } from "config/axiosConfig";
export const get_experts=async(page:number,limit:number,filter:string,search:string)=>{
    try {
        const response= await adminAPI.get(`/experts/?page=${page+1}&limit=${limit}&filter=${filter}&search=${search}`)
        return response.data
    } catch (error) {
        console.log(error)
        return error.data
        
    }
}

export const expert_change_action = async (id: string, action: string,reason?:string) => {
    try {
      const response = await adminAPI.patch(`/expert/${id}`, { action ,reason});
      return response.data; // Return the API response
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An unexpected error occurred",
      };
    }
  };
export const block_unlbock_expert=async(id:string,active:boolean)=>{
    try {
        console.log(active)
        const response= await adminAPI.patch(`/expert/block/${id}`,{active})
        console.log(response)
        return response.data
    } catch (error) {
        return {success:false,error:error?.response.data}
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
