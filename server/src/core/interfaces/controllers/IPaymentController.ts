import { AuthRequest } from "../../../types/User";
import { Response } from "express";
export interface IPaymentController{
    planPurchase(req:AuthRequest,res:Response):Promise<void>;
    verifyPayment(req:AuthRequest,res:Response):Promise<void>
}