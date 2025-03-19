import bcrypt from "bcryptjs";
import { generateAccessToken,generateRefreshToken } from "../utils/jwt";
import UserRepository from "../repositories/UserRepository";
import { error } from "console";
import {
  generateOTP,
  sendMailer,
  generateResetToken,
  sendResetMail,
} from "../utils/emailService";
import OtpRepository from "../repositories/OtpRepository";
import { resolveSoa } from "dns";
import { access } from "fs";

interface AuthResult {
  message?: string;
  user?: object;
  token?: string;
  error?: string;
  success?: boolean;
}
class AuthService {
  async registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    const exitingUser = await UserRepository.findUserByEmail(email);
    const otpSended = await OtpRepository.findByEmail(email);
    if (otpSended) {
      return { success: true, message: "OTP already sent to this email" };
    }

    if (exitingUser && exitingUser.isVerified && !exitingUser.isGoogleUser) {
      return { success: false, message: "User with this email already exists" };
    }
    if (exitingUser && exitingUser.isGoogleUser && !exitingUser.password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserRepository.findUserAndUpdate(exitingUser.email, {
        password: hashedPassword,
      });
    }
    if (!exitingUser) {
      const hasshedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserRepository.createUser({
        name,
        email,
        password: hasshedPassword,
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000); //one minutes
    await OtpRepository.saveOTP(email, otp, otpExpires);

    await sendMailer(email, otp);

    return { success: true, message: "OTP sent to email. Please verify." };
  }
  async verifyOtp(email: string, otp: string) {
    const otpData = await OtpRepository.findOTP(email, otp);
    if (!otpData) {
      return { success: false, message: "Invalid OTP or Otp Expired" };
    }
    if (otpData.expiresAt < new Date()) {
      return { success: false, message: "Otp Expired" };
    }
    await OtpRepository.deleteOTP(email);
    await UserRepository.findUserAndUpdate(email, { isVerified: true });
    return { success: true, message: "Otp verified" };
  }

  async resendOtp(email: string) {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      return { success: false, message: "User with this email does not exist" };
    }
    const otpSended = await OtpRepository.findByEmail(email);
    if (otpSended) {
      return { success: true, message: "OTP already sent to this email" };
    }
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000);
    await OtpRepository.saveOTP(email, otp, otpExpires);
    await sendMailer(email, otp);
    return { success: true, messsage: "Otp sended succcessfully" };
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await UserRepository.findUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: "User with this email does not exist",
        };
      }
      if (user && !user.password) {
        return {
          success: false,
          message: "this is googel user password not set",
        };
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, message: "Password is incorrect" };
      }
      if (user.isBlocked) {
        return {
          success: false,
          message: "Admin has blocked your account",
        };
      }
       // Generate Tokens
       const accessToken = generateAccessToken(user._id,'user');
       const refreshToken = generateRefreshToken(user._id,'user');

       return { 
        success: true, 
        user: user, 
        accessToken, 
        refreshToken 
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async findUser(id: string) {
    try {
      const userDetails = await UserRepository.findUserById(id);
      if (!userDetails) {
        return { success: false, message: "User not found" };
      }
      return { success: true, user: userDetails };
    } catch (err: any) {
      return { success: false, message: "Internal Server Error" };
    }
  }
  async saveGoogleUser(
    googleId: string,
    email: string,
    name: string,
    image: string
  ) {
    try {
      const existingUser = await UserRepository.findUserByEmail(email);
     
      if (existingUser) {
        if(existingUser.isBlocked){
          return {
            success:false,
             message: "Admin has blocked your account"
          }
        }
        if (existingUser.isGoogleUser) {
          return {
            success: true,
            user: existingUser,
            accessToken: generateAccessToken(existingUser._id,'user'),
            refreshToken:generateRefreshToken(existingUser._id,'user')
          };
        } else {
          const updateUser = await UserRepository.findUserAndUpdate(
            existingUser.email,
            { isGoogleUser: true, googleId: googleId, profile_imaga: image }
          );
          if (updateUser) {
            return {
              success: true,
              user: updateUser,
              accessToken: generateAccessToken(updateUser._id,'user'),
              refreshToken:generateRefreshToken(updateUser._id,'user')
            };
          }
        }
      } else {
        const createUser = await UserRepository.createUser({
          googleId,
          email,
          name,
          profile_imaga: image,
          isGoogleUser: true,
          isVerified: true,
        });
        if (createUser) {
          return {
            success: true,
            user: createUser,
            accessToken: generateAccessToken(createUser._id,'user'),
            refreshToken:generateRefreshToken(createUser._id,'user')
          };
        }
      }
    } catch (err: any) {
      console.log(err);
      console.error("Error in saveGoogleUser:", err);
    }
  }

  async forgetPassword(email: string) {
    try {
      const existingUser = await UserRepository.findUserByEmail(email);
      if (!existingUser) {
        return { success: false, message: "Email not found" };
      }
      const resetToken = generateResetToken();
      existingUser.resetPasswordToken = resetToken;
      existingUser.resetPasswordExpires = new Date(Date.now() + 300000);
      await existingUser.save();

      await sendResetMail(email, resetToken);
      return { success: true, message: "Password reset email sent" };
    } catch (error) {
      console.error("Error in forgetPassword:", error);
      return {
        success: false,
        message: "An error occurred. Please try again.",
      };
    }
  }


  async resetPassword (token:string,newPassword:string){
    try {
      const user= await UserRepository.findOneBYToken(token)
      if (!user) {
        return { success: false, message: "Invalid or expired token" };
      }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return { success: true, message: "Password reset successful" };
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return { success: false, message: "An error occurred. Please try again." };
    }
  }
}

export default new AuthService();
