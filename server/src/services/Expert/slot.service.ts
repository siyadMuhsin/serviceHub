import { inject, injectable } from "inversify";
import { ISlotService } from "../../core/interfaces/services/ISlotService";
import { ISlot } from "../../models/slot.model";
import { TYPES } from "../../di/types";
import { IExpertRepository } from "../../core/interfaces/repositories/IExpertRepository";
import { ISlotRespository } from "../../core/interfaces/repositories/ISlotRepository";

@injectable()
export class SlotServices implements ISlotService {
  constructor(
    @inject(TYPES.ExpertRepository) private expertRepository: IExpertRepository,
    @inject(TYPES.SlotRepository) private slotRespository: ISlotRespository
  ) {}

  async createSlot(expertId: string, data: Partial<ISlot>): Promise<{ success: boolean; message: string; slot?: ISlot }> {
    try {
      const expert = await this.expertRepository.findById(expertId);
      if (!expert) {
        return { success: false, message: "Expert Id not match" };
      }

      const slot = await this.slotRespository.createSLot(expertId, data);
      return { success: true, message: "Slot created", slot };
    } catch (error: any) {
      console.log(error.message);
      return { success: false, message: "Server error" };
    }
  }
}