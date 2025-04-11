import mongoose, { Schema, Document } from "mongoose";

export interface ISlot extends Document {
  expertId: mongoose.Types.ObjectId;
  date: Date;
  timeSlots: string[];
  createdAt: Date;
}

const SlotSchema: Schema = new Schema<ISlot>({
  expertId: { type: Schema.Types.ObjectId, ref: "Expert", required: true },
  date: { type: Date, required: true },
  timeSlots: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

export const Slot = mongoose.model<ISlot>("Slot", SlotSchema);
