import { inject, injectable } from 'inversify';
import { IExpertRepository } from "../../core/interfaces/repositories/IExpertRepository";
import { IUserRepository } from "../../core/interfaces/repositories/IUserRepository";
import { IExpertService } from "../../core/interfaces/services/IExpertService";
import { IExpert } from "../../types/Expert";
import cloudinary from "../../config/cloudinary";
import { sendExpertStatusUpdate } from "../../utils/emailService";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { TYPES } from "../../di/types";
import logger from '../../config/logger';

@injectable()
export class ExpertService implements IExpertService {
    constructor(
        @inject(TYPES.ExpertRepository) private _expertRepository: IExpertRepository,
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository
    ) {}

    async createExpert(data: Partial<IExpert>, file: Express.Multer.File, userId: string): Promise<IExpert |null> {
        const existingName = await this._expertRepository.findOne({ accountName: data.accountName });
        if (existingName && existingName.userId._id.toString() !== userId) {
            throw new Error("The Account Name is already used by another expert");
        }
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (user.expertStatus === 'rejected') {
            await this._userRepository.updateById(userId, { 
                expertStatus: 'pending',
            });
        }
        const result: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "experts_certificates",
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) {
                        logger.error("Cloudinary Upload Error:", error);
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
        const url = result.secure_url;
        let response;
        const existingExpert = await this._expertRepository.findOne({ userId: userId });
        if (existingExpert) {
            response = await this._expertRepository.findByIdAndUpdate(
                existingExpert._id,
                { 
                    ...data, 
                    certificateUrl: url,
                    status: 'pending'
                }
            );
        } else {
            response = await this._expertRepository.createExpert({ 
                ...data, 
                certificateUrl: url,
                status: 'pending'
            }, userId);
        }
        await this._userRepository.updateById(userId, { 
            expertStatus: "pending",
        });
        return response;
    }
    async getExperts(): Promise<IExpert[]> {
        return await this._expertRepository.getExperts();
    }
    async getExpertBy_limit(page: number, limit: number, filter: string, search: string) {
        try {
            const query: any = {};
            if (filter && filter !== 'all') {
                query.status = filter;
            }
            if (search) {   
                query.accountName = { $regex: search, $options: "i" };
            }
            const { experts, totalRecords } = await this._expertRepository.getExpertBy_limit(page, limit, query);
            const totalPages = Math.ceil(totalRecords / limit);
            return { 
                success: true, 
                experts, 
                totalRecords, 
                totalPages 
            };
        } catch (error) {
            const err= error as Error
            logger.error('Error fetching experts:', err);
            return { success: false, message: err.message||'Failed to fetch experts.' };
        }
    }

     async checkBlocked(id: string):Promise<boolean|{success:boolean,message:string}> {
        try {
            const expert = await this._expertRepository.findById(id);
            
            return expert?.isBlocked ?true:false;
        } catch (error) {
            const err= error as Error
            logger.error("Error checking user block status:", err);
            return { 
                success: false, 
                message:err.message||"Failed to check user status" 
            };
        }
    }
    async actionChange(id: string, action: string,reason?:string) {
        try {
            const existingExpert = await this._expertRepository.findById(id);
            if (!existingExpert) {
                return { success: false, message: 'Expert does not exist' };
            }
            
            const updatedExpert = await this._expertRepository.findByIdAndUpdate(id, { status: action });
            if (!updatedExpert) {
                return { success: false, message: 'Failed to update expert status' };
            }
          
            const userId: string = updatedExpert.userId.toString();
            await this._userRepository.updateById(userId, {
                role: action === 'approved' ? 'expert' : 'user',
                expertStatus: action === "approved" ? "approved" : "rejected",
                rejectReason:action==='rejected'?reason:undefined
            });

            await sendExpertStatusUpdate(existingExpert.userId.email, action,reason);
            return { success: true, data: updatedExpert };
        } catch (error) {
            const err= error as Error
            logger.error('Error in actionChange:', err);
            throw new Error(err.message||'Error updating expert status');
        }
    }

    async block_unblock(id: string, active: boolean) {
        try {
            const expert = await this._expertRepository.findById(id);
            if (!expert) {
                return { success: false, message: 'Expert does not exist' };
            }
            const query: any = {};
            query.isBlocked = active;
            const updatedExpert = await this._expertRepository.findByIdAndUpdate(id, query);
            if (!updatedExpert) {
                return { success: false, message: 'Failed to update expert status' };
            }
            return { 
                success: true, 
                message: `Expert ${active ? 'unblocked' : 'blocked'} successfully`, 
                data: updatedExpert 
            };
        } catch (error) {
            const err= error as Error
            logger.error('Error in block_unblock:', err);
            throw new Error(err.message||'Error updating expert status');
        }
    }

    async getExpertData(id: string) {
        try {
            const expert = await this._expertRepository.findById(id);
            if (expert) {
                return { success: true, expert };
            }
            return { success: false, message: "Expert not found" };
        } catch (error) {
            const err= error as Error
            throw new Error(err.message||'Error finding expert data');
        }
    }

    async switch_expert(userId: string) {
        try {
            logger.info('switch to expert')
            const expert = await this._expertRepository.findOne({ userId: userId });
            if (!expert) {
                return { success: false, message: "Cannot switch to expert account: User not found" };
            }
            if (expert.status !== 'approved') {
                return { success: false, message: "Your request has not been accepted" };
            }
            if(expert.isBlocked){
                return {success:false,message:"Your Account has been blocked"}
            }
            const accessToken = generateAccessToken(userId, 'expert', expert.id);
            const refreshToken = generateRefreshToken(userId, 'expert', expert.id);
            return { 
                success: true, 
                message: "Switched to expert account successfully",
                accessToken,
                refreshToken 
            };
        } catch (error) {
            const err= error as Error
            logger.error("Error in switch_expert service:", err);
            throw err.message;
        }
    }

    async switch_user(expertId: string) {
        try {
            const expert = await this._expertRepository.findById(expertId);
            if (!expert) {
                return { success: false, message: "Cannot switch to expert account: User not found" };
            }

            const accessToken = generateAccessToken(expert.userId._id, 'user');
            const refreshToken = generateRefreshToken(expert.userId._id, 'user');
            
            return { 
                success: true, 
                message: "Switched to user account successfully",
                accessToken,
                refreshToken 
            };
        } catch (error) {
            const err= error as Error
            logger.error("Error in switch_user service:", err);
            throw err.message;
        }
    }
    async getTotalExpertCount(): Promise<{ totalExperts: number; }> {
        try {
            const total= await this._expertRepository.count({})
return {totalExperts:total}
        } catch (error) {
            const err= error as Error
            throw new Error(err.message)
        }
    }
}