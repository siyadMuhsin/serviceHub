import { Response } from "express";
import { ISlotController } from "../../core/interfaces/controllers/ISlotController";
import { AuthRequest } from "../../types/User";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISlotService } from "../../core/interfaces/services/ISlotService";
import { HttpStatus } from "../../types/httpStatus";

@injectable()
export class SlotController implements ISlotController {
  constructor(@inject(TYPES.SlotServices) private slotService: ISlotService) {}

  async addExpertSlot(req: AuthRequest, res: Response): Promise<void> {
    try {
      const expertId = req.expert?.expertId; // Assuming expert is logged in
      const { date, timeSlots } = req.body;

      if (!date || !Array.isArray(timeSlots) || timeSlots.length === 0) {
        res.status(400).json({ success: false, message: "Date and time slots are required" });
        return;
      }

      const result = await this.slotService.createSlot(expertId, { date, timeSlots });
      if (result.success) {
        res.status(201).json({ success: true, message: result.message, data: result.slot });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Error creating slot:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
  async getSlotsToExpert(req: AuthRequest, res: Response): Promise<void> {
    try {
      const expertId= req?.expert?.expertId
      const response=await this.slotService.getExpertSlots(expertId)
      this.sendResponse(res,response,HttpStatus.OK)
    } catch (error:any) {
      this.sendResponse(res,{message:error.message||"Internal server error"},HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async deleteSlot(req: AuthRequest, res: Response): Promise<void> {
    try {
      const expertId = req?.expert?.expertId;
      const { slotId } = req.params;
      if (!slotId) {
        res.status(400).json({ success: false, message: "Slot ID is required" });
        return;
      }
      const result = await this.slotService.deleteSlot(expertId, slotId);
     this.sendResponse(res,result,result.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
    } catch (error) {
      console.error("Error deleting slot:", error);
      this.sendResponse(res,{ success: false, message: "Internal server error" },HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
    private sendResponse(res: Response, data: any, status: HttpStatus): void {
          res.status(status).json(data);
      }
  
}
