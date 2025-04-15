import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  expertId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  time: string;
  date: Date;
  notes?: string;
  images?: string[]; // file URLs or paths
  location?: {address:string, type: string, coordinates: number[] }; // GeoJSON format
  cancellationReason?:string
  status:string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expertId: { type: Schema.Types.ObjectId, ref: "Expert", required: true },
  slotId: { type: Schema.Types.ObjectId, ref: "Slot", required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  images: {
    type: [String],
    default: [],
  },
  location: {
    address:{type:String},
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: {
      type: [Number], // [lng, lat]
      default: undefined,
    },
  },
  status: {
    type: String,
    enum: ["pending", "confirmed","completed", "cancelled"],
    default: "pending",
  },
  cancellationReason:{type:String},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 2dsphere index for geolocation features
BookingSchema.index({ location: "2dsphere" });

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
