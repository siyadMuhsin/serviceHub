import { Response } from "express";
import { AuthRequest } from "../../../types/User";

export interface IBookingController{
    bookingCreate(req:AuthRequest,res:Response):Promise<void>
    getBookingToExpert(req:AuthRequest,res:Response):Promise<void>
    bookingStatusChange(req:AuthRequest,res:Response):Promise<void>
    getUserBooking(req:AuthRequest,res:Response):Promise<void>
    userCancelBooking(req:AuthRequest,res:Response):Promise<void>
}