import { Request, response, Response } from "express";
import jwt,{ Jwt } from "jsonwebtoken";
import AuthService from "../services/AuthService";
import { AuthRequest } from "../types/User";
import { generateAccessToken } from "../utils/jwt";
class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const response = await AuthService.registerUser(name, email, password);
      if (response.success) {
        res.json({ success: true, message: response.message });
      } else {
        res.json({ success: false, message: response.message });
      }
      // return
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
  }

  static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      const response = await AuthService.verifyOtp(email, otp);
      console.log(response);
      if (response.success) {
        res.status(200).json(response);
      } else {
        res.json(response);
      }
    } catch (err: any) {
      console.log(err);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
     
      const response = await AuthService.loginUser(email, password);

      if (response.success) {
        res.cookie("accessToken", response.accessToken, {
          httpOnly: true,  // Prevents JavaScript access (helps against XSS)
          secure: process.env.NODE_ENV === "production", 
          sameSite: "strict",
          maxAge: 15 * 60 * 1000 // 15 minutes
        });

        // Store Refresh Token in Cookie
        res.cookie("refreshToken", response.refreshToken, {
          httpOnly: true,  // Cannot be accessed via JavaScript
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({ success: true, user: response.user });
        return;
      }
      res.json(response);
      return;
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
  static async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      
      const { email } = req.body;
      const response = await AuthService.resendOtp(email);
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
      return;
    }
  }
  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req?.user?.userId;
    
    if (!userId) {
      res.json({ success: false, message: "Unauthorized" });
      return;
    }
    try {
      const response = await AuthService.findUser(userId);
  
      res.json(response);
      return;
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  static async logoutUser(req: AuthRequest, res: Response) {
    console.log("logout");
    try {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.json({ success: true, message: "Logged out successfully" });
    } catch (err: any) {
      res.json({ err: err.message });
    }
  }
  static async googleSignIn(req:Request,res:Response){
    try {
      const {id,email,name,picture}=req.body.data
     
      const response=await AuthService.saveGoogleUser(id,email,name,picture)
      if(response?.success){
        res.cookie("accessToken", response.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.cookie('refreshToken',response.refreshToken,{
          httpOnly:true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        res.status(200).json({ success: true, user: response.user })
        return;
      }
      res.json(response)
      
      
    } catch (err:any) {
      console.log('google signin error',err)
    }
    
  }
  static async forgetPassword(req:Request,res:Response){
      const {email}=req.body
      const response= await AuthService.forgetPassword(email)
      res.json(response)
  }
  
  static async resetPassword(req:Request,res:Response){
    const {token,newPassword}=req.body;
    const response= await AuthService.resetPassword(token,newPassword)
    res.json(response)
  }

}

export default AuthController;
