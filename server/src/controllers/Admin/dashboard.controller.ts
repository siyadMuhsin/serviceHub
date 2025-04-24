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
        @inject(TYPES.UserService) private userService:IUserService,
        @inject(TYPES.ExpertService) private expertService:IExpertService,
        @inject(TYPES.PaymentService) private paymentServie:IPaymentService
    ){}
    async getDashboardStats(req:AuthRequest,res:Response):Promise<void>{
        try {
            const {totalUsers}=await this.userService.getTotalUserCount()
            const {totalExperts}=await this.expertService.getTotalExpertCount()
            const {data} = await this.paymentServie.getAllEarnings("",1,3)
            res.status(HttpStatus.OK).json({data:{
                totalExperts,
                totalUsers,
                adminEarnings:data.totalEarnings
            }})
        } catch (error) {
            
        }

    }

}