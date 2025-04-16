import { LeanDocument } from "mongoose";
import { ISlotRespository } from "../../core/interfaces/repositories/ISlotRepository";
import { IPlan } from "../../models/plans.model";
import { ISlot, Slot } from "../../models/slot.model";
import { BaseRepository } from "../BaseRepository";

export class SlotRepository extends BaseRepository<ISlot> implements ISlotRespository{
    constructor(){
        super(Slot)
    }
    async createSLot(expertId: string, data: Partial<ISlot>): Promise<ISlot > {
        const slot = new Slot({...data,expertId});
  return await slot.save();       
    }

}