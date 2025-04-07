import { inject, injectable } from "inversify";
import { IExpertProfileService } from "../../core/interfaces/services/IExpertProfileService";
import { TYPES } from "../../di/types";
import { IExpertRepository } from "../../core/interfaces/repositories/IExpertRepository";
import { CloudinaryService } from "../../config/cloudinary";
import { extractPublicId } from "../../utils/extraFunctions";
@injectable()
export class ExpertProfileService implements IExpertProfileService{
    constructor(
        @inject(TYPES.ExpertRepository) private expertRepository:IExpertRepository
    ){}
    async updateExpertLocation(location: { lat: number; lng: number; }, expertId: string){
        try {
            const updateExpert= await this.expertRepository.findByIdAndUpdate(expertId,{location:location})
            if(!updateExpert){
                return {success:false,message:"Location updation failed"}
            }
            return {success:true ,message:"Location Updated SuccessFully"}
        } catch (error:any) {
            throw new Error (error.message || "Error in updateLocation")
            
        }
    }
    async uploadImage(experId: string, file: Express.Multer.File) {
        try {
            const existingExpert= await this.expertRepository.findById(experId)
            if(!existingExpert){
                return {success:false,message:"ExpertId not match"}
            }
            const imageUrl=await CloudinaryService.uploadImage(file)
            if(!imageUrl){
                return {success:false,message:"Cloudnary upload failed"}
            }
            await this.expertRepository.pushToField(experId,"gallery",imageUrl)
            
            return {success:true,message:'Image uploaded successfully',imageUrl:imageUrl}
        } catch (error:any) {
            throw new Error(error)
        }
    }

    async deleteImageFromGallery(expertId: string, imageUrl: string) {
        try {
        const expert = await this.expertRepository.findById(expertId);
        if (!expert) {
          return { success: false, message: "Expert not found" };
        }
      
        if(!expert.gallery){
            return {success:false,message:"Your Gallary is Empty"}
        }
        const isInGallery = expert.gallery.includes(imageUrl);
        if (!isInGallery) {
          return { success: false, message: "Image not found in gallery" };
        }
        await this.expertRepository.pullFromField(expertId, "gallery", imageUrl);
      const public_Id=extractPublicId(imageUrl)
        await CloudinaryService.deleteImage(public_Id)
        return { success: true, message: "Image deleted from gallery" };
    } catch (error:any) {
     throw new Error(error.message)       
    }
      }
      

}