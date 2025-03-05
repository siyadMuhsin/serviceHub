
import mongoose,{Document} from "mongoose";
export interface IExpert extends Document {
    userId: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    fullName: string;
    dob: Date;
    gender: "Male" | "Female" | "Other";
    contact: string;
    experience: number;
    isApproved:boolean;
    certificateUrl: string; // Cloudinary URL
    createdAt?: Date;
    updatedAt?: Date;
}