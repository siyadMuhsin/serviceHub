import { IUser } from "../models/user.model";
import mongoose from "mongoose";

export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  role: "user" | "expert";
  createdAt: Date;
  isGoogleUser: boolean;
  isBlocked: boolean;
  googleId: string;
  profile_image: string;
  expertStatus: string;
  phone: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isVerified: boolean;
  rejectReason?: string;
  location?: { type: string; coordinates: number[] };
  savedServices: mongoose.Types.ObjectId[];
}

export const mapUserToDTO = (user: IUser): UserDTO => {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    isGoogleUser: user.isGoogleUser,
    isBlocked: user.isBlocked,
    googleId: user.googleId,
    profile_image: user.profile_image,
    expertStatus: user.expertStatus,
    phone: user.phone,
    resetPasswordToken: user.resetPasswordToken,
    resetPasswordExpires: user.resetPasswordExpires,
    isVerified: user.isVerified,
    rejectReason: user.rejectReason,
    location: user.location,
    savedServices: user.savedServices,
  };
};
