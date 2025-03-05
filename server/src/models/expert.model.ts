import { IExpert } from "../types/Expert";
import mongoose,{Schema} from "mongoose";

const ExpertSchema = new Schema<IExpert>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
        categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        fullName: { type: String, required: true },
        dob: { type: Date, required: true },
        gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
        contact: { type: String, required: true },
        isApproved:{type:Boolean,default:false},
        experience: { type: Number, required: true },
        certificateUrl: { type: String, required: true }, 
    },
    { timestamps: true }
);

export default mongoose.model<IExpert>("Expert",ExpertSchema)