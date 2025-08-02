import mongoose from "mongoose";
import { ISlot } from "../models/slot.model";

export interface SlotDTO {
  _id: string;
  expertId: mongoose.Types.ObjectId;
  date: Date;
  timeSlots: string[];
  createdAt: Date;
  expireAt: Date;
}

export const mapSlotToDTO = (slot: ISlot): SlotDTO => {
  return {
    _id: slot._id.toString(),
    expertId: slot.expertId,
    date: slot.date,
    timeSlots: slot.timeSlots,
    createdAt: slot.createdAt,
    expireAt: slot.expireAt,
  };
};
