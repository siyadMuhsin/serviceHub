import { Request, Response } from "express";
import { AuthRequest } from "../../../types/User";

export interface IAdminAuthController {
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    checkAdmin(req: AuthRequest, res: Response): Promise<void>;
}