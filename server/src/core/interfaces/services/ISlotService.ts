import { ISlot } from "../../../models/slot.model";

export interface ISlotService{
    createSlot(expertId:string,data:Partial<ISlot>):Promise<{
        success:boolean,
        message:string,
        slot?:ISlot 
    }>
}