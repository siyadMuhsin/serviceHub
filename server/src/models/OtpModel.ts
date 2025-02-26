import mongoose,{Schema,Document} from "mongoose";

export interface IOtp extends Document {
    email: string;
    otp: number;
    expiresAt: Date;
}
const otpSchema = new Schema<IOtp>({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:Number,
        required:true
    },
    expiresAt: { type: Date, required: true }
})
// Create a TTL index on the `expiresAt` field
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model<IOtp>('Otp',otpSchema)