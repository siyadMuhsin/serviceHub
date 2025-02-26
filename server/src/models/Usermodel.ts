import mongoose, {Document,Schema}from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role:'user'|'admin';
    createdAt: Date;
    isVerified: boolean;
}

const userSchema =new  Schema<IUser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true, enum: ['user', 'admin'], default: 'user'},
    createdAt: {type: Date, default: Date.now} ,
    isVerified: {type: Boolean, default: false}
}, {timestamps: true});

export default mongoose.model<IUser>('User',userSchema)