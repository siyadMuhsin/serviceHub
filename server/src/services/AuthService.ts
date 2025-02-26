import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt'
import UserRepository from '../repositories/UserRepository'
import { error } from 'console';
import { generateOTP,sendMailer} from '../utils/emailService';
import OtpRepository from '../repositories/OtpRepository';
interface AuthResult {
    message?: string;
    user?: object;
    token?: string;
    error?: string;
    success?: boolean;
}
class AuthService{
    async registerUser(name:string,email:string,password:string) :Promise<AuthResult>{
        const exitingUser =await UserRepository.findUserByEmail(email)
        const otpSended= await OtpRepository.findByEmail(email)
        if(otpSended){
           
            return {success:true,message:'OTP already sent to this email'}

        }
        if(exitingUser && exitingUser.isVerified){
          return {success:false,message:'User with this email already exists'}
        }
        if(!exitingUser){
            const hasshedPassword = await bcrypt.hash(password,10)
            const newUser =await UserRepository.createUser({name,email,password:hasshedPassword})
           
        }
       

        const otp=generateOTP()
        const otpExpires = new Date(Date.now() + 1 * 60 * 1000); //one minutes
        await OtpRepository.saveOTP(email,otp ,otpExpires)

        await sendMailer(email,otp)
       
        return {success:true,message: "OTP sent to email. Please verify." };

    }
    async verifyOtp(email:string,otp:string){
        const otpData= await OtpRepository.findOTP(email,otp)
        if(!otpData){
            return {success:false,message:'Invalid OTP or Otp Expired'}    
        }
        if(otpData.expiresAt < new Date()){
            return {success:false,message : "Otp Expired"}
        }
        await OtpRepository.deleteOTP(email)
        await UserRepository.findUserAndUpdate(email,{isVerified:true})
        return {success:true,message:"Otp verified"}
    }

    async resendOtp(email:string){
        const user = await UserRepository.findUserByEmail(email)
        if(!user){
            return {success:false,message:"User with this email does not exist"}
        }
        const otpSended = await OtpRepository.findByEmail(email)
        if(otpSended){
            return {success:true,message:"OTP already sent to this email"}
        }
        const otp = generateOTP()
        const otpExpires = new Date(Date.now() + 1 * 60 * 1000)
        await OtpRepository.saveOTP(email,otp ,otpExpires)
        await sendMailer(email,otp)
        return {success:true,messsage:"Otp sended succcessfully"}
        
    }


    async loginUser(email:string,password:string){
        const user= await UserRepository.findUserByEmail(email)
       if(!user){
    return {success:false,message:'User with this email does not exist'} 
    }
    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        return {success:false,message:'Password is incorrect'}
    }
    return {success:true,user:user,token:generateToken(user._id)}
    }
}
export default new AuthService