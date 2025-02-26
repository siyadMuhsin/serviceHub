import OTP,{ IOtp } from '../models/OtpModel'

class OtpRepository{
    async saveOTP(email: string, otp: string, expiresAt: Date) {
        return await OTP.create({ email, otp, expiresAt });
    }
    async findOTP(email: string, otp: string) {
        return await OTP.findOne({ email, otp });
    }
    async deleteOTP(email: string) {
        return await OTP.deleteOne({ email });
    }
    async findByEmail(email:string):Promise<IOtp|null>{
        return await OTP.findOne({email})
    }
   
}
export default new OtpRepository()