import { Response } from "express";
import { AuthRequest } from "../../types/User";
import { inject, injectable } from "inversify";
import { IUserService } from "../../core/interfaces/services/IUserService";
import { TYPES } from "../../di/types";
import { IExpertService } from "../../core/interfaces/services/IExpertService";

import { IPaymentService } from "../../core/interfaces/services/IPaymentService";
import { IDashboardController } from "../../core/interfaces/controllers/IDashboardController";
import { HttpStatus } from "../../types/httpStatus";

@injectable()
export class DashboardController implements IDashboardController{
    constructor(
        @inject(TYPES.UserService) private _userService:IUserService,
        @inject(TYPES.ExpertService) private _expertService:IExpertService,
        @inject(TYPES.PaymentService) private _paymentServie:IPaymentService
    ){}
    async getDashboardStats(req:AuthRequest,res:Response):Promise<void>{
        try {
            const {totalUsers}=await this._userService.getTotalUserCount()
            const {totalExperts}=await this._expertService.getTotalExpertCount()
            const {data} = await this._paymentServie.getAllEarnings("",1,3)
            res.status(HttpStatus.OK).json({data:{
                totalExperts,
                totalUsers,
                adminEarnings:data.totalEarnings
            }})
        } catch (error) {
            const err= error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:err.message||"Internal server error"})
        }

    }

}