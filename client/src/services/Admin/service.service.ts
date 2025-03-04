import { adminAPI } from "../../../axiosConfig";

export const getServices=async()=>{
    try {
        const response= await adminAPI.get('/services')
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error("Error fetching services:", error);
        return { services: [] }; 
    }
}
