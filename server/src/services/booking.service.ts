import { inject, injectable } from "inversify";
import { IBookingService } from "../core/interfaces/services/IBookingService";
import { TYPES } from "../di/types";
import { IExpertRepository } from "../core/interfaces/repositories/IExpertRepository";
import { ISlotRespository } from "../core/interfaces/repositories/ISlotRepository";
import { IBookingRepository } from "../core/interfaces/repositories/IBookingRespository";
import mongoose from "mongoose";

import { IBooking } from "../models/booking.model";
import { CloudinaryService } from "../config/cloudinary";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.ExpertRepository) private expertRepository: IExpertRepository,
    @inject(TYPES.SlotRepository) private slotRepository: ISlotRespository,
    @inject(TYPES.BookingRepository) private bookingRepository: IBookingRepository
  ) {}

  async createBooking(userId: string, expertId: string, slotId: string, time: string, notes: string, location: number[],address:string,images?: Express.Multer.File[]): Promise<{ success: boolean; message: string, data?: IBooking }> {
    try {
      // Validate input IDs
      if (!mongoose.Types.ObjectId.isValid(userId) || 
          !mongoose.Types.ObjectId.isValid(expertId) || 
          !mongoose.Types.ObjectId.isValid(slotId)) {
        return { success: false, message: "Invalid ID format" };
      }
  
      // Check if expert exists
      const expert = await this.expertRepository.findById(expertId);
      if (!expert) {
        return { success: false, message: "Expert not found" };
      }
  
      // Check if slot exists
      const slot = await this.slotRepository.findSlotById(slotId);
      if (!slot) {
        return { success: false, message: "Slot not found" };
      }
  
      // Validate time slot availability
      if (!slot.timeSlots.includes(time)) {
        return { success: false, message: "Selected time is not available in this slot" };
      }
  
      // Handle image uploads
      let uploadedImageUrls: string[] = [];
      if (images && images.length > 0) {
        const uploadPromises = images.map((file) => CloudinaryService.uploadImage(file));
        uploadedImageUrls = await Promise.all(uploadPromises) as string[];
      }
  
      // Handle location (ensure it's a valid GeoJSON format if provided)
      console.log('from service',address)
      let geoLocation = undefined;
      if (location && location.length === 2) {
        geoLocation = {address:address, type: "Point", coordinates: location };
      }
  
      // Create the booking document
      const booking = await this.bookingRepository.createBooking({
        userId: new mongoose.Types.ObjectId(userId),
        expertId: new mongoose.Types.ObjectId(expertId),
        slotId: new mongoose.Types.ObjectId(slotId),
        time,
        date: slot.date,
        notes,
        images: uploadedImageUrls,
        location: geoLocation,
        status: "pending", // Default status
      });
  
      return { success: true, message: 'Booking created successfully', data: booking };
    } catch (error: any) {
      console.error("BookingService error:", error);
      return { success: false, message: error.message || "Failed to create booking" };
    }
  }
  async getBookingsToExpert(
    expertId: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{ 
    success: boolean; 
    message: string; 
    bookings?: IBooking[] | [];
    pagination?: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  }> {
    try {
      const expert = await this.expertRepository.findById(expertId);
      if (!expert) {
        return { success: false, message: "The Expert Id Not found" };
      }
  
      // Validate status if provided
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (status && !validStatuses.includes(status)) {
        return { 
          success: false, 
          message: "Invalid status. Valid values are: pending, confirmed, completed, cancelled" 
        };
      }
  
      const { bookings, total } = await this.bookingRepository.getBookingsToExpert(
        expertId,
        page,
        limit,
        status
      );
  
      return {
        success: true,
        message: "Bookings fetched successfully",
        bookings,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}