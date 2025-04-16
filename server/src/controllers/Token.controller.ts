import { injectable } from 'inversify';
import { Request, Response } from "express";

import { HttpStatus } from "../types/httpStatus";
import { ITokenController } from "../core/interfaces/controllers/ITokenController";
import { generateAccessToken, generateRefreshToken, TokenVerify } from "../utils/jwt";
@injectable()
export class TokenController implements ITokenController {
    private readonly refreshTokenSecret: string;
    private readonly isProduction: boolean;
    constructor() {
        this.refreshTokenSecret = process.env.REFRESH_SECRET as string;
        this.isProduction = process.env.NODE_ENV === "production";
    }
    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const oldToken = req.cookies.refreshToken;
            if (!oldToken) {
                this.sendErrorResponse(res, HttpStatus.BAD_REQUEST, "Unauthorized: No refresh token");
                return;
            }
    
            const decoded: any = await TokenVerify(oldToken, this.refreshTokenSecret);
    
            if (!decoded.userId || !decoded.role) {
                this.sendErrorResponse(res, HttpStatus.BAD_REQUEST, "Invalid token payload");
                return;
            }
            // ✅ Generate new tokens
            const newAccessToken = generateAccessToken(decoded.userId, decoded.role, decoded.expertId);
            const newRefreshToken = generateRefreshToken(decoded.userId, decoded.role, decoded.expertId);
            // ✅ Set both cookies
            this.setAccessTokenCookie(res, newAccessToken);
            this.setRefreshTokenCookie(res, newRefreshToken);
    
            res.status(HttpStatus.OK).json({
                success: true,
                accessToken: newAccessToken
            });
    
        } catch (err) {
            this.sendErrorResponse(res, HttpStatus.FORBIDDEN, "Invalid refresh token");
        }
    }
    

    private setAccessTokenCookie(res: Response, token: string): void {
        res.cookie("accessToken", token, {
            httpOnly: false,
            secure: this.isProduction,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
    }
    private setRefreshTokenCookie(res: Response, token: string): void {
        res.cookie("refreshToken", token, {
            httpOnly: true,
            secure: this.isProduction,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
    private sendErrorResponse(res: Response, status: HttpStatus, message: string): void {
        res.status(status).json({
            success: false,
            message
        });
    }
}

// Export instance if needed
export const tokenController = new TokenController();
