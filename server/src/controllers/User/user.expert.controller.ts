import { Response } from "express";
import { IUserExpertController } from "../../core/interfaces/controllers/IUserExpertController";
import { AuthRequest } from "../../types/User";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserExpertService } from "../../core/interfaces/services/IUserExpertService";
import mongoose from "mongoose";
import { HttpStatus } from "../../types/httpStatus";
import logger from "../../config/logger";

@injectable()
export class UserExpertController implements IUserExpertController {
  constructor(
    @inject(TYPES.UserExpertService) private _userExpertService: IUserExpertService
  ) {}
  async getExpertSpecificService(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user.userId;
      const { serviceId } = req.params;
      const check = mongoose.Types.ObjectId.isValid;
      if (!check(userId) || !check(serviceId)) {
        this.sendResponse(res,{ message: "The userId or ServiceId not valid" },HttpStatus.BAD_REQUEST);
        return;
      }
      const response= await this._userExpertService.getExpertsByService(serviceId,userId)
      this.sendResponse(res,response,response.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
    
    } catch (error) {
      const err= error as Error
        this.sendResponse(res,err,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async getExpertDetails(req: AuthRequest, res: Response): Promise<void> {
      try {
        const {expertId}=req.params
        const userId=req.user.userId
        const check = mongoose.Types.ObjectId.isValid;
        if (!check(userId) || !check(expertId)) {
          this.sendResponse(res,{ message: "The userId or ServiceId not valid" },HttpStatus.BAD_REQUEST);
          return;
        }
        const response= await this._userExpertService.getExpertDetails(userId,expertId)
        this.sendResponse(res,response,response.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
      } catch (error) {
        const err= error as Error
        logger.error(err)
        this.sendResponse(res,error,HttpStatus.INTERNAL_SERVER_ERROR)
      }
  } 
  private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }
}
