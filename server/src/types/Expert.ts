import { IUser } from "../models/user.model";
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
    subscription:any;
    location?: {lat:number,lng:number},
    gallery?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}