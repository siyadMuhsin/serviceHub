import { IExpert } from "../types/Expert";
import mongoose,{Schema} from "mongoose";

const ExpertSchema = new Schema<IExpert>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
        categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        accountName: { type: String, required: true },
        dob: { type: Date, required: true },
        gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
        contact: { type: String, required: true },
        isBlocked:{type:Boolean,default:false},
        status:{type:String,enum: ['pending', 'approved', 'rejected'],default:'pending'},
        experience: { type: Number, required: true },
        subscription: {
            plan: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Plans'
            },
            startDate: {
              type: Date,
              default: Date.now
            },
            endDate: Date,
            isActive: {
              type: Boolean,
              default: false
            }
        },
        gallery:[{type:String}],
        location: {lat:{type:Number},lng:{type:Number}},
        certificateUrl: { type: String, required: true }, 
    },
    { timestamps: true }
);

export default mongoose.model<IExpert>("Expert",ExpertSchema)