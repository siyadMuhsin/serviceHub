import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../../types/User";

export interface IAuthMiddleware {
    verifyToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    verifyExpert(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}