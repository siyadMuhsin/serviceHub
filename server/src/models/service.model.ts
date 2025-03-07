import { Document,Schema,model } from "mongoose";
import { IServices } from "../types/Admin";

const serviceShema=new Schema<IServices>({
    name: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    image: { type: String },
    isActive:{type:Boolean,default:true},
    createdAt: { type: Date, default: Date.now },
})

export const Services = model<IServices>('Service',serviceShema) 