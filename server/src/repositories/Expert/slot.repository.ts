import { ISlotRespository } from "../../core/interfaces/repositories/ISlotRepository";
import { IPlan } from "../../models/plans.model";
import { ISlot, Slot } from "../../models/slot.model";

export class SlotRepository implements ISlotRespository{
    async createSLot(expertId: string, data: Partial<ISlot>): Promise<ISlot > {

        const slot = new Slot({...data,expertId});
  return await slot.save();       
    }
    
}