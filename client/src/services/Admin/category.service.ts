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
export const addCategory=async(formData)=>{
    try {
        const response = await adminAPI.post('/category',formData,{ headers: {
            "Content-Type": "multipart/form-data", // This is optional
        }} )
        return response.data
    } catch (error) {
        return error
    }
    
      
}