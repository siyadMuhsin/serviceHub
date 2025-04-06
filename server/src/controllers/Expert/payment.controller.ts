import { inject, injectable } from "inversify";
import { IPaymentController } from "../../core/interfaces/controllers/IPaymentController";
import { TYPES } from "../../di/types";
import { IPaymentService } from "../../core/interfaces/services/IPaymentService";
import { Response } from "express";
import { AuthRequest } from "../../types/User";
import { HttpStatus } from "../../types/httpStatus";
import { ReturnDocument } from "mongodb";

@injectable()
export class PaymentController implements IPaymentController{
    constructor(
        @inject(TYPES.PaymentService) private paymentService:IPaymentService
    ){}
async planPurchase(req: AuthRequest, res: Response): Promise<void> {
    try {
        const {planId}=req.params
        const expertId= req.expert.expertId
        if(!planId){
            this.sendResponse(res,{message:"The planId is Missing"},HttpStatus.BAD_REQUEST)
        return; 
        }
        const response= await this.paymentService.planPurchase(expertId,planId)
        if (!response.success) {
            this.sendResponse(res, { message: response.message }, HttpStatus.BAD_REQUEST);
            return;
        }

        this.sendResponse(res, {
            clientSecret: response.clientSecret,
            message: "Payment intent created successfully"
        }, HttpStatus.OK);
    } catch (error) {
        this.sendResponse(res, { 
            message: "Failed to process subscription" 
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


async verifyPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { paymentIntentId, planId } = req.body;
      const expertId = req.expert.expertId;
  
      if (!paymentIntentId || !planId) {
        this.sendResponse(
          res,
          { message: "Missing paymentIntentId or planId" },
          HttpStatus.BAD_REQUEST
        );
        return;
      }
  
      const response = await this.paymentService.paymentVerify(expertId, paymentIntentId, planId);
  
      if (!response.success) {
        this.sendResponse(res, response, HttpStatus.BAD_REQUEST);
        return;
      }
  
      this.sendResponse(res, response, HttpStatus.OK);
    } catch (error) {
      console.error(error);
      this.sendResponse(res, { message: "Server error" }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }
}