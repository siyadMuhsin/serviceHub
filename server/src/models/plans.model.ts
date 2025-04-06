// models/plans.model.ts
import mongoose, { Document, ObjectId } from 'mongoose';

// Define methods interface
interface IPlanMethods {
  generateDurationDisplay(): string;
}

// Define model interface
export interface IPlan extends Document, IPlanMethods {
  _id: ObjectId;
  name: string;
  durationMonths: number;
  durationDisplay: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PlainPlan={
  _id: ObjectId;
  name: string;
  durationMonths: number;
  durationDisplay: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define schema with methods
const subscriptionPlanSchema = new mongoose.Schema<IPlan, mongoose.Model<IPlan, {}, IPlanMethods>>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  durationMonths: {
    type: Number,
    required: true,
    min: 1
  },
  durationDisplay: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Auto-generate durationDisplay before saving
subscriptionPlanSchema.pre('save', function(next) {
  if (this.isModified('durationMonths')) {
    this.durationDisplay = this.generateDurationDisplay();
  }
  next();
});

// Add method to schema
subscriptionPlanSchema.methods.generateDurationDisplay = function(): string {
  if (this.durationMonths === 1) return '1 Month';
  if (this.durationMonths < 12) return `${this.durationMonths} Months`;
  if (this.durationMonths === 12) return '1 Year';
  return `${Math.floor(this.durationMonths/12)} Year${Math.floor(this.durationMonths/12) > 1 ? 's' : ''}`;
};

// Create and export model
const PlanModel = mongoose.model<IPlan>('Plans', subscriptionPlanSchema);
export default PlanModel;