import Expert from "../../models/expert.model";
import { IExpert } from "../../types/Expert";
import cloudinary from "../../config/cloudinary";
import ExpertRepository from "../../repositories/Expert/Expert.respository";
import UserRepository from "../../repositories/UserRepository";
import { sendExpertStatusUpdate } from "../../utils/emailService";
import exp from "constants";
import { ObjectId } from "mongodb";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
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
            
           const response= await ExpertRepository.createExpert({ ...data, certificateUrl: url, },userId);
             await UserRepository.findByIdAndUpdate(userId,{expertStatus:"pending"})
             return response
        } catch (error: any) {
            console.log(error);
            throw new Error(`Error in ExpertService: ${error.message}`);
        }
    }
    
    
    async getExperts(): Promise<IExpert[]> {
        return await ExpertRepository.getExperts();
    }
    async getExpertBy_limit(page: number, limit: number,filter:string,search:string) {
        try {
            const query: any = {};
            if (filter && filter !== 'all') {
                query.status = filter;
            }
            if(search){   
            query.accountName= { $regex: search, $options: "i" } 
            }
            const { experts, totalRecords } = await ExpertRepository.getExpertBy_limit(page, limit,query);
            const totalPages = Math.ceil(totalRecords / limit);
            return { 
                success: true, 
                experts, 
                totalRecords, 
                totalPages 
            };
        } catch (error) {
            console.error('Error fetching experts:', error);
            return { success: false, message: 'Failed to fetch experts.' };
        }
    }
    async actionChange (id:string,action:string){
        try {
            const existingExpert = await ExpertRepository.findById(id);
            if (!existingExpert) {
                return { success: false, message: 'Expert does not exist' };
            }
            
            const updatedExpert = await ExpertRepository.findByIdAndUpdate(id, { status: action });
            if (!updatedExpert) {
                return { success: false, message: 'Failed to update expert status' };
            }
          
                const userId: string = updatedExpert.userId.toString()
                await UserRepository.findByIdAndUpdate(userId,{role:'expert',expertStatus:action==="approved"?"approved":"rejected"})
                await sendExpertStatusUpdate(existingExpert.userId.email, action);
            return { success: true, data: updatedExpert };
        } catch (error) {
            console.error('Error in actionChange:', error);
            throw new Error('Error updating expert status');
        }

    }
    async block_unblock(id:string,active:boolean){
        try {
            console.log(id)
            const expert= await ExpertRepository.findById(id)
            if (!expert) {
                return { success: false, message: 'Expert does not exist' };
            }
            const query:any={}
            query.isActive=!active
            const updatedExpert = await ExpertRepository.findByIdAndUpdate(id, query);
            if (!updatedExpert) {
                return { success: false, message: 'Failed to update expert status' };
            }
            return { success: true, message: `Expert ${active ? 'unblocked' : 'blocked'} successfully`, data: updatedExpert };
        } catch (error) {
            console.error('Error in block_unblock:', error);
            throw new Error('Error updating expert status');
        }
    }
    async getExpertData(id:string){
        try {
            const expert=await ExpertRepository.findById(id)
            console.log(expert)
            if(expert){
                return {success:true,expert}
            }
           
            return {success:false,message:"Expert not found"}
        } catch (error) {
            console.log(error)
            throw new Error('Error finding expert data');
        }
    }

    async switch_expert(userId:string){
        try {
            const expert = await ExpertRepository.findOne({ userId: userId });
            if (!expert) {
                return { success: false, message: "Cannot switch to expert account: User not found" };
            }
            if (expert.status !== 'approved') {
                return { success: false, message: "Your request has not been accepted" };
            }
            const accessToken = generateAccessToken(userId, 'expert', expert.id);
            const refreshToken = generateRefreshToken(userId, 'expert', expert.id);
            return { success: true, message: "Switched to expert account successfully",accessToken,refreshToken };
        } catch (error) {
            console.error("Error in switch_expert service:", error);
            throw error; // Propagate the error to the controller
        }

    }
}

export default new ExpertService();
