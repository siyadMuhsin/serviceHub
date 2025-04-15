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
    async getAllSlots(expertId: string): Promise<ISlot[] | []> {
        return await Slot.find({expertId:expertId})
    }
    async deleteSlot(slot_id: string): Promise<void> {
        try {
            await this.delete(slot_id)
        } catch (error) {
            throw new Error("Failed to delete slot");
        }
    }
    async findSlotById(id: string): Promise<ISlot | null> {
        const leanDoc= await this.findById(id)
        return this.transformToObject(leanDoc)
    }
    async updateSlotById(slot_Id: string, udpate: Partial<ISlot>): Promise<ISlot | null> {
        try {
            return await Slot.findByIdAndUpdate(slot_Id,udpate,{new:true})
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
}