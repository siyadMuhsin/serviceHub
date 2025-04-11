import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/User";
import { HttpStatus } from "../types/httpStatus";
import { IAuthMiddleware } from '../core/interfaces/middleware/IAuthMiddleware';

import { AuthMiddlewareService } from "../services/middleware/authMiddleware.service";
import { TYPES } from "../di/types";

@injectable()
export class AuthMiddleware implements IAuthMiddleware {
    constructor(
        @inject(TYPES.AuthMiddlewareService) private authMiddlewareService: AuthMiddlewareService
    ) {}
    async verifyToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = this.getTokenFromRequest(req);
            if (!token) {
                this.sendErrorResponse(res, HttpStatus.UNAUTHORIZED, "Unauthorized: No token provided");
                return;
            }

            const decoded = await this.authMiddlewareService.verifyToken(token);
            if(decoded.role!=='user'){
                this.sendErrorResponse(res,HttpStatus.FORBIDDEN,"Unauthorized")
                return
            }
            const isBlocked = await this.authMiddlewareService.checkUserBlocked(decoded.userId);
          
            if (isBlocked) {
              res.clearCookie('accessToken')
              res.clearCookie('refreshToken')
                this.sendErrorResponse(res, HttpStatus.FORBIDDEN, "Your account has been blocked by the admin.");
                return;
            }
            req.user = decoded;
            next();
        } catch (err) {
            this.sendErrorResponse(res, HttpStatus.BAD_REQUEST, "Unauthorized: Invalid token");
        }
    }

    async verifyExpert(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = this.getTokenFromRequest(req);
            if (!token) {
                this.sendErrorResponse(res, HttpStatus.UNAUTHORIZED, "Unauthorized: No token provided");
                return;
            }

            const decoded = await this.authMiddlewareService.verifyToken(token);
            if (decoded.role !== 'expert' || !decoded.expertId) {
                this.sendErrorResponse(res, HttpStatus.FORBIDDEN, 'Access denied: Not an expert');
                return;
            }
            const isBlocked = await this.authMiddlewareService.checkExpertBlocked(decoded.expertId);
            if(isBlocked){
                res.clearCookie('accessToken')
                res.clearCookie('refreshToken')
                  this.sendErrorResponse(res, HttpStatus.FORBIDDEN, "Your account has been blocked by the admin.");
                  return;

            }

            req.expert = decoded;
            next();
        } catch (error) {
            this.sendErrorResponse(res, HttpStatus.BAD_REQUEST, "Unauthorized: Invalid token");
        }
    }

    private getTokenFromRequest(req: Request): string | null {
        return req.cookies?.accessToken || 
               req.headers['authorization']?.split(' ')[1] || 
               null;
    }

    private sendErrorResponse(res: Response, status: HttpStatus, message: string): void {
        res.status(status).json({ success: false, message });
    }
}