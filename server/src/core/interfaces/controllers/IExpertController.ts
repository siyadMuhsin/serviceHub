import { Request, Response } from "express";
import { AuthRequest } from "../../../types/User";

export interface IExpertController {
    createExpert(req: Request, res: Response): Promise<void>;
    getExperts(req: Request, res: Response): Promise<void>;
    actionChange(req: Request, res: Response): Promise<void>;
    blockAndUnlockExpert(req: Request, res: Response): Promise<void>;
    getExpertData(req: Request, res: Response): Promise<void>;
    switch_expert(req: Request, res: Response): Promise<void>;
    switch_user(req: Request, res: Response): Promise<void>;
    getLatestExperts(req:AuthRequest,res:Response):Promise<void>
}