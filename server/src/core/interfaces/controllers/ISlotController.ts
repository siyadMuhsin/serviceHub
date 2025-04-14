import { Response,Request } from "express";
import { AuthRequest } from "../../../types/User";

export interface ISlotController{
    addExpertSlot(req:AuthRequest,res:Response):Promise<void>
    getSlotsToExpert(req:AuthRequest,res:Response):Promise<void>
    deleteSlot(req:AuthRequest,res:Response):Promise<void>
    getSlotToUser(req:Request,res:Response):Promise<void>
    
}