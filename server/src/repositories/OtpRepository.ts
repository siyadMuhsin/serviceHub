import { injectable } from 'inversify';
import OTP, { IOtp } from '../models/otp.model';
import { IOtpRepository } from '../core/interfaces/repositories/IOtpRepository';
import { BaseRepository } from './BaseRepository';
import { LeanDocument } from 'mongoose';

@injectable()
export class OtpRepository extends BaseRepository<IOtp> implements IOtpRepository {
    constructor(){
        super(OTP)
    }
    async saveOTP(email: string, otp: string, expiresAt: Date): Promise<IOtp> {
        try {
         return await this.create({ email, otp, expiresAt });
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

    async findByEmail(email: string): Promise<LeanDocument<IOtp> | null> {
        try {
            return await this.findOne({ email })
        } catch (error) {
            console.error(`Error finding OTP by email ${email}:`, error);
            throw new Error('Failed to find OTP by email');
        }
    }
}