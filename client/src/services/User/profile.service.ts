import { userAPI } from "config/axiosConfig";
import { profile } from "console";
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
const updateUserProfile=async(profileData:any)=>{
    try {
        console.log(profileData)
        const response= await userAPI.put('profile',profileData)
        return response.data
    } catch (error) {
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
export {uploadProfileImage,updateUserProfile,changePassword}