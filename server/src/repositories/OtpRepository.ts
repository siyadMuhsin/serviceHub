import { injectable } from 'inversify';
import OTP, { IOtp } from '../models/OtpModel';
import { IOtpRepository } from '../core/interfaces/repositories/IOtpRepository';

@injectable()
export class OtpRepository implements IOtpRepository {
    async saveOTP(email: string, otp: string, expiresAt: Date): Promise<IOtp> {
        try {
            const otpRecord = await OTP.create({ email, otp, expiresAt });
            return otpRecord.toObject();
        } catch (error) {
            console.error(`Error saving OTP for ${email}:`, error);
            throw new Error('Failed to save OTP');
        }
    }

    async findOTP(email: string, otp: string): Promise<IOtp | null | any> {
        try {
            const record = await OTP.findOne({ email, otp }).lean();
            return record;
        } catch (error) {
            console.error(`Error finding OTP for ${email}:`, error);
            throw new Error('Failed to find OTP');
        }
    }

    async deleteOTP(email: string): Promise<boolean> {
        try {
            const result = await OTP.deleteOne({ email });
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`Error deleting OTP for ${email}:`, error);
            throw new Error('Failed to delete OTP');
        }
    }

    async findByEmail(email: string): Promise<IOtp | null> {
        try {
            return await OTP.findOne({ email }).lean();
        } catch (error) {
            console.error(`Error finding OTP by email ${email}:`, error);
            throw new Error('Failed to find OTP by email');
        }
    }
}