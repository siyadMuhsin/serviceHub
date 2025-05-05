import { inject, injectable } from "inversify";
import { IProfileService } from "../../core/interfaces/services/IProfileService";
import bcrypt from 'bcryptjs'
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../core/interfaces/repositories/IUserRepository";
import { IExpertRepository } from "../../core/interfaces/repositories/IExpertRepository";
import { IExpert } from "../../types/Expert";
import { CloudinaryService } from "../../config/cloudinary";
import { IUser } from "../../models/user.model";
import { IServiceRepository } from "../../core/interfaces/repositories/IServiceRepository";
import { IServices } from "../../types/Admin";
@injectable()
export class ProfileService implements IProfileService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepositry :IUserRepository,
        @inject(TYPES.ServiceRepository) private _serviceRepository:IServiceRepository
     ){}

   
     async addLocation(userId: string, lat: number, lng: number) {
        try {
            const location = {
                type: "Point",
                coordinates: [lng, lat]  // GeoJSON requires [longitude, latitude]
            };
            const user = await this._userRepositry.updateById(
                userId,
                { location },
            );
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
          const err= error as Error
            console.error("Error in addLocation:", err);
            return {
                success: false,
                message:err.message|| "Failed to update location"
            };
        }
    }
    

    async getExpertData(id:string){
        try {
            const expertData= await this._userRepositry.getExpertByUserId(id)
            if(expertData){
                return {success:true,message:'Expert data fetched successfully',expert:expertData}
            }
            return {success:false,message:"Expert data not found"}
        } catch (error) {
          const err= error as Error
            return {success:false,message: err.message ||'something error in getExpert data'}
        }

    }
    async profileImageUpload(userId:string,file:Express.Multer.File){
        try {
            const profileImageUrl= await CloudinaryService.uploadImage(file)
            if(profileImageUrl){
                await this._userRepositry.updateById(userId,{profile_image:profileImageUrl})
                return {success:true,message:'Profile updated successFully',profileImageUrl}
            }
            return {success:false,message:"failed to upload cloudnary"}
        } catch (error) {
          const err= error as Error
            return {success:false,message:err.message|| 'failed to upload profile'}
        }
    }
    async profileUpdate(
        userId: string,
        data: Partial<Omit<IUser, "location">> & { location?: { lat: number; lng: number } }
      ) {
        try {
          let updateData: any = { ...data };
          if (data.location && data.location.lat && data.location.lng) {
            updateData.location = {
              type: 'Point',
              coordinates: [data.location.lng, data.location.lat], // GeoJSON format
            };
          }
          console.log(updateData)
          await this._userRepositry.updateById(userId, updateData);
          return {
            success: true,
            message: 'Profile updated successfully',
          };
        } catch (error) {
          const err= error as Error
          return {
            success: false,
            message: err.message || 'Failed to update profile',
          };
        }
      }
      
    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        try {
          const user = await this._userRepositry.findById(userId);
          if (!user) {
            return { success: false, message: 'User not found' };
          }
          if(user.isGoogleUser && !user.password){
            const hashedPassword = await bcrypt.hash(newPassword, 10);
          await this._userRepositry.updateById(userId, { password: hashedPassword });
          return { success: true, message: 'Password changed successfully'}
          }
          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if (!isMatch) {
            return { success: false, message: 'Current password is incorrect' };
          }
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await this._userRepositry.updateById(userId, { password: hashedPassword });
          return { success: true, message: 'Password changed successfully' };
        } catch (error) {
          const err= error as Error
          console.error("Change password error:", err); // optional: for debugging
          return { success: false, message:err.message|| 'Failed to change password' };
        }
      }

      async saveService(userId: string, serviceId: string): Promise<{ success: boolean; message: string }> {
        try {
          const user = await this._userRepositry.findById(userId);
          if (!user) {
            return { success: false, message: "User not found" };
          }
          const service = await this._serviceRepository.getServiceById(serviceId);
          if (!service) {
            return { success: false, message: "Service not found" };
          }
          // Add serviceId to savedServices using repository method
          await this._userRepositry.addToSavedServices(userId, serviceId);
      
          return { success: true, message: "Service saved successfully" };
        } catch (error) {
          const err= error as Error
          console.error("Error saving service:", err);
          return { success: false, message: err.message||"Failed to save service" };
        }
      }
      async unsaveService(userId: string, serviceId: string): Promise<{ success: boolean; message: string }> {
        try {
          const user = await this._userRepositry.findById(userId);
          if (!user) {
            return { success: false, message: "User not found" };
          }
          const service = await this._serviceRepository.getServiceById(serviceId);
          if (!service) {
            return { success: false, message: "Service not found" };
          }
          await this._userRepositry.removeFromSavedServices(userId, serviceId);
      
          return { success: true, message: "Service unsaved successfully" };
        } catch (error) {
          const err= error as Error
          console.error("Error unsaving service:", err);
          return { success: false, message:err.message|| "Failed to unsave service" };
        }
      }
      async getSavedServices(userId: string): Promise<{ success: boolean;  message: string,services?: any[]; }> {
        try {
          const user = await this._userRepositry.findUserWithSavedServices(userId);
          if (!user) {
            return { success: false, message: "User not found" };
          }
          return { success: true,message:"saved survice get in success", services: user.savedServices };
        } catch (error) {
          const err= error as Error
          console.error("Error fetching saved services:", err);
          return { success: false, message: err.message||"Failed to fetch saved services" };
        }
      }
}
