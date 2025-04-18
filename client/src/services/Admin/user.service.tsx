
import { adminAPI } from "config/axiosConfig"

export const user_block_unbloack = async (id: string, status: boolean) => {
    try {
        const response = await adminAPI.patch(`/user/${id}`, { block: status });
        return response.data; 
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
};

export const get_users=async()=>{
    try{
        const response= await adminAPI.get('/users')
        console.log(response)
        return response.data
    }catch(err:any){
        return err.data

    }

}