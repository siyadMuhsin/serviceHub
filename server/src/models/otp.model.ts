import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOtp extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
    createdAt?: Date;
}

const otpSchema = new Schema<IOtp>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

// otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const OTP: Model<IOtp> = mongoose.models.OTP || mongoose.model<IOtp>('OTP', otpSchema);

export default OTP;
