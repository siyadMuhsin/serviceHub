import { inject, injectable } from "inversify";
import { IReviewController } from "../core/interfaces/controllers/IReviewController";
import { TYPES } from "../di/types";
import { IReviewService } from "../core/interfaces/services/IReviewService";
import { Request, Response } from "express";
import { AuthRequest, AuthResult } from "../types/User";
import { HttpStatus } from "../types/httpStatus";
@injectable()
export class ReviewController implements IReviewController{
constructor(
    @inject(TYPES.ReviewService) private reviewService:IReviewService
){}

async reviewSubmit(req: AuthRequest, res: Response): Promise<void> {
    try {
        const {rating,reviewText,expertId}=req.body
        const userId= req.user.userId
        // Validate required fields
        if(typeof reviewText =='string' && !reviewText.trim()){

              this.sendResponse(res,{success:false,message:"Review Content is requered"},HttpStatus.BAD_REQUEST)
    return
        }
  if (!rating || !reviewText || !expertId || !userId) {
    this.sendResponse(res,{success:false,message:"Missing required Field"},HttpStatus.BAD_REQUEST)
    return
  }
        const result = await this.reviewService.submitReview(rating,reviewText,expertId,userId)
        this.sendResponse(res,result,result.success?HttpStatus.CREATED:HttpStatus.BAD_REQUEST)
    } catch (error) {
this.sendResponse(res,{success:false,message:"Internal server Error"},HttpStatus.INTERNAL_SERVER_ERROR)
        
    }
    
}
async getReviewsForUser(req: AuthRequest, res: Response): Promise<void> {
    try {
        const page=parseInt(req.query.page as string)||1
        const limit= parseInt(req.query.limit as string) || 5
        const {expertId}= req.params
        const userId= req.user?.userId
        if(!userId || !expertId){
            this.sendResponse(res,{success:false,message:"ExpertId Not valid"},HttpStatus.BAD_REQUEST)
    return
        }
        const result= await this.reviewService.getReviewsToUser(expertId,page,limit)
        this.sendResponse(res,result,result.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
    } catch (error) {
this.sendResponse(res,{success:false,message:"Internal server Error"},HttpStatus.INTERNAL_SERVER_ERROR)
        
    }
}

async getReviewsForExpert(req: AuthRequest, res: Response): Promise<void> {
    try {
        const expertId= req.expert?.expertId
        const page=parseInt(req.query.page as string)||1
        const limit= parseInt(req.query.limit as string) || 5
        const result= await this.reviewService.getReviewsToUser(expertId,page,limit)
        this.sendResponse(res,result,result.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
    } catch (error) {
        this.sendResponse(res,{success:false,message:"Internal server Error"},HttpStatus.INTERNAL_SERVER_ERROR)  
    }
}
 private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }

}