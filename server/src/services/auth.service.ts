import { inject, injectable } from 'inversify';
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IOtpRepository } from "../core/interfaces/repositories/IOtpRepository";
import { generateOTP, sendMailer, generateResetToken, sendResetMail } from "../utils/emailService";
import { AuthResult } from "../types/User";
import { IAuthService } from '../core/interfaces/services/IAuthService';
import { TYPES } from "../di/types";
import logger from '../config/logger';
import axios from 'axios';
@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.OtpRepository) private _otpRepository: IOtpRepository
  ) {}

  async registerUser(name: string, email: string, password: string): Promise<AuthResult> {
    try {
      const exitingUser = await this._userRepository.findOne({email});
      const otpSended = await this._otpRepository.findOne({email});
      if (otpSended) {
        return { success: true, message: "OTP already sent to this email" };
      }
      if (exitingUser && exitingUser.isVerified && !exitingUser.isGoogleUser) {
        return { success: false, message: "User with this email already exists" };
      }
      if (exitingUser && exitingUser.password &&exitingUser.isVerified) {
        return { success: false, message: "User with this email already exists" };
      }
      if (exitingUser && exitingUser.isGoogleUser && !exitingUser.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this._userRepository.findUserAndUpdate(exitingUser.email, {
          password: hashedPassword,
        });
        return this.generateAndSendOtp(email);
      }
      if (!exitingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this._userRepository.createUser({
          name,
          email,
          password: hashedPassword,
        });
        return this.generateAndSendOtp(email);
      }
      return { success: false, message: "Registration failed" };
    } catch (error) {
      const err= error as Error
      logger.error("Error in registerUser:", err);
      throw new Error(err.message||"Registration failed");
    }
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResult> {
    try {
      const otpData = await this._otpRepository.findOTP(email, otp);
      if (!otpData) {
        return { success: false, message: "Invalid OTP or OTP Expired" };
      }
      if (otpData.expiresAt < new Date()) {
        return { success: false, message: "OTP Expired" };
      }
      await this._otpRepository.deleteOTP(email);
      await this._userRepository.findUserAndUpdate(email, { isVerified: true });
      
      const user = await this._userRepository.findOne({email});
      if (!user) {
        return { success: false, message: "User not found" };
      }
      const userId=user._id?.toString() as string
      return { 
        success: true, 
        message: "OTP verified successfully",
        accessToken: generateAccessToken(userId, 'user'),
        refreshToken: generateRefreshToken(userId, 'user')
      };
    } catch (error) {
      const err= error as Error
      logger.error("Error in verifyOtp:", err);
      throw new Error(err.message||"OTP verification failed");
    }
  }

  async resendOtp(email: string): Promise<AuthResult> {
    try {
      const user = await this._userRepository.findOne({email});
      if (!user) {
        return { success: false, message: "User with this email does not exist" };
      }

      const otpSended = await this._otpRepository.findOne({email});
      if (otpSended) {
        return { success: true, message: "OTP already sent to this email" };
      }

      return await this.generateAndSendOtp(email);
    } catch (error) {
      const err= error as Error
      logger.error("Error in resendOtp:", err);
      throw new Error(err.message||"Failed to resend OTP");
    }
  }

  async loginUser(email: string, password: string): Promise<AuthResult> {
    try {
      const user = await this._userRepository.findOne({email});
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
      const userId=user._id?.toString() as string
      return { 
        success: true, 
        message: "Login successful",
        user: user,
        accessToken: generateAccessToken(userId, 'user'),
        refreshToken: generateRefreshToken(userId, 'user')
      };
    } catch (error) {
      const err= error as Error
      logger.error("Error in loginUser:", error);
      throw new Error(err.message||"Login failed");
    }
  }

  async findUser(id: string): Promise<AuthResult> {
    try {
      const userDetails = await this._userRepository.findById(id);
      if (!userDetails) {
        return { success: false, message: "User not found" };
      }
      return { success: true, user: userDetails };
    } catch (error) {
      const err= error as Error
      logger.error("Error in findUser:", error);
      throw new Error(err.message||"Failed to fetch user details");
    }
  }

  async saveGoogleUser(googleId: string, email: string, name: string, image: string): Promise<AuthResult> {
    try {
      const existingUser = await this._userRepository.findOne({email});
     
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
          const updateUser = await this._userRepository.findUserAndUpdate(
            existingUser.email,
            { isGoogleUser: true, googleId: googleId, profile_image: image }
          );
          if (updateUser) {
            return this.generateAuthResponse(updateUser);
          }
        }
      } else {
        const createUser = await this._userRepository.createUser({
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
      const err= error as Error
      logger.error("Error in saveGoogleUser:", error);
      throw new Error(err.message||"Google sign-in failed");
    }
  }

  async loginWithGitHub(code:string):Promise<AuthResult>{
    try {
      const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
      const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
            const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
                  client_id: GITHUB_CLIENT_ID,
                  client_secret: GITHUB_CLIENT_SECRET,
                  code: code,
              }, {
                  headers: {
                      Accept: 'application/json'
                  }
              });
            // console.log("TOken response",tokenResponse);
      
            const accessToken=tokenResponse.data.access_token
            if(!accessToken){
              throw new Error('Failed to get access token from GitHub.')
            }
            const userResponse = await axios.get("https://api.github.com/user", {
              headers: { Authorization: `token ${accessToken}` }
            });

            let userData = userResponse.data;

            // if no email, fetch from /user/emails
            if (!userData.email) {
              const emailResponse = await axios.get("https://api.github.com/user/emails", {
                headers: { Authorization: `token ${accessToken}` }
            });
console.log('github1');

          const primaryEmail = emailResponse.data.find((e: any) => e.primary && e.verified);
          userData.email = primaryEmail?.email || null;
          }
          const existingUser = await this._userRepository.findOne({email:userData.email});
          if(existingUser){
            if (existingUser.isBlocked) {
          return {
            success: false,
            message: "Admin has blocked your account"
          };
           }
           if (existingUser.isGitHubUser) {
          return this.generateAuthResponse(existingUser);
        } else {
          const updateUser = await this._userRepository.findUserAndUpdate(
            existingUser.email,
            { isGitHubUser: true,profile_image:userData.avatar_url }
          );
          if (updateUser) {
            return this.generateAuthResponse(updateUser);
          }
        }
          }else{
            const createUser=await this._userRepository.createUser({
          email:userData.email,
          name:userData.name,
          profile_image: userData.avatar_url,
          isGitHubUser: true,
          isVerified: true,
            })

            if (createUser) {
          return this.generateAuthResponse(createUser);
        }
          }
            
            // console.log('user response ',userReponse);

      return { success: false, message: "GitHub sign-in failed" };

      
    } catch (error) {
      const err=error as Error
      throw new Error(err.message)
    }

  }

  async forgetPassword(email: string): Promise<AuthResult> {
    try {
      const existingUser = await this._userRepository.findOne({email});
      
      if (!existingUser) {
        return { success: false, message: "Email not found" };
      }

      const resetToken = generateResetToken();

      const resetPasswordToken = resetToken;
     const resetPasswordExpires = new Date(Date.now() + 300000);
     const userId=existingUser._id?.toString() as string
     await this._userRepository.updateById(userId,{resetPasswordToken,resetPasswordExpires})

      await sendResetMail(email, resetToken);
      return { success: true, message: "Password reset email sent" };
    } catch (error) {
      const err= error as Error
      logger.error("Error in forgetPassword:", error);
      throw new Error(err.message||"Failed to process password reset request");
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<AuthResult> {
    try {
      const user = await this._userRepository.findOneBYToken(token);
      if (!user) {
        return { success: false, message: "Invalid or expired token" };
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const userId= user._id?.toString() as string
    await this ._userRepository.findByIdClearToken(userId, hashedPassword)
      return { success: true, message: "Password reset successful" };
    } catch (error) {
      const err= error as Error
      // logger.error("Error in resetPassword:", error);
      throw new Error(err.message||"Failed to reset password");
    }
  }

  private async generateAndSendOtp(email: string): Promise<AuthResult> {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
    await this._otpRepository.create({email, otp, expiresAt});
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