import mongoose, { LeanDocument } from "mongoose";
import { IBookingRepository } from "../core/interfaces/repositories/IBookingRespository";
import { Booking, IBooking } from "../models/booking.model";
import { BaseRepository } from "./BaseRepository";

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository{
  constructor(){
    super(Booking)
  }
    async createBooking(data: Partial<IBooking>): Promise<IBooking> {
        const booking= new Booking(data)
        return await booking.save()
    }
    async getBookingsToExpert(
        expertId: string,
        page: number = 1,
        limit: number = 10,
        status?: string
      ): Promise<{ bookings: IBooking[] | []; total: number }> {
        try {
          const query: any = { expertId };
          
          // Add status filter if provided
          if (status) {
            query.status = status;
          }
          const skip = (page - 1) * limit;
      
          const [bookings, total] = await Promise.all([
            Booking.find(query)
              .sort({ createdAt: -1 }) // Sort by newest first
              .skip(skip)
              .limit(limit)
              .populate('userId' ,'name email phone profile_image')
              .exec(),
              
            Booking.countDocuments(query)
          ]);
      
          return { bookings, total };
        } catch (error) {
          throw error;
        }
      }
      async getBookingById(id: string): Promise<IBooking | null> {
        return await Booking.findById(id)
       
        
      }
      async findByIdAndUpdate(id: string,data:Partial<IBooking>): Promise<IBooking | null> {
        try {
          const leanDoc= await this.updateById(id,data)
          return this.transformToObject(leanDoc)
        } catch (error:any) {
          console.log(error)
          throw new Error(error.message)
        } 
      }
      async findUserBookings(
        query: Partial<IBooking>,
        page: number = 1,
        limit: number = 8
      ) {
        try {
          const skip = (page - 1) * limit;
          const filter: mongoose.FilterQuery<IBooking> = {
            userId:query.userId
          };
          const [bookings, totalCount] = await Promise.all([
            Booking.find(filter)
              .skip(skip)
              .limit(limit)
              .sort({ createdAt: -1 })
              .populate({
                path: 'expertId',
                select: 'name profile_image rating',
                populate: {
                  path: 'serviceId userId', // Nested population
                  select: 'name profile_image' // Or whatever fields you need from Service
                }
              }),
             
              
            Booking.countDocuments(filter)
          ]);
    
          return {
            bookings,
            totalCount
          };
        } catch (error:any) {
          throw new Error(`Failed to fetch user bookings: ${error.message}`);
        }
      }
}