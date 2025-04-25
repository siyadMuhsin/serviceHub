import { IBooking } from "../../../models/booking.model";
interface PaginatedBookings {
  success: boolean;
  message: string;
  bookings?: IBooking[] | [];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface IBookingService {
  createBooking(
    userId: string,
    expertId: string,
    slotId: string,
    time: string,
    notes: string,
    location: any,
    address: string,
    images?: Express.Multer.File[]
  ): Promise<{
    success: boolean;
    message: string;
    date?: IBooking;
  }>;
  getBookingsToExpert(
    expertId: string,
    page: number,
    limit: number,
    status?: string
  ): Promise<{
    success: boolean;
    message: string;
    bookings?:  (IBooking & { distance?: number })[] | [];
    pagination?: {
        total: number;
        page: number;
        pages: number;
        limit: number;
      };
  }>;
  changeStatus(experId:string,bookingId:string,status:string,reason?:string):Promise<{
    success:boolean,
    message:string,
    status?:string
  }>
  userBookings(userId:string,page:number,limit:number):Promise<PaginatedBookings>
  userCancelBooking(bookingId:string,userId:string):Promise<{success:boolean,message:string}>
  allBookings(expertId:string):Promise<any>
}
