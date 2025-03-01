import mongoose,{Schema,Document} from "mongoose";

export interface IAdmin extends Document {
    adminEmail: string;
    adminName: string;
    adminPassword: string;
}

const adminSchema=new Schema<IAdmin>({
    adminEmail:String,
    adminName:String,
    adminPassword:String
})
export default mongoose.model<IAdmin>('Admin',adminSchema)