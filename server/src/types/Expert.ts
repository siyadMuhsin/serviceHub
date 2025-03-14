import { IUser } from "../models/Usermodel";
import mongoose,{Document} from "mongoose";
export interface IExpert extends Document {
    userId: IUser;
    serviceId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    accountName: string;
    dob: Date;
    status:string;
    gender: "Male" | "Female" | "Other";
    contact: string;
    experience: number;
    isApproved:boolean;
    certificateUrl: string; // Cloudinary URL
    createdAt?: Date;
    updatedAt?: Date;
}