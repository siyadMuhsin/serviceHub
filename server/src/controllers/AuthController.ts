import { Request, response, Response } from "express";
import AuthService from "../services/AuthService";
import { AuthRequest } from "../types/User";
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
        res.cookie("token", response.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
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
      console.log(response);
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
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
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
        res.cookie("token", response.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.status(200).json({ success: true, user: response.user })
        return;
      }
      res.json(response)
      
      
    } catch (err:any) {
      
    }
    
  }
}

export default AuthController;
