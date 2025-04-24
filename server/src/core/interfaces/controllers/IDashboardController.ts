import { Response } from "express";
import { AuthRequest } from "../../../types/User";

export interface IDashboardController{
    getDashboardStats (req:AuthRequest,res:Response):Promise<void>
}