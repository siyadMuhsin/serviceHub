import { Request,Response } from "express";
import { AuthRequest } from "../../../types/User";
export interface IProfileController{
    add_location(req:AuthRequest,res:Response):Promise<void>;
    getExistingExpert(req:AuthRequest,res:Response):Promise<void>;
    profileImageUpload(req:AuthRequest,res:Response):Promise<void>;
    profileUpdate(req:AuthRequest,res:Response):Promise<void>;
    changePassword(req:AuthRequest,res:Response):Promise<void>;
}