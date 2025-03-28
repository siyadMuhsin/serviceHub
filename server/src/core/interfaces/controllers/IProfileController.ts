import { Request,Response } from "express";
import { AuthRequest } from "../../../types/User";
export interface IProfileController{
    add_location(req:AuthRequest,res:Response):Promise<void>;
}