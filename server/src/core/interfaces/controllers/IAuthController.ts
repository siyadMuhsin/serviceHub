import { Request, Response } from "express";
import { AuthRequest } from "../../../types/User";
// import { HttpStatus } from "../../types/httpStatus";

export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  logoutUser(req: AuthRequest, res: Response): Promise<void>;
  getCurrentUser(req: AuthRequest, res: Response): Promise<void>;
  googleSignIn(req: Request, res: Response): Promise<void>;
  forgetPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
}