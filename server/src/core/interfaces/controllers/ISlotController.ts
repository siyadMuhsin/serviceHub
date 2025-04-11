import { Response } from "express";
import { AuthRequest } from "../../../types/User";

export interface ISlotController{
    addExpertSlot(req:AuthRequest,res:Response):Promise<void>
}