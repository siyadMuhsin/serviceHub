import { Response } from "express";
import { AuthRequest } from "../../../types/User";

export interface IBookingController{
    bookingCreate(req:AuthRequest,res:Response):Promise<void>

}