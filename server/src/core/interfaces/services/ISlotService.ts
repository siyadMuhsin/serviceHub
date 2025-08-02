import { ISlot } from "../../../models/slot.model";
import { SlotDTO } from "../../../mappers/slot.mapper";
export interface ISlotService{
    createSlot(expertId:string,data:Partial<ISlot>):Promise<{
        success:boolean,
        message:string,
        slot?:SlotDTO 
    }>
    getExpertSlots(expertId:string):Promise<{
        success:boolean,
        message:string,
        slots?:SlotDTO[]
    }>
    deleteSlot(expertId:string,slot_Id:string):Promise<{
        success:boolean,
        message:string
    }>
}