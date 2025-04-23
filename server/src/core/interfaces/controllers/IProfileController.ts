import { Request,Response } from "express";
import { AuthRequest } from "../../../types/User";
import { Auth } from "mongodb";
export interface IProfileController{
    add_location(req:AuthRequest,res:Response):Promise<void>;
    getExistingExpert(req:AuthRequest,res:Response):Promise<void>;
    profileImageUpload(req:AuthRequest,res:Response):Promise<void>;
    profileUpdate(req:AuthRequest,res:Response):Promise<void>;
    changePassword(req:AuthRequest,res:Response):Promise<void>;
    saveService(req:AuthRequest,res:Response):Promise<void>;
    unsaveService(req:AuthRequest,res:Response):Promise<void>;
    getSavedServices(req:AuthRequest,res:Response):Promise<void>;
}