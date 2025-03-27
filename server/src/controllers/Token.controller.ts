import { injectable } from 'inversify';
import { Request, Response } from "express";
import { generateAccessToken, TokenVerify } from "../utils/jwt";
import { HttpStatus } from "../types/httpStatus";
import { ITokenController } from "../core/interfaces/controllers/ITokenController";
import { TYPES } from "../di/types";

@injectable()
export class TokenController implements ITokenController {
    private readonly refreshTokenSecret: string;
    private readonly isProduction: boolean;

    constructor() {
        this.refreshTokenSecret = process.env.REFRESH_SECRET as string;
        this.isProduction = process.env.NODE_ENV === "production";
    }

    async userRefreshToken(req: Request, res: Response): Promise<void> {
        await this.handleRefreshToken(
            req,
            res,
            'refreshToken',
            'accessToken',
            'user'
        );
    }

    async adminRefreshToken(req: Request, res: Response): Promise<void> {
        await this.handleRefreshToken(
            req,
            res,
            'adminRefreshToken',
            'adminAccessToken',
            'admin'
        );
    }

    private async handleRefreshToken(
        req: Request,
        res: Response,
        inputCookieName: string,
        outputCookieName: string,
        role: string
    ): Promise<void> {
        try {
            const token = req.cookies[inputCookieName];
            if (!token) {
                this.sendErrorResponse(res, HttpStatus.BAD_REQUEST, "Unauthorized");
                return;
            }

            const decoded: any = await TokenVerify(token, this.refreshTokenSecret);
            const newAccessToken = generateAccessToken(decoded.userId, role);

            this.setAccessTokenCookie(res, outputCookieName, newAccessToken);
            
            res.status(HttpStatus.OK).json({ 
                success: true, 
                accessToken: newAccessToken 
            });
        } catch (err) {
            this.sendErrorResponse(res, HttpStatus.FORBIDDEN, "Invalid refresh token");
        }
    }

    private setAccessTokenCookie(res: Response, name: string, token: string): void {
        res.cookie(name, token, {
            httpOnly: name.includes('admin'), // Only httpOnly for admin tokens
            secure: this.isProduction,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
    }

    private sendErrorResponse(res: Response, status: HttpStatus, message: string): void {
        res.status(status).json({ 
            success: false, 
            message 
        });
    }
}

// Export instance for non-DI usage
export const tokenController = new TokenController();