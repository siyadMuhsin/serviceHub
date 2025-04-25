import { inject, injectable } from "inversify";
import { IBookingService } from "../core/interfaces/services/IBookingService";
import { TYPES } from "../di/types";
import { IExpertRepository } from "../core/interfaces/repositories/IExpertRepository";
import { ISlotRespository } from "../core/interfaces/repositories/ISlotRepository";
import { IBookingRepository } from "../core/interfaces/repositories/IBookingRespository";
import mongoose from "mongoose";

import { IBooking } from "../models/booking.model";
import { CloudinaryService } from "../config/cloudinary";
import { calculateDistance } from "../utils/distanceInKm";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.ExpertRepository) private expertRepository: IExpertRepository,
    @inject(TYPES.SlotRepository) private slotRepository: ISlotRespository,
    @inject(TYPES.BookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.UserRepository) private userRepository:IUserRepository
  ) {}

  async createBooking(
    userId: string, expertId: string, slotId: string, time: string,
    notes: string, location: number[], address: string, images?: Express.Multer.File[]
  ): Promise<{ success: boolean; message: string; data?: IBooking }> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(expertId) || !mongoose.Types.ObjectId.isValid(slotId)) {
        return { success: false, message: "Invalid ID format" };
      }

      const expert = await this.expertRepository.findById(expertId);
      if (!expert) return { success: false, message: "Expert not found" };

      const slot = await this.slotRepository.findById(slotId);
      if (!slot) return { success: false, message: "Slot not found" };

      if (!slot.timeSlots.includes(time)) {
        return { success: false, message: "Selected time is not available in this slot" };
      }

      let uploadedImageUrls: string[] = [];
      if (images && images.length > 0) {
        const uploadPromises = images.map((file) => CloudinaryService.uploadImage(file));
        uploadedImageUrls = (await Promise.all(uploadPromises)) as string[];
      }
      let geoLocation = undefined;
      if (location && location.length === 2) {
        geoLocation = { address, type: "Point", coordinates: location };
      }

      const booking = await this.bookingRepository.create({
        userId: new mongoose.Types.ObjectId(userId),
        expertId: new mongoose.Types.ObjectId(expertId),
        slotId: new mongoose.Types.ObjectId(slotId),
        time, date: slot.date, notes, images: uploadedImageUrls, location: geoLocation, status: "pending"
      });

      return { success: true, message: "Booking created successfully", data: booking };
    } catch (error: any) {
      console.error("BookingService error:", error);
      return { success: false, message: error.message || "Failed to create booking" };
    }
  }

  async getBookingsToExpert(
    expertId: string, page: number = 1, limit: number = 10, status?: string
  ): Promise<{
    success: boolean; message: string; bookings?: any;
    pagination?: { total: number; page: number; pages: number; limit: number };
  }> {
    try {
      const expert = await this.expertRepository.findById(expertId);
      if (!expert) return { success: false, message: "The Expert Id Not found" };

      const expertLat = expert.location?.coordinates[1];
      const expertLng = expert.location?.coordinates[0];

      const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
      if (status && !validStatuses.includes(status)) {
        return { success: false, message: "Invalid status. Valid values are: pending, confirmed, completed, cancelled" };
      }

      const { bookings, total } = await this.bookingRepository.getBookingsToExpert(expertId, page, limit, status);
      const updatedBookings = bookings.map((booking) => {
        const userLat = booking?.location?.coordinates[1];
        const userLng = booking?.location?.coordinates[0];
        let distance = null;

        if (expertLat && expertLng && userLat && userLng) {
          distance = calculateDistance(expertLat, expertLng, userLat, userLng);
        }

        const plainBooking = booking.toObject();
        return { ...plainBooking, distance };
      });

      return {
        success: true, message: "Bookings fetched successfully", bookings: updatedBookings,
        pagination: { total, page, pages: Math.ceil(total / limit), limit }
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeStatus(
    expertId: string, bookingId: string, status: string,reason?:string
  ): Promise<{ success: boolean; message: string; status?: string }> {
    try {
      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking) return { success: false, message: "Booking not found" };
      if (booking.expertId.toString() !== expertId.toString()) {
        return { success: false, message: "Unauthorized access to this booking" };
      }
      const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
      if (!validStatuses.includes(status)) return { success: false, message: "Invalid status" };
      const updateData: any = { status };
      if (status === "cancelled" && reason) {
        updateData.cancellationReason = reason;
      }
      await this.bookingRepository.updateById(bookingId,updateData );
      const slotId= booking.slotId.toString()
      if(status==='confirmed'){
        const slot=await this.slotRepository.findById(slotId)
        if (slot) {
          const updatedTimeSlots = slot.timeSlots.filter(
            (time: string) => time !== booking.time
          )
          await this.slotRepository.updateById(slotId, {timeSlots:updatedTimeSlots});
        }
      }
      return { success: true, message: "Status updated", status };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async userBookings(
    userId: string, 
    page: number = 1, 
    limit: number = 8
  ) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const { bookings, totalCount } = await this.bookingRepository.findUserBookings(
        { userId: userObjectId },
        page,
        limit
      );

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        message: 'Bookings fetched successfully',
        bookings,
        totalCount,
        totalPages,
        currentPage: page
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async userCancelBooking(bookingId: string, userId: string): Promise<{ success: boolean; message: string; }> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }

    if (booking.userId.toString() !== userId) {
      return { 
        success: false, 
        message: 'You are not authorized to cancel this booking' 
      };
    }
    // Check if booking can be canceled (based on status)
    if (booking.status === 'cancelled') {
      return { 
        success: false, 
        message: 'Booking is already cancelled' 
      };
    }
    await this.bookingRepository.delete(bookingId)
    return { 
      success: true, 
      message: 'Booking cancelled successfully',
    };
    } catch (error:any) {
      console.error('Error cancelling booking:', error);
      throw new Error(error.message || 'Failed to cancel booking');
    }
    
  }
  async allBookings(expertId: string): Promise<any> {
    try {
      const expertObjectId = new mongoose.Types.ObjectId(expertId);
const [total, pending, completed,cancelled] = await Promise.all([
  this.bookingRepository.count({ expertId: expertObjectId }),
  this.bookingRepository.count({ expertId: expertObjectId, status: 'pending' }),
  this.bookingRepository.count({ expertId: expertObjectId, status: 'completed' }),
  this.bookingRepository.count({ expertId: expertObjectId, status: 'cancelled' }),

]);
      console.log(total,pending,completed,cancelled);
      return {total,pending,completed,cancelled}
    } catch (error) {
      
    }
  }
}
