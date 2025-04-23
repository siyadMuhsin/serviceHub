import { Response,Request } from "express";
import { AuthRequest } from "../../../types/User";

export interface IReviewController{
    reviewSubmit(req:AuthRequest,res:Response):Promise<void>
    getReviewsForUser(req:AuthRequest,res:Response):Promise<void>
    getReviewsForExpert(req:AuthRequest,res:Response):Promise<void>
    
}