import { IBookingRepository } from "../core/interfaces/repositories/IBookingRespository";
import { Booking, IBooking } from "../models/booking.model";

export class BookingRepository implements IBookingRepository{
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
              .populate('userId' ,'name email phone')
              .exec(),
              
            Booking.countDocuments(query)
          ]);
      
          return { bookings, total };
        } catch (error) {
          throw error;
        }
      }
}