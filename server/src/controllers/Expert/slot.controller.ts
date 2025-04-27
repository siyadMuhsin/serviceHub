import { Request, Response } from "express";
import { ISlotController } from "../../core/interfaces/controllers/ISlotController";
import { AuthRequest } from "../../types/User";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISlotService } from "../../core/interfaces/services/ISlotService";
import { HttpStatus } from "../../types/httpStatus";

@injectable()
export class SlotController implements ISlotController {
  constructor(@inject(TYPES.SlotServices) private _slotService: ISlotService) {}

  async addExpertSlot(req: AuthRequest, res: Response): Promise<void> {
    try {
      const expertId = req.expert?.expertId; // Assuming expert is logged in
      const { date, timeSlots } = req.body;
      if (!date || !Array.isArray(timeSlots) || timeSlots.length === 0) {
        this.sendResponse(res,{success: false, message: "Date and time slots are required" },HttpStatus.BAD_REQUEST)
        return;
      }
      const result = await this._slotService.createSlot(expertId, { date, timeSlots });
      this.sendResponse(res,result,result.success?HttpStatus.CREATED:HttpStatus.BAD_REQUEST)
    } catch (error) {
      const err= error as Error
      console.error("Error creating slot:", err);
      this.sendResponse(res,{ success: false, message:err.message|| "Server error"},HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async getSlotsToExpert(req: AuthRequest, res: Response): Promise<void> {
    try {
      const expertId= req?.expert?.expertId
      const response=await this._slotService.getExpertSlots(expertId)
      this.sendResponse(res,response,HttpStatus.OK)
    } catch (error) {
      const err= error as Error
      this.sendResponse(res,{message:err.message||"Internal server error"},HttpStatus.INTERNAL_SERVER_ERROR)
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
      const result = await this._slotService.deleteSlot(expertId, slotId);
     this.sendResponse(res,result,result.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
    } catch (error) {
      const err= error as Error
      console.error("Error deleting slot:", error);
      this.sendResponse(res,{ success: false, message:err.message|| "Internal server error" },HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async getSlotToUser(req: Request, res: Response): Promise<void> {
    try {
      const {expertId}=req.params
      if(!expertId){
        this.sendResponse(res,{success:false,message:"Expert ID is missing"},HttpStatus.BAD_REQUEST)
        return
      }
      const result= await this._slotService.getExpertSlots(expertId)
      this.sendResponse(res,result,result.success?HttpStatus.OK:HttpStatus.BAD_REQUEST)
    } catch (error) {
      const err= error as Error
      this.sendResponse(res,{message:err.message ||"Internal server Error"},HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
    private sendResponse(res: Response, data: any, status: HttpStatus): void {
          res.status(status).json(data);
      }
  
}
