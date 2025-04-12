import { IPlan } from "../../../models/plans.model";
import { ISlot } from "../../../models/slot.model";

export interface ISlotRespository{
    createSLot(expertId:string,date:Partial<ISlot>):Promise<ISlot>
    getAllSlots(expertId:string):Promise<ISlot[] |[]>
    deleteSlot(slot_id:string):Promise<void>
    findSlotById(slot_Id:string):Promise<ISlot | null>
}