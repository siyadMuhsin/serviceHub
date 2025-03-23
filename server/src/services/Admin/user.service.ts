import UserRepository from "../../repositories/UserRepository"

class UserServices{
    async getUsers(){
        try {
            const users= await UserRepository.getAlluser()
            return {success:true , users}
        } catch (error) {
            return {success:false,message:error}
        }
    }
    async blockUnblockUser(id:string,block:boolean){
        try {
            const user= await UserRepository.findUserById(id)
            if(!user){
                return { success: false, message: "User not found" };
            }
            const newStatus= !user.isBlocked
            const updatedUser= await UserRepository.findByIdAndUpdate(id,{isBlocked:newStatus})
            return { success: true, message: `User ${block ? "blocked" : "unblocked"} successfully`,updatedUser };
        } catch (error) {
            return { success: false, message: "Error updating user status" }; 
        }
    }
    async checkBloked(id:string){
        try {
            const user= await UserRepository.findUserById(id)
            return !user?.isBlocked
        } catch (error) {
            return { success: false, message: "Error updating user status" };
        }
       
    }
}

export default new UserServices