import { injectable } from 'inversify';
import { Request, Response } from "express";
import { generateAccessToken, TokenVerify } from "../utils/jwt";
import { HttpStatus } from "../types/httpStatus";
import { ITokenController } from "../core/interfaces/controllers/ITokenController";

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
            const token = req.cookies.refreshToken;
            if (!token) {
                return this.sendErrorResponse(res, HttpStatus.BAD_REQUEST, "Unauthorized: No refresh token");
            }

            const decoded: any = await TokenVerify(token, this.refreshTokenSecret);

            if (!decoded.userId || !decoded.role) {
                return this.sendErrorResponse(res, HttpStatus.BAD_REQUEST, "Invalid token payload");
            }

            const newAccessToken = generateAccessToken(decoded.userId, decoded.role);

            this.setAccessTokenCookie(res, newAccessToken);

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
            httpOnly: true,
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

// Export instance if needed
export const tokenController = new TokenController();
