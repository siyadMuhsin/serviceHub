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


}