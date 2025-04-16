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
  async getAllEarnings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plan = req.query.plan as string || '';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.paymentService.getAllEarnings(plan, page, limit);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }
}