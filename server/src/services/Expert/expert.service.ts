import Expert from "../../models/expert.model";
import { IExpert } from "../../types/Expert";
import cloudinary from "../../config/cloudinary";
import ExpertRepository from "../../repositories/Expert/Expert.respository";
import UserRepository from "../../repositories/UserRepository";

class ExpertService {
    async createExpert(data: Partial<IExpert>, file: Express.Multer.File,userId:string): Promise<IExpert> {
      
        try {
           
            // Wrap Cloudinary upload_stream in a Promise
            const result: any = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "experts_certificates",
                        resource_type: "auto",
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Upload Error:", error);
                            reject(new Error("Failed to upload to Cloudinary"));
                        } else {
                           
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(file.buffer);
            });
            if (!result || !result.secure_url) {
                throw new Error("Cloudinary upload failed");
            }
            // Create expert with Cloudinary URL
            const url = result.secure_url;
            
           const response= await ExpertRepository.createExpert({ ...data, certificateUrl: url },userId);
             await UserRepository.findByIdAndUpdate(userId,{role:"expert"})
             return response
        } catch (error: any) {
            console.log(error);
            throw new Error(`Error in ExpertService: ${error.message}`);
        }
    }
    
    
    async getExperts(): Promise<IExpert[]> {
        return await ExpertRepository.getExperts();
    }
}

export default new ExpertService();
