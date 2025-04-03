import { IUser } from "../models/Usermodel";
import mongoose,{Document} from "mongoose";
import { ICategory, IServices } from "./Admin";
export interface IExpert extends Document {
    userId: IUser;
    serviceId: IServices;
    categoryId:ICategory;
    accountName: string;
    dob: Date;
    status:string;
    gender: "Male" | "Female" | "Other";
    contact: string;
    experience: number;
    isBlocked:boolean;
    certificateUrl: string; // Cloudinary URL
    createdAt?: Date;
    updatedAt?: Date;
}