// controllers/PlansController.ts
import { inject, injectable } from "inversify";
import { IPlansController } from "../../core/interfaces/controllers/IPlansController";
import { TYPES } from "../../di/types";
import { IPlanService } from "../../core/interfaces/services/IPlansService";
import { Response ,Request} from "express";
import { AuthRequest } from "../../types/User";
import { HttpStatus } from "../../types/httpStatus";
import mongoose from "mongoose";

@injectable()
export class PlansController implements IPlansController {
  constructor(@inject(TYPES.PlansService) private planService: IPlanService) {}

  async createPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, durationMonths, price } = req.body;
      if (!name || !durationMonths || !price) {
        this.sendResponse(
          res,
          {
            success: false,
            message: "All fields are required",
          },
          HttpStatus.BAD_REQUEST
        );
        return;
      }

      if (durationMonths < 1) {
        this.sendResponse(
          res,
          {
            success: false,
            message: "Duration must be at least 1 month",
          },
          HttpStatus.BAD_REQUEST
        );
        return;
      }

      const response = await this.planService.createPlan({
        name,
        durationMonths,
        price,
      });

      this.sendResponse(res, response, HttpStatus.CREATED);
    } catch (error: any) {
      this.sendResponse(
        res,
        {
          success: false,
          message: error.message || "Failed to create plan",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

async listAndUnlist(req:Request,res:Response):Promise<void>{
    try {
        
      const {planId}= req.params
      
      if(!planId){
        this.sendResponse(res,{success:false,message:"plan Id not fount"},HttpStatus.BAD_REQUEST)
        return;
      }
      if(!mongoose.Types.ObjectId.isValid(planId)){
        this.sendResponse(res,{success:false,message:"Invalid Object Id"},HttpStatus.BAD_REQUEST)
        return
      }
      const response= await this.planService.listAndUnlist(planId)
        this.sendResponse(res,response,response.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
    } catch (error:any) {
       this.sendResponse(res,error.message || "Internel server error",HttpStatus.INTERNAL_SERVER_ERROR)
    }


}
  private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }
}
