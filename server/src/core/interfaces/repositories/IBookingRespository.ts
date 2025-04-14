import { IBooking } from "../../../models/booking.model";

export interface IBookingRepository{
    createBooking(data:Partial<IBooking>):Promise<IBooking>
    getBookingsToExpert(expertId:string,page:number,limit:number,status?:string):Promise< {bookings: IBooking[] | [], total: number} >
}