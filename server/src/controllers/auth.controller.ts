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
    @inject(TYPES.AuthService) private _authService: IAuthService
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const response = await this._authService.registerUser(name, email, password);
      this.sendResponse(res, response, HttpStatus.CREATED, HttpStatus.BAD_REQUEST);
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const response = await this._authService.verifyOtp(email, otp);
      this.sendResponse(res, response, HttpStatus.OK, HttpStatus.BAD_REQUEST);
    } catch (error) {
      const err=error as Error
      res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const response = await this._authService.loginUser(email, password);

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
    } catch (error) {
      const err=error as Error
      res.status(HttpStatus.BAD_REQUEST).json({ 
        success: false,
        message: err.message 
      });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const response = await this._authService.resendOtp(email);
      this.sendResponse(res, response, HttpStatus.OK, HttpStatus.BAD_REQUEST);
    } catch (error) {
      const err=error as Error
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
      const response = await this._authService.findUser(userId);
      this.sendResponse(res, {...response,role:req.user.role}, HttpStatus.OK, HttpStatus.INTERNAL_SERVER_ERROR);
    } catch (error) {
      const err=error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: err.message || "Internal Server Error" 
      });
    }
  }

  async logoutUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log('logouting expert');
      
      res.clearCookie('accessToken',{
        httpOnly:true,
        secure:true,
        sameSite:'none'
      });
      res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:true,
        sameSite:'none'
      });
      res.status(HttpStatus.OK).json({ 
        success: true, 
        message: "Logged out successfully" 
      });
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        message: err.message 
      });
    }
  }

  async googleSignIn(req: Request, res: Response): Promise<void> {
    try {
      const { id, email, name, picture } = req.body.data;
      const response = await this._authService.saveGoogleUser(id, email, name, picture);

      if (response?.success && response.accessToken && response.refreshToken) {
        this.setAuthCookies(res, response.accessToken, response.refreshToken);
        res.status(HttpStatus.OK).json({ 
          success: true, 
          user: response.user 
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json(response);
      }
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:err.message ||  "Google sign-in failed"
      });
    }
  }

  async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const response = await this._authService.forgetPassword(email);
      this.sendResponse(res, response, HttpStatus.OK, HttpStatus.BAD_REQUEST);
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: err.message
      });
    }
  }
  
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      const response = await this._authService.resetPassword(token, newPassword);
      this.sendResponse(res, response, HttpStatus.OK, HttpStatus.BAD_REQUEST);
    } catch (error) {
      const err= error as Error
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
      secure: true,
      sameSite: "none" as const ,
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
}