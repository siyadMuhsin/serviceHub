import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IAuthService } from "../core/interfaces/services/IAuthService";
import { AuthRequest } from "../types/User";
import { HttpStatus } from "../types/httpStatus";
import { IAuthController } from "../core/interfaces/controllers/IAuthController";
import { TYPES } from "../di/types";
import logger from "../config/logger";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  private sendResponse(
    res: Response,
    response: any,
    successStatus: number
  ): void {
    const status = response?.success ? successStatus : HttpStatus.BAD_REQUEST;
    res.status(status).json(response);
  }

  private handleError(
    res: Response,
    error: unknown,
    status = HttpStatus.BAD_REQUEST
  ): void {
    const err = error as Error;
    logger.error(`Auth Error: ${err.message}`);
    res.status(status).json({
      success: false,
      message: err.message,
    });
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const result = await this.authService.registerUser(name, email, password);
      this.sendResponse(res, result, HttpStatus.CREATED);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await this.authService.verifyOtp(email, otp);
      this.sendResponse(res, result, HttpStatus.OK);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.authService.loginUser(email, password);
      if (result.success && result.accessToken && result.refreshToken) {
        this.setAuthCookies(res, result.accessToken, result.refreshToken);
        res.status(HttpStatus.OK).json({ success: true, user: result.user });
      } else {
        const status =
          result.message === "Password is incorrect"
            ? HttpStatus.UNAUTHORIZED
            : HttpStatus.BAD_REQUEST;
        res.status(status).json(result);
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await this.authService.resendOtp(email);
      this.sendResponse(res, result, HttpStatus.OK);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req?.user?.userId;
    if (!userId) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: "Unauthorized" });
      return;
    }
    try {
      const result = await this.authService.findUser(userId);
      this.sendResponse(res, { ...result, role: req.user.role }, HttpStatus.OK);
    } catch (error) {
      this.handleError(res, error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async logoutUser(_req: AuthRequest, res: Response): Promise<void> {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      this.handleError(res, error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async googleSignIn(req: Request, res: Response): Promise<void> {
    try {
      const { id, email, name, picture } = req.body.data;
      const result = await this.authService.saveGoogleUser(
        id,
        email,
        name,
        picture
      );

      if (result?.success && result.accessToken && result.refreshToken) {
        this.setAuthCookies(res, result.accessToken, result.refreshToken);
        res.status(HttpStatus.OK).json({
          success: true,
          user: result.user,
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json(result);
      }
    } catch (error) {
      this.handleError(res, error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await this.authService.forgetPassword(email);
      this.sendResponse(res, result, HttpStatus.OK);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!newPassword?.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Please enter a valid password",
        });
        return;
      }
      const result = await this.authService.resetPassword(token, newPassword);
      this.sendResponse(res, result, HttpStatus.OK);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
