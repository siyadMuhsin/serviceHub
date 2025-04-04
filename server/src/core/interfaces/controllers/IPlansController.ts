import { Request,Response } from "express"
import { AuthRequest } from "../../../types/User"
export interface IPlansController{
    createPlan(req:AuthRequest,res:Response):Promise<void>;
    listAndUnlist(req:Request,res:Response):Promise<void>;
}