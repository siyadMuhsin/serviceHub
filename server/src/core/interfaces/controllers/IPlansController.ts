import { Request,Response } from "express"
import { AuthRequest } from "../../../types/User"
export interface IPlansController {
  createPlan(req: AuthRequest, res: Response): Promise<void>;
  listAndUnlist(req: Request, res: Response): Promise<void>;
  updatePlan(req: Request, res: Response): Promise<void>;
  getAllPlans(req: Request, res: Response): Promise<void>;
  getAvailablePlans(req:Request,res:Response):Promise<void>;
}