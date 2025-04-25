import { inject, injectable } from 'inversify';
import { AuthRequest } from "../../types/User";
import { Response } from "express";
import { IExpertService } from "../../core/interfaces/services/IExpertService";
import { HttpStatus } from "../../types/httpStatus";
import { IExpertProfileController } from "../../core/interfaces/controllers/IExpertProfileController";
import { TYPES } from "../../di/types";
import { IExpertProfileService } from '../../core/interfaces/services/IExpertProfileService';

@injectable()
export class ExpertProfileController implements IExpertProfileController {
    constructor(
        @inject(TYPES.ExpertService) private expertService: IExpertService,
        @inject(TYPES.ExpertProfileService) private expertProfileService:IExpertProfileService
    ) {}

    async get_expertData(req: AuthRequest, res: Response): Promise<void> {
        try {
            const expertId = req.expert?.expertId; 
            if (!expertId) {
                this._sendErrorResponse(res, 'Expert ID is missing', HttpStatus.BAD_REQUEST);
                return;
            }

            const response = await this.expertService.getExpertData(expertId);
            this._sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            console.error('Error fetching expert data:', error);
            this._sendErrorResponse(res, 'Internal server error');
        }
    }

    async updateLocation(req: AuthRequest, res: Response): Promise<void> {
        try {
            console.log('update expert profile')
            const expertId=req.expert.expertId
            const {lat,lng}= req.body.data
            if (!lat || !lng) {
                return this._sendResponse(
                  res,
                  { success: false, message: "Latitude or longitude is missing!" },
                  HttpStatus.BAD_REQUEST
                );
              }
            const response= await this.expertProfileService.updateExpertLocation({lat,lng},expertId)
            this._sendResponse(res,response,response.success?HttpStatus.CREATED:HttpStatus.BAD_REQUEST)
        } catch (error) {
            this._sendErrorResponse(res,'Ineternal server error')
        }
    }
    
async imagesUpload(req: AuthRequest, res: Response): Promise<void> {
    try {
        const expertId= req.expert.expertId
        
        const file= req.file
        if(!expertId)return;
        if(!file){
            this._sendResponse(res,{message:"Image file not exists"},HttpStatus.BAD_REQUEST)
            return
        }

        const response= await this.expertProfileService.uploadImage(expertId,file)
    this._sendResponse(res,response,response.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
    } catch (error:any) {
        this._sendErrorResponse(res,error.message)
    }
}

async deleteImage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const expertId = req.expert.expertId;
      const { imageUrl } = req.body;
  
      if (!imageUrl || !expertId) {
        this._sendResponse(res, { message: "Image URL or Expert ID missing" }, HttpStatus.BAD_REQUEST);
        return;
      }
  
      const response = await this.expertProfileService.deleteImageFromGallery(expertId, imageUrl);
      this._sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    } catch (error: any) {
      this._sendErrorResponse(res, error.message);
    }
  }
  
    private _sendResponse(res: Response, data: any, status: HttpStatus): void {
        res.status(status).json(data);
    }

    private _sendErrorResponse(res: Response, message: string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR): void {
        res.status(status).json({ 
            success: false, 
            message 
        });
    }
}