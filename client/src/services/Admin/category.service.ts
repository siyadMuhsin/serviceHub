import { adminAPI } from "../../../axiosConfig";

export const getCategories = async () => {
    try {
        const response = await adminAPI.get('/categories');
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { categories: [] }; 
    }
};
export const addCategory=async()=>{
    const response = await adminAPI.post('/service')
    return response.data
    
}