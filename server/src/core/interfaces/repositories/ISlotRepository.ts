import { IPlan } from "../../../models/plans.model";
import { ISlot } from "../../../models/slot.model";

export interface ISlotRespository{
    createSLot(expertId:string,date:Partial<ISlot>):Promise<ISlot>
    findMany(quary:Partial<ISlot>):Promise<ISlot[] |[]>
    delete(slot_id:string):Promise<boolean>
    findById(slot_Id:string):Promise<ISlot | null>
    updateById(slot_Id:string,udpate:Partial<ISlot>):Promise<ISlot | null>
}