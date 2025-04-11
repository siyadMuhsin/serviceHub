import { Response } from "express";
import { IBookingController } from "../core/interfaces/controllers/IBookingController";
import { AuthRequest } from "../types/User";

export class BookingController implements IBookingController{
    async bookingCreate(req: AuthRequest, res: Response): Promise<void> {
        const {
            expertId,
            serviceId,
            date,
            timeSlot,
            userLocation,
            notes,
          } = req.body;
      console.log(req.body)
          const userId = req.user?.userId; // Assume JWT middleware assigns user info
      
          if (!expertId || !date || !timeSlot) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return
          }
    }

}