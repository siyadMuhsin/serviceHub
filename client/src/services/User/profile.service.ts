import { IUser } from "@/Interfaces/interfaces";
import { userAPI } from "config/axiosConfig";
const uploadProfileImage=async(formData:FormData)=>{
    try {
        const response= await userAPI.post('/profile/image',formData,
            { headers: {
            "Content-Type": "multipart/form-data", 
        },}
    )
        return response.data
    } catch (error) {
        throw new Error (error.response.data.message)  
    }
}
const updateUserProfile=async(profileData:IUser)=>{
    try {
        if(!profileData?.location?.lat || !profileData?.location?.lng){
            delete profileData.location
        }
        const response= await userAPI.put('profile',profileData)
        return response.data
    } catch (error) {
        console.log(error)
        throw new Error (error.response.data.message)  
    }
}
const changePassword= async(currentPassword:string,newPassword:string)=>{
    try {
        const response= await userAPI.patch('/profile/changePassword',{currentPassword,newPassword})
        return response.data
    } catch (error) {
        throw new Error (error.response.data.message)  
    }
}

const saveService=async(serviceId:string)=>{
    try {
        const response= await userAPI.patch(`/service-save/${serviceId}`)
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
        
    }
}
const unsaveService=async(serviceId:string)=>{
    try {
        const response= await userAPI.patch(`/service-unsave/${serviceId}`)
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)  
    }
}
const fetchSavedService=async()=>{
try {
    const response= await userAPI.get('/saved-service')
    return response.data
} catch (error) {
    throw new Error(error?.response?.data?.message)
    
}
}
export {uploadProfileImage,updateUserProfile,changePassword,saveService,unsaveService,fetchSavedService}