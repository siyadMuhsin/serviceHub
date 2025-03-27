import { IOtp } from "../../../models/OtpModel";

export interface IOtpRepository {
    saveOTP(email: string, otp: string, expiresAt: Date): Promise<IOtp>;
    findOTP(email: string, otp: string): Promise<IOtp | null>;
    deleteOTP(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<IOtp | null>;
}