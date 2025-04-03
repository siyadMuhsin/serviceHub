import { inject, injectable } from 'inversify';
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IOtpRepository } from "../core/interfaces/repositories/IOtpRepository";
import { generateOTP, sendMailer, generateResetToken, sendResetMail } from "../utils/emailService";
import { AuthResult } from "../types/User";
import { IAuthService } from '../core/interfaces/services/IAuthService';
import { TYPES } from "../di/types";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.OtpRepository) private otpRepository: IOtpRepository
  ) {}

  async registerUser(name: string, email: string, password: string): Promise<AuthResult> {
    try {
      const exitingUser = await this.userRepository.findUserByEmail(email);
      const otpSended = await this.otpRepository.findByEmail(email);
      
      if (otpSended) {
        return { success: true, message: "OTP already sent to this email" };
      }

      if (exitingUser && exitingUser.isVerified && !exitingUser.isGoogleUser) {
        return { success: false, message: "User with this email already exists" };
      }

      if (exitingUser && exitingUser.password) {
        return { success: false, message: "User with this email already exists" };
      }

      if (exitingUser && exitingUser.isGoogleUser && !exitingUser.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userRepository.findUserAndUpdate(exitingUser.email, {
          password: hashedPassword,
        });
        return this.generateAndSendOtp(email);
      }

      if (!exitingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userRepository.createUser({
          name,
          email,
          password: hashedPassword,
        });
        return this.generateAndSendOtp(email);
      }

      return { success: false, message: "Registration failed" };
    } catch (error) {
      console.error("Error in registerUser:", error);
      throw new Error("Registration failed");
    }
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResult> {
    try {
      const otpData = await this.otpRepository.findOTP(email, otp);
      if (!otpData) {
        return { success: false, message: "Invalid OTP or OTP Expired" };
      }
      if (otpData.expiresAt < new Date()) {
        return { success: false, message: "OTP Expired" };
      }
      
      await this.otpRepository.deleteOTP(email);
      await this.userRepository.findUserAndUpdate(email, { isVerified: true });
      
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      return { 
        success: true, 
        message: "OTP verified successfully",
        accessToken: generateAccessToken(user._id, 'user'),
        refreshToken: generateRefreshToken(user._id, 'user')
      };
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      throw new Error("OTP verification failed");
    }
  }

  async resendOtp(email: string): Promise<AuthResult> {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        return { success: false, message: "User with this email does not exist" };
      }

      const otpSended = await this.otpRepository.findByEmail(email);
      if (otpSended) {
        return { success: true, message: "OTP already sent to this email" };
      }

      return await this.generateAndSendOtp(email);
    } catch (error) {
      console.error("Error in resendOtp:", error);
      throw new Error("Failed to resend OTP");
    }
  }

  async loginUser(email: string, password: string): Promise<AuthResult> {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: "User with this email does not exist",
        };
      }

      if (user && !user.password) {
        return {
          success: false,
          message: "This is a Google user. Password not set",
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

      return { 
        success: true, 
        message: "Login successful",
        user: user,
        accessToken: generateAccessToken(user._id, 'user'),
        refreshToken: generateRefreshToken(user._id, 'user')
      };
    } catch (error) {
      console.error("Error in loginUser:", error);
      throw new Error("Login failed");
    }
  }

  async findUser(id: string): Promise<AuthResult> {
    try {
      const userDetails = await this.userRepository.findUserById(id);
      if (!userDetails) {
        return { success: false, message: "User not found" };
      }
      return { success: true, user: userDetails };
    } catch (error) {
      console.error("Error in findUser:", error);
      throw new Error("Failed to fetch user details");
    }
  }

  async saveGoogleUser(googleId: string, email: string, name: string, image: string): Promise<AuthResult> {
    try {
      const existingUser = await this.userRepository.findUserByEmail(email);
     
      if (existingUser) {
        if (existingUser.isBlocked) {
          return {
            success: false,
            message: "Admin has blocked your account"
          };
        }

        if (existingUser.isGoogleUser) {
          return this.generateAuthResponse(existingUser);
        } else {
          const updateUser = await this.userRepository.findUserAndUpdate(
            existingUser.email,
            { isGoogleUser: true, googleId: googleId, profile_image: image }
          );
          if (updateUser) {
            return this.generateAuthResponse(updateUser);
          }
        }
      } else {
        const createUser = await this.userRepository.createUser({
          googleId,
          email,
          name,
          profile_image: image,
          isGoogleUser: true,
          isVerified: true,
        });
        if (createUser) {
          return this.generateAuthResponse(createUser);
        }
      }

      return { success: false, message: "Google sign-in failed" };
    } catch (error) {
      console.error("Error in saveGoogleUser:", error);
      throw new Error("Google sign-in failed");
    }
  }

  async forgetPassword(email: string): Promise<AuthResult> {
    try {
      const existingUser = await this.userRepository.findUserByEmail(email);
      console.log(existingUser)
      if (!existingUser) {
        return { success: false, message: "Email not found" };
      }

      const resetToken = generateResetToken();

      const resetPasswordToken = resetToken;
     const resetPasswordExpires = new Date(Date.now() + 300000);
     await this.userRepository.findByIdAndUpdate(existingUser._id,{resetPasswordToken,resetPasswordExpires})

      await sendResetMail(email, resetToken);
      return { success: true, message: "Password reset email sent" };
    } catch (error) {
      console.error("Error in forgetPassword:", error);
      throw new Error("Failed to process password reset request");
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<AuthResult> {
    try {
      console.log(token)
      const user = await this.userRepository.findOneBYToken(token);
      console.log(user)
      if (!user) {
        return { success: false, message: "Invalid or expired token" };
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this .userRepository.findByIdClearToken(user._id, hashedPassword)
      return { success: true, message: "Password reset successful" };
    } catch (error) {
      console.error("Error in resetPassword:", error);
      throw new Error("Failed to reset password");
    }
  }

  private async generateAndSendOtp(email: string): Promise<AuthResult> {
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000); // 1 minute
    await this.otpRepository.saveOTP(email, otp, otpExpires);
    await sendMailer(email, otp);
    return { success: true, message: "OTP sent to email. Please verify." };
  }

  private generateAuthResponse(user: any): AuthResult {
    return {
      success: true,
      user: user,
      accessToken: generateAccessToken(user._id, 'user'),
      refreshToken: generateRefreshToken(user._id, 'user')
    };
  }
}