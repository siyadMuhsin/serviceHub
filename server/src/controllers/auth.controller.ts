import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { IAuthService } from "../core/interfaces/services/IAuthService";
import { AuthRequest } from "../types/User";
import { HttpStatus } from "../types/httpStatus";
import { IAuthController } from "../core/interfaces/controllers/IAuthController";
import { TYPES } from "../di/types";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const response = await this.authService.registerUser(name, email, password);
      this.sendResponse(res, response, HttpStatus.CREATED, HttpStatus.BAD_REQUEST);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const response = await this.authService.verifyOtp(email, otp);
      this.sendResponse(res, response, HttpStatus.OK, HttpStatus.BAD_REQUEST);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const response = await this.authService.loginUser(email, password);

      if (response.success && response.accessToken && response.refreshToken) {
        this.setAuthCookies(res, response.accessToken, response.refreshToken);
        res.status(HttpStatus.OK).json({ 
          success: true, 
          user: response.user 
        });
      } else {
        res.status(response.message === "Password is incorrect" ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST)
           .json(response);
      }
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false,
        message: err.message 
      });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const response = await this.authService.resendOtp(email);
      this.sendResponse(res, response, HttpStatus.OK, HttpStatus.BAD_REQUEST);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req?.user?.userId;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ 
        success: false, 
        message: "Unauthorized" 
      });
      return;
    }
    try {
      const response = await this.authService.findUser(userId);
      console.log(response)
      this.sendResponse(res, response, HttpStatus.OK, HttpStatus.INTERNAL_SERVER_ERROR);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
  }

  async logoutUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(HttpStatus.OK).json({ 
        success: true, 
        message: "Logged out successfully" 
      });
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        message: err.message 
      });
    }
  }

  async googleSignIn(req: Request, res: Response): Promise<void> {
    try {
      const { id, email, name, picture } = req.body.data;
      const response = await this.authService.saveGoogleUser(id, email, name, picture);

      if (response?.success && response.accessToken && response.refreshToken) {
        this.setAuthCookies(res, response.accessToken, response.refreshToken);
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

  async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const response = await this.authService.forgetPassword(email);
      this.sendResponse(res, response, HttpStatus.OK, HttpStatus.BAD_REQUEST);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: err.message
      });
    }
  }
  
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      const response = await this.authService.resetPassword(token, newPassword);
      this.sendResponse(res, response, HttpStatus.OK, HttpStatus.BAD_REQUEST);
    } catch (err: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: err.message
      });
    }
  }

  private sendResponse(
    res: Response, 
    response: any, 
    successStatus: number, 
    errorStatus: number
  ): void {
    if (response?.success) {
      res.status(successStatus).json(response);
    } else {
      res.status(errorStatus).json(response);
    }
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,httpOnly:false,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
}