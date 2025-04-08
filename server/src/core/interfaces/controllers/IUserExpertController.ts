import { AuthRequest } from "../../../types/User";
import { Response } from "express";
export interface IUserExpertController{
    getExpertSpecificService(req:AuthRequest,res:Response):Promise<void>;
    getExpertDetails(req:AuthRequest,res:Response):Promise<void>
}