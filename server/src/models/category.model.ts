import { ICategory } from "../types/Admin";
import mongoose,{ Document,Schema, } from "mongoose";

const categorySchema=new Schema<ICategory> ({ 

    name:{type:String,required:true},
    description: { type: String },
    isActive:{type:Boolean,default:true},
  image: { type: String },
  
},{timestamps:true})
export const Category = mongoose.model<ICategory>('Category',categorySchema)