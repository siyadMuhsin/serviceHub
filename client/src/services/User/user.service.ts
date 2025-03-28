import { userAPI } from "config/axiosConfig";
const addLocation=async(location:string,lat:number,lng:number)=>{
    try {
        const response= await userAPI.patch('/location',{location,lat,lng})
        return response.data
    } catch (error) {
        return error.response.data
        
    }
}
export {addLocation}