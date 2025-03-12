import { userAPI } from "axiosConfig"

export const get_categoryBy_limit=async(page:number,limit:number,searchQuary:string)=>{
    try {
        const response= await userAPI.get(`/categories?page=${page+1}&limit=${limit}&searchQuary=${searchQuary}`)
        return response.data
    } catch (error) {
        console.log(error)
        return error.data
    }

}
export const get_servicesByCategory_limit=async(categoryId:string,page:number,limit:number,searchQuary:String)=>{
    try {
        const response= await userAPI.get(`/services/${categoryId}?page=${page}&limit=${limit}&searchQuary=${searchQuary}`)
        return response.data
    }catch(err){
        console.log(err)
        return err.data
    }

}