import { inject, injectable } from "inversify";
import { IProfileController } from "../../core/interfaces/controllers/IProfileController";
import { Response } from "express";
import { AuthRequest } from "../../types/User";
import { HttpStatus } from "../../types/httpStatus";
import { TYPES } from "../../di/types";
import { IProfileService } from "../../core/interfaces/services/IProfileService";
@injectable()
export class ProfileController implements IProfileController {
    constructor(
           @inject(TYPES.ProfileService) private profileService: IProfileService
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
    
          const response = await this.profileService.addLocation(userId, lat, lng);
          
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
          console.error("Error in add_location:", error);
          this.sendResponse(
            res,
            { success: false, message: "Internal server error" },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
    }

    async getExistingExpert (req:AuthRequest,res:Response):Promise<void>{
      try {
        const userId= req?.user?.userId
       
        const response = await this.profileService.getExpertData(userId)
        if(!response.success){
          this.sendResponse(res,{response},HttpStatus.BAD_REQUEST)
        }
        this.sendResponse(res,response, HttpStatus.OK)
      } catch (error) {
        this.sendResponse(res,{successs:false,message:'internal server error'},HttpStatus.INTERNAL_SERVER_ERROR)
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
        const response= await this.profileService.profileImageUpload(userId,image)
        if(response.success){
          this.sendResponse(res,response,HttpStatus.OK)
          return
        }
        this.sendResponse(res,response,HttpStatus.BAD_REQUEST)
        return
      } catch (error:any) {
        this.sendResponse(res,error.message|| 'Internal servere error',HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
    async profileUpdate(req:AuthRequest,res:Response){
      try {
        const userId= req.user.userId      
        for (let [key, value] of Object.entries(req.body)) {
          if (typeof value === 'string' && !value.trim()) {
            return this.sendResponse(res, { success: false, message: `${key} cannot be empty` }, HttpStatus.BAD_REQUEST);
          }
        }
        const response= await this.profileService.profileUpdate(userId,req.body)
        if(response.success){
          this.sendResponse(res,response,HttpStatus.OK)
          return;
        }
        this.sendResponse(res,response,HttpStatus.BAD_REQUEST)
      } catch (error:any) {
        this.sendResponse(res,error.message||'internl server error' ,HttpStatus.INTERNAL_SERVER_ERROR)
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
        const response= await this.profileService.changePassword(userId,currentPassword,newPassword)
        this.sendResponse(res,response,response.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
      } catch (error:any) {
        this.sendResponse(res,error.message|| "Internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
      }

    }
  private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }
}
