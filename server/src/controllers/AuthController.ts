import { Request, Response } from "express";
import jwt, { Jwt } from "jsonwebtoken";
import AuthService from "../services/AuthService";
import { AuthRequest } from "../types/User";
import { generateAccessToken } from "../utils/jwt";
import { HttpStatus } from "../types/httpStatus"; // Adjust the import path

class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const response = await AuthService.registerUser(name, email, password);
      if (response.success) {
        res.status(HttpStatus.CREATED).json({ 
          success: true, 
          message: response.message 
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          success: false, 
          message: response.message 
        });
      }
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const response = await AuthService.verifyOtp(email, otp);

      if (response.success) {
        res.status(HttpStatus.OK).json(response);
      } else {
        res.status(HttpStatus.BAD_REQUEST).json(response);
      }
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const response = await AuthService.loginUser(email, password);

      if (response.success) {
        res.cookie("accessToken", response.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", response.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(HttpStatus.OK).json({ 
          success: true, 
          user: response.user 
        });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json(response);
      }
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ 
        error: err.message 
      });
    }
  }

  static async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const response = await AuthService.resendOtp(email);
      res.status(HttpStatus.OK).json(response);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req?.user?.userId;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ 
        success: false, 
        message: "Unauthorized" 
      });
      return;
    }

    try {
      const response = await AuthService.findUser(userId);
      res.status(HttpStatus.OK).json(response);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
  }

  static async logoutUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(HttpStatus.OK).json({ 
        success: true, 
        message: "Logged out successfully" 
      });
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        error: err.message 
      });
    }
  }

  static async googleSignIn(req: Request, res: Response): Promise<void> {
    try {
      const { id, email, name, picture } = req.body.data;
      const response = await AuthService.saveGoogleUser(id, email, name, picture);

      if (response?.success) {
        res.cookie("accessToken", response.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        res.cookie('refreshToken', response.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        res.status(HttpStatus.OK).json({ 
          success: true, 
          user: response.user 
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json(response);
      }
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Google sign-in failed"
      });
    }
  }

  static async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const response = await AuthService.forgetPassword(email);
      res.status(HttpStatus.OK).json(response);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: err.message
      });
    }
  }
  
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      const response = await AuthService.resetPassword(token, newPassword);
      res.status(HttpStatus.OK).json(response);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: err.message
      });
    }
  }
}

export default AuthController;