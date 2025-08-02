import { IExpert } from "../types/Expert";
import { IUser } from "../models/user.model";
import { ICategory, IServices } from "../types/Admin";

export interface ExpertDTO {
    _id:string
  userId: IUser;
  serviceId: IServices;
  categoryId: ICategory;
  accountName: string;
  dob: Date;
  status: string;
  gender: "Male" | "Female" | "Other";
  contact: string;
  experience: number;
  isBlocked: boolean;
  certificateUrl: string;
  subscription: any;
  location?: { type: string; coordinates: number[] };
  rejectReason?: string;
  gallery?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const mapExpertToDTO = (expert: IExpert): ExpertDTO => {
  return {
    _id:expert._id.toString(),
    userId: expert.userId,
    serviceId: expert.serviceId,
    categoryId: expert.categoryId,
    accountName: expert.accountName,
    dob: expert.dob,
    status: expert.status,
    gender: expert.gender,
    contact: expert.contact,
    experience: expert.experience,
    isBlocked: expert.isBlocked,
    certificateUrl: expert.certificateUrl,
    subscription: expert.subscription,
    location: expert.location,
    rejectReason: expert.rejectReason,
    gallery: expert.gallery,
    createdAt: expert.createdAt,
    updatedAt: expert.updatedAt,
  }
}