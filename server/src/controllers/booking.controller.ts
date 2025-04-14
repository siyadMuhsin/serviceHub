import { Response } from "express";
import { IBookingController } from "../core/interfaces/controllers/IBookingController";
import { AuthRequest } from "../types/User";
import { inject, injectable } from "inversify";
import { IBookingService } from "../core/interfaces/services/IBookingService";
import { TYPES } from "../di/types";
import { HttpStatus } from "../types/httpStatus";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject(TYPES.BookingService) private bookingService: IBookingService
  ) {}
  async bookingCreate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        this.sendResponse(res, { 
          success: false, 
          message: "Authentication required" 
        }, HttpStatus.UNAUTHORIZED);
        return;
      }
      const { expertId, slotId, time, notes, location ,address} = req.body;
      const files = req.files as Express.Multer.File[];
  
      // Validate required fields
      if (!expertId || !slotId || !time || !notes ||!address) {
        this.sendResponse(res, { success: false, message: "All fields (expertId, slotId, time, notes) are required" }, HttpStatus.BAD_REQUEST);
        return;
      }
      console.log(address)
const coordinates=JSON.parse(location)
if(coordinates.length<0){
  this.sendResponse(res,{message:"invalid location"},HttpStatus.BAD_REQUEST)
  return
}
      // Create the booking using the service
      const result = await this.bookingService.createBooking(userId, expertId, slotId, time, notes, coordinates,address,files);
      if (!result.success) {
        this.sendResponse(res, result, HttpStatus.BAD_REQUEST);
        return;
      }
      
      this.sendResponse(res, result, HttpStatus.CREATED);
    } catch (error) {
      console.error("Error creating booking:", error);
      this.sendResponse(res, { success: false, message: "Internal server error" }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getBookingToExpert(req: AuthRequest, res: Response): Promise<void> {
    try {
      const expertId = req.expert.expertId;
      if (!expertId) {
        this.sendResponse(res, { message: "Expert Id not found" }, HttpStatus.BAD_REQUEST);
        return;
      }
  
      // Get query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
  
      const result = await this.bookingService.getBookingsToExpert(
        expertId, 
        page, 
        limit, 
        status
      );
      
      this.sendResponse(
        res,
        result,
        result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      this.sendResponse(
        res,
        { message: "Internal Server Error" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
  private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }
}