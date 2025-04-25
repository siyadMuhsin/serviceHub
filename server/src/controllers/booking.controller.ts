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
        this._sendResponse(res, { 
          success: false, 
          message: "Authentication required" 
        }, HttpStatus.UNAUTHORIZED);
        return;
      }
      const { expertId, slotId, time, notes, location ,address} = req.body;
      const files = req.files as Express.Multer.File[];
  
      // Validate required fields
      if (!expertId || !slotId || !time || !notes ||!address) {
        this._sendResponse(res, { success: false, message: "All fields (expertId, slotId, time, notes) are required" }, HttpStatus.BAD_REQUEST);
        return;
      }
const coordinates=JSON.parse(location)
if(coordinates.length<0){
  this._sendResponse(res,{message:"invalid location"},HttpStatus.BAD_REQUEST)
  return
}
      // Create the booking using the service
      const result = await this.bookingService.createBooking(userId, expertId, slotId, time, notes, coordinates,address,files);
      if (!result.success) {
        this._sendResponse(res, result, HttpStatus.BAD_REQUEST);
        return;
      }
      
      this._sendResponse(res, result, HttpStatus.CREATED);
    } catch (error) {
      console.error("Error creating booking:", error);
      this._sendResponse(res, { success: false, message: "Internal server error" }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getBookingToExpert(req: AuthRequest, res: Response): Promise<void> {
    try {
      const expertId = req.expert.expertId;
      if (!expertId) {
        this._sendResponse(res, { message: "Expert Id not found" }, HttpStatus.BAD_REQUEST);
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
      this._sendResponse(
        res,
        result,
        result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      this._sendResponse(
        res,
        { message: "Internal Server Error" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getAllBookingsCount(req:AuthRequest,res:Response):Promise<void>{
    try {
      const expertId=req.expert.expertId
      const result=await this.bookingService.allBookings(expertId)
      this._sendResponse(res,result,HttpStatus.OK)
    } catch (error) {
      this._sendResponse(res,{message:"Intervel server Error"},HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async bookingStatusChange(req: AuthRequest, res: Response): Promise<void> {
    try {
      const expertId = req.expert.expertId;
      const { bookingId } = req.params;
      const { status ,reason} = req.body;
      
  
      if (!expertId || !bookingId || !status) {
        this._sendResponse(res, { message: "Missing required fields." }, HttpStatus.BAD_REQUEST);
        return;
      }
  
      const result = await this.bookingService.changeStatus(expertId, bookingId, status,reason);
  
      if (!result.success) {
        this._sendResponse(res, { message: result.message }, HttpStatus.BAD_REQUEST);
        return;
      }
  
      this._sendResponse(res, {
        success: true,
        message: "Booking status updated successfully",
        status: result.status,
      }, HttpStatus.OK);
  
    } catch (error: any) {
      console.error("Status change error:", error.message);
      this._sendResponse(res, { message: "Internal server error" }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      
      const result = await this.bookingService.userBookings(userId, page, limit);
      this._sendResponse(res, result, result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    } catch (error:any) {
      this._sendResponse(res, {
        success: false,
        message: error.message || 'Failed to fetch bookings'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async userCancelBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const userId = req.user.userId;
      const result = await this.bookingService.userCancelBooking(bookingId, userId);
      this._sendResponse(
        res,
        result,
        result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST
      );
    } catch (error:any) {
      this._sendResponse(
        res,{success: false,message: error.message || 'Failed to cancel booking'},
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  private _sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }
}