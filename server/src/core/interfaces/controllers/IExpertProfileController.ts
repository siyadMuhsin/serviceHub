    import {  Response } from "express";
import { AuthRequest } from "../../../types/User";
export interface IExpertProfileController {
    get_expertData(req: AuthRequest, res: Response): Promise<void>;
    updateLocation(req:AuthRequest,res:Response):Promise<void>;
    imagesUpload(req:AuthRequest,res:Response):Promise<void>;
    deleteImage(req:AuthRequest,res:Response):Promise<void>

}