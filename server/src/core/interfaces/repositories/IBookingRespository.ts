import { IBooking } from "../../../models/booking.model";
interface PaginatedResult<T> {
    bookings: T[];
    totalCount: number;
  }
export interface IBookingRepository{
    createBooking(data:Partial<IBooking>):Promise<IBooking>
    getBookingsToExpert(expertId:string,page:number,limit:number,status?:string):Promise< {bookings: IBooking[] | [], total: number} >
    getBookingById(id:string):Promise<IBooking|null>
    findByIdAndUpdate(id:string,data:Partial<IBooking>):Promise<IBooking|null>
    findUserBookings(query:Partial<IBooking>,page:number,limit:number):Promise<PaginatedResult<IBooking>>
    delete(id:string):Promise<boolean>
}