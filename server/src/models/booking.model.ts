// models/booking.model.ts or booking.schema.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  expertId: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  userLocation?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
}

const BookingSchema: Schema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expertId: { type: Schema.Types.ObjectId, ref: "Expert", required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  userLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
    },
  },
  notes: { type: String },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
