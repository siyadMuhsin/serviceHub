import { LeanDocument } from "mongoose";
import { IOtp } from "../../../models/otp.model";

export interface IOtpRepository {
    create(data:Partial<IOtp>): Promise<IOtp>;
    findOTP(email: string, otp: string): Promise<IOtp | null>;
    deleteOTP(email: string): Promise<boolean>;
    findOne(quary: Partial<IOtp>): Promise<LeanDocument<IOtp> | null>;
}