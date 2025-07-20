import { inject, injectable } from "inversify";
import { IProfileController } from "../../core/interfaces/controllers/IProfileController";
import { Response } from "express";
import { AuthRequest } from "../../types/User";
import { HttpStatus } from "../../types/httpStatus";
import { TYPES } from "../../di/types";
import { IProfileService } from "../../core/interfaces/services/IProfileService";
import logger from "../../config/logger";
@injectable()
export class ProfileController implements IProfileController {
    constructor(
           @inject(TYPES.ProfileService) private _profileService: IProfileService
       ) {}
       async add_location(req: AuthRequest, res: Response): Promise<void> {
        try {
          const userId = req?.user?.userId;
          if (!userId) {
            return this.sendResponse(
              res,
              { success: false, message: "User not found" },
              HttpStatus.BAD_REQUEST
            );
          }
          const { location, lat, lng } = req.body;
          if (!lat || !lng) {
            return this.sendResponse(
              res,
              { success: false, message: "Latitude or longitude is missing!" },
              HttpStatus.BAD_REQUEST
            );
          }
          const response = await this._profileService.addLocation(userId, lat, lng);
          if (!response.success) {
            return this.sendResponse(
              res,
              { success: false, message: response.message || "Failed to add location" },
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          }
          this.sendResponse(
            res,
            { success: true, message: "Location added successfully" },
            HttpStatus.OK
          );
        } catch (error) {
          const err= error as Error
          logger.error("Error in add_location:", err);
          this.sendResponse(
            res,
            { success: false, message:err.message|| "Internal server error" },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
    }
    async getExistingExpert (req:AuthRequest,res:Response):Promise<void>{
      try {
        const userId= req?.user?.userId
       
        const response = await this._profileService.getExpertData(userId)
        if(!response.success){
          this.sendResponse(res,{response},HttpStatus.BAD_REQUEST)
        }
        this.sendResponse(res,response, HttpStatus.OK)
      } catch (error) {
        const err= error as Error
        this.sendResponse(res,{successs:false,message:err.message||'internal server error'},HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
    async profileImageUpload(req:AuthRequest,res:Response){
      const image= req.file
      try {
        if(!image){
          this.sendResponse(res,{success:false,message:'image not fount'},HttpStatus.BAD_REQUEST)
          return
        }
        const userId= req?.user?.userId
        const response= await this._profileService.profileImageUpload(userId,image)
        if(response.success){
          this.sendResponse(res,response,HttpStatus.OK)
          return
        }
        this.sendResponse(res,response,HttpStatus.BAD_REQUEST)
        return
      } catch (error) {
        const err= error as Error
        this.sendResponse(res,err.message|| 'Internal servere error',HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
    async profileUpdate(req:AuthRequest,res:Response){
      try {
        const userId= req.user.userId      
        for (let [key, value] of Object.entries(req.body)) {
          if (typeof value === 'string' && !value.trim()) {
            return this.sendResponse(res, { success: false, message: `${key} cannot be empty` }, HttpStatus.BAD_REQUEST);
          }
          if (key === 'phone' && typeof value==='string') {
            if (!/^\d{10}$/.test(value)) {
              return this.sendResponse(
                res,
                { success: false, message: `Phone number must be exactly 10 digits` },
                HttpStatus.BAD_REQUEST
              );
            }
          }
      
        }
        const response= await this._profileService.profileUpdate(userId,req.body)
        if(response.success){
          this.sendResponse(res,response,HttpStatus.OK)
          return;
        }
        this.sendResponse(res,response,HttpStatus.BAD_REQUEST)
      } catch (error) {
        const err= error as Error
        this.sendResponse(res,err.message||'internl server error' ,HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
    async changePassword(req:AuthRequest,res:Response):Promise<void>{
      try {
        const userId= req.user.userId
        const {currentPassword,newPassword}= req.body
        if(!currentPassword || !newPassword){
          this.sendResponse(res,{success:false,message:'Missing password'},HttpStatus.BAD_REQUEST)
          return;
        }
        const response= await this._profileService.changePassword(userId,currentPassword,newPassword)
        this.sendResponse(res,response,response.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
      } catch (error) {
        const err= error as Error
        this.sendResponse(res,err.message|| "Internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
async saveService(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId= req?.user?.userId
    const {serviceId}=req.params
    if(!serviceId){
      this.sendResponse(res,{message:"ServiceId is required"},HttpStatus.BAD_REQUEST)
      return
    }
    const result= await this._profileService.saveService(userId,serviceId)
    this.sendResponse(res,result,result.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
  } catch (error) {
    const err= error as Error
    this.sendResponse(res,{message:err.message || "Internal server error"},HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
async unsaveService(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId= req?.user?.userId
    const {serviceId}=req.params
    if(!serviceId){
      this.sendResponse(res,{message:"ServiceId is required"},HttpStatus.BAD_REQUEST)
      return
    }
    const result= await this._profileService.unsaveService(userId,serviceId)
    this.sendResponse(res,result,result.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
  } catch (error) {
const err= error as Error
    this.sendResponse(res,{message:err.message ||"Internal server error"},HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

async getSavedServices(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req?.user?.userId;
    const result = await this._profileService.getSavedServices(userId);
    this.sendResponse(res, result, result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
  } catch (error) {
    const err= error as Error
    this.sendResponse(res, { message:err.message|| "Internal server error" }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
    
  private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }
}
