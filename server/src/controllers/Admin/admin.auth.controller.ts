import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { IAdminService } from "../../core/interfaces/services/IAdminService";
import { AuthRequest } from "../../types/User";
import { HttpStatus } from "../../types/httpStatus";
import { IAdminAuthController } from "../../core/interfaces/controllers/IAdminAuthController";
import { TYPES } from "../../di/types";

@injectable()
export class AdminAuthController implements IAdminAuthController {
    constructor(
        @inject(TYPES.AdminService) private adminService: IAdminService
    ) {}

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const response = await this.adminService.loginAdmin(email, password);
            
            if (response.success && response.accessToken && response.refreshToken) {
                this.setAuthCookies(res, response.accessToken, response.refreshToken);
                res.status(HttpStatus.OK).json({ 
                    success: true, 
                    message: "Login successful" 
                });
            } else {
                res.status(HttpStatus.UNAUTHORIZED).json(response);
            }
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie("adminAccessToken");
        res.clearCookie("adminRefreshToken");
        res.json({ success: true, message: "Logged out successfully" });
    }
    
    async checkAdmin(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.admin) {
                res.json({ success: false, message: "Unauthorized" });
                return;
            }
            res.status(HttpStatus.OK).json({ success: true, admin: req.admin });
        } catch (error) {
            console.error("Error checking admin:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
        res.cookie("adminAccessToken", accessToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production" 
        });
        res.cookie("adminRefreshToken", refreshToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production" 
        });
    }
}