import { inject, injectable } from "inversify";
import { ISlotService } from "../../core/interfaces/services/ISlotService";
import { ISlot } from "../../models/slot.model";
import { TYPES } from "../../di/types";
import { IExpertRepository } from "../../core/interfaces/repositories/IExpertRepository";
import { ISlotRespository } from "../../core/interfaces/repositories/ISlotRepository";
import mongoose, { Date } from "mongoose";
import { mapSlotToDTO, SlotDTO } from "../../mappers/slot.mapper";

@injectable()
export class SlotServices implements ISlotService {
  constructor(
    @inject(TYPES.ExpertRepository)
    private _expertRepository: IExpertRepository,
    @inject(TYPES.SlotRepository) private _slotRespository: ISlotRespository
  ) {}

  async createSlot(
    expertId: string,
    data: Partial<ISlot>
  ): Promise<{ success: boolean; message: string; slot?: SlotDTO }> {
    try {
      const expert = await this._expertRepository.findById(expertId);
      if (!expert) {
        return { success: false, message: "Expert Id not match" };
      }

      if (!data.date) {
        return { success: false, message: "Date not fount" };
      }

      const date = new Date(data.date);
      const expireAt = new Date(date);
      expireAt.setUTCHours(23, 59, 59, 999);
      const slotData = {
        ...data,
        date,
        expireAt, // include TTL field
      };
      const slot = await this._slotRespository.createSLot(expertId, slotData);
      const slotDTO=mapSlotToDTO(slot)
      return { success: true, message: "Slot created", slot:slotDTO };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message || "Server error" };
    }
  }
  async getExpertSlots(
    expertId: string
  ): Promise<{ success: boolean; message: string; slots?: SlotDTO[] }> {
    try {
      const expertObjectId = new mongoose.Types.ObjectId(expertId);
      const slots = await this._slotRespository.findMany({
        expertId: expertObjectId,
      });
      const slotDTO=slots.map((x)=>mapSlotToDTO(x))
      return {
        success: true,
        message: "slot Get in successfully",
        slots: slotDTO,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message);
    }
  }
  async deleteSlot(
    expertId: string,
    slot_Id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const slot = await this._slotRespository.findById(slot_Id);
      if (!slot) {
        return { success: false, message: "Slot not found" };
      }
      if (slot.expertId.toString() !== expertId.toString()) {
        return {
          success: false,
          message: "Unauthorized: This slot doesn't belong to the expert",
        };
      }
      await this._slotRespository.delete(slot_Id);
      return { success: true, message: "Slot deleted successfully" };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        message: err.message || "Server error while deleting slot",
      };
    }
  }
}
