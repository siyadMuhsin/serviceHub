import { RepeatOneSharp } from "@mui/icons-material"
import { expertAPI, userAPI } from "config/axiosConfig"

const getConversation=async (userId:string,revieverId:string)=>{
    try {
        const response= await userAPI.get(`/chat/${revieverId}`)
        console.log(response);
        
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
        
    }
}
const getChatUsers = async (expertId: string) => {
    try {
      const res = await expertAPI.get(`/chat/users`);       
      return res.data;
    } catch (err) {
      throw new Error(err.response.data.message || "Failed to load chat users.");
    }
  };


  const getConversationToUser=async (userId:string,revieverId:string)=>{
    try {
        const response= await expertAPI.get(`/chat/${revieverId}`)
        return response.data
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}
export {
    getConversation,
    getChatUsers,getConversationToUser
}