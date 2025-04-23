import mongoose, { Schema, Document } from "mongoose";

export interface ISlot extends Document {
  expertId: mongoose.Types.ObjectId;
  date: Date;
  timeSlots: string[];
  createdAt: Date;
  expireAt:Date
}

const SlotSchema: Schema = new Schema<ISlot>({
  expertId: { type: Schema.Types.ObjectId, ref: "Expert", required: true },
  date: { type: Date, required: true },
  timeSlots: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, required: true },
});
SlotSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
export const Slot = mongoose.model<ISlot>("Slot", SlotSchema);
