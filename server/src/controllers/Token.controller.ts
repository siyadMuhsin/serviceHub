import { injectable } from 'inversify';
import { Request, Response } from "express";

import { HttpStatus } from "../types/httpStatus";
import { ITokenController } from "../core/interfaces/controllers/ITokenController";
import { generateAccessToken, generateRefreshToken, TokenPayload, TokenVerify } from "../utils/jwt";
import { error } from 'console';
@injectable()
export class TokenController implements ITokenController {
    private readonly _refreshTokenSecret: string;
    private readonly _isProduction: boolean;
    constructor() {
        this._refreshTokenSecret = process.env.REFRESH_SECRET as string;
        this._isProduction = process.env.NODE_ENV === "production";
    }
    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const oldToken = req.cookies.refreshToken;
            if (!oldToken) {
                this.sendErrorResponse(res, HttpStatus.BAD_REQUEST, "Unauthorized: No refresh token");
                return;
            }
    
            const decoded: TokenPayload = await TokenVerify(oldToken, this._refreshTokenSecret);
    
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
    
        } catch (error) {
            const err= error as Error
            this.sendErrorResponse(res, HttpStatus.FORBIDDEN,err.message|| "Invalid refresh token");
        }
    }
    

    private setAccessTokenCookie(res: Response, token: string): void {
        res.cookie("accessToken", token, {
            httpOnly: false,
            secure: this._isProduction,
            sameSite: "none",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
    }
    private setRefreshTokenCookie(res: Response, token: string): void {
        res.cookie("refreshToken", token, {
            httpOnly: true,
            secure: this._isProduction,
            sameSite: "none",
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
