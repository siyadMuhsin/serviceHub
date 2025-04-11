import { IPlan } from "../../../models/plans.model";
import { ISlot } from "../../../models/slot.model";

export interface ISlotRespository{
    createSLot(expertId:string,date:Partial<ISlot>):Promise<ISlot>
}