import { ISlot } from "../../../models/slot.model";

export interface ISlotService{
    createSlot(expertId:string,data:Partial<ISlot>):Promise<{
        success:boolean,
        message:string,
        slot?:ISlot 
    }>
    getExpertSlots(expertId:string):Promise<{
        success:boolean,
        message:string,
        slots?:ISlot[]
    }>
    deleteSlot(expertId:string,slot_Id:string):Promise<{
        success:boolean,
        message:string
    }>
}