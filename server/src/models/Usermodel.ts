import mongoose, {Document,Schema}from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role:'user'|'admin';
    createdAt: Date;
    isGoogleUser:boolean;
    googleId:string;
    profile_imaga:string;
    isVerified: boolean;
}

const userSchema =new  Schema<IUser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: false},
    role: {type: String, required: true, enum: ['user', 'admin'], default: 'user'},
    createdAt: {type: Date, default: Date.now} ,
    isGoogleUser:{type:Boolean,default:false},
    googleId:{type:String,required:false},
    profile_imaga:{type:String,required:false},
    isVerified: {type: Boolean, default: false}
}, {timestamps: true});

export default mongoose.model<IUser>('User',userSchema)