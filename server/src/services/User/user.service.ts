import { inject, injectable } from "inversify";
import { IProfileService } from "../../core/interfaces/services/IProfileService";
import bcrypt from 'bcryptjs'
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../core/interfaces/repositories/IUserRepository";
import { IExpertRepository } from "../../core/interfaces/repositories/IExpertRepository";
import { IExpert } from "../../types/Expert";
import { CloudinaryService } from "../../config/cloudinary";
import { IUser } from "../../models/user.model";
@injectable()
export class ProfileService implements IProfileService {
    constructor(
        @inject(TYPES.UserRepository) private userRepositry :IUserRepository,
     ){}

   
     async addLocation(userId: string, lat: number, lng: number) {
        try {
            const location:any = {} ;
            location.lat=lat
            location.lng=lng
    
            const user = await this.userRepositry.findByIdAndUpdate(userId,{ location },);
            if (!user) {
                return { 
                    success: false, 
                    message: "User not found" 
                };
            }
            return { 
                success: true, 
                message: "Location updated successfully",  
            };
        } catch (error) {
            console.error("Error in addLocation:", error);
            return { 
                success: false, 
                message: "Failed to update location" 
            };
        }
    }

    async getExpertData(id:string){
        try {
            const expertData= await this.userRepositry.getExpertByUserId(id)
            if(expertData){
                
                return {success:true,message:'Expert data fetched successfully',expert:expertData}
            }
            return {success:false,message:"Expert data not found"}
           

        } catch (error:any) {
            return {success:false,message: error.message ||'something error in getExpert data'}
        }

    }
    async profileImageUpload(userId:string,file:Express.Multer.File){
        try {

            const profileImageUrl= await CloudinaryService.uploadImage(file)
            if(profileImageUrl){
                await this.userRepositry.findByIdAndUpdate(userId,{profile_image:profileImageUrl})
                return {success:true,message:'Profile updated successFully',profileImageUrl}
            }
            return {success:false,message:"failed to upload cloudnary"}
        } catch (error:any) {
            return {success:false,message:error.message|| 'failed to upload profile'}
        }
    }
    async profileUpdate(userId:string,data:Partial<IUser>){
        try {
            await this.userRepositry.findByIdAndUpdate(userId,data)
            return {success:true,message:'Profile updated Successfully'}

        } catch (error:any) {
            return {success:false,message:error.message || 'Failed to update profile'}
        }

    }
    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        try {
          const user = await this.userRepositry.findUserById(userId);
          if (!user) {
            return { success: false, message: 'User not found' };
          }
          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if (!isMatch) {
            return { success: false, message: 'Current password is incorrect' };
          }
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await this.userRepositry.findByIdAndUpdate(userId, { password: hashedPassword });
          return { success: true, message: 'Password changed successfully' };
        } catch (error) {
          console.error("Change password error:", error); // optional: for debugging
          return { success: false, message: 'Failed to change password' };
        }
      }
}
