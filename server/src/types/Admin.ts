import { Document, ObjectId } from "mongoose";

export interface ICategory extends Document{
    name :string,
    description:string,
    image:string,
    isActive:boolean
    createdAt:Date
}

export interface IServices extends Document{
    name :string,
    categoryId:ObjectId,
    description :string,
    isActive?:boolean
image:string,
    createdAt?:Date
}