import { AuthResult } from "../../../types/User";

export interface IAuthService {
  registerUser(name: string, email: string, password: string): Promise<AuthResult>;
  verifyOtp(email: string, otp: string): Promise<AuthResult>;
  resendOtp(email: string): Promise<AuthResult>;
  loginUser(email: string, password: string): Promise<AuthResult>;
  findUser(id: string): Promise<AuthResult>;
  saveGoogleUser(googleId: string, email: string, name: string, image: string): Promise<AuthResult>;
  loginWithGitHub(code:string):Promise<AuthResult>
  forgetPassword(email: string): Promise<AuthResult>;
  resetPassword(token: string, newPassword: string): Promise<AuthResult>;
}