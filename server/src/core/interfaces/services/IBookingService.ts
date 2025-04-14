import { IBooking } from "../../../models/booking.model"

export interface IBookingService{
    createBooking(userId: string,expertId: string,slotId: string,time: string,notes:string,location:any,address:string,images?:Express.Multer.File[]):Promise<
    {
        success:boolean,
        message:string,
        date?:IBooking
    }>
    getBookingsToExpert(expertId:string,page:number,limit:number,status?:string):Promise<{
        success:boolean,
        message:string,
        bookings?:IBooking[]|[]
    }>
}