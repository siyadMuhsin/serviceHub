import mongoose, { Document,Schema}from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "expert";
    createdAt: Date;
    isGoogleUser: boolean;
    isBlocked:boolean;
    googleId: string;
    profile_imaga: string;
    expertStatus:string
    resetPasswordToken: string |undefined; // Changed to string
    resetPasswordExpires: Date |undefined; // Changed to Date
    isVerified: boolean;
  }

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, required: true, enum: ["user", "expert"], default: "user" },
    createdAt: { type: Date, default: Date.now },
    isGoogleUser: { type: Boolean, default: false },
    isBlocked:{type:Boolean,default:false},
    googleId: { type: String, required: false },
    profile_imaga: { type: String, required: false },
    expertStatus:{type:String,enum: ['default','pending', 'approved', 'rejected'],default:'default'},
    resetPasswordToken: { type: String }, 
    resetPasswordExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default mongoose.model<IUser>('User',userSchema)