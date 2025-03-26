import { Request, Response } from "express";
import { generateAccessToken, TokenVerify } from "../utils/jwt";
import { HttpStatus } from "../types/httpStatus";

class TokenController {
  async userRefreshToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Unauthorized" });
        return;
      }
      const decoded: any = await TokenVerify(
        token,
        process.env.REFRESH_SECRET as string
      );
      const newAccessToken = generateAccessToken(decoded.userId, "user");
      res.cookie("accessToken", newAccessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(HttpStatus.OK).json({ success: true, accessToken: newAccessToken });
      return;
    } catch (err) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ success: false, message: "Invalid refresh token" });
      return;
    }
  }


  async adminRefreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies.adminRefreshToken;

      if (!token) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Unauthorized" });
        return;
      }

      const decoded: any = await TokenVerify(
        token,
        process.env.REFRESH_SECRET as string
      );
      const newAccessToken = generateAccessToken(decoded.userId, "admin");

      res.cookie("adminAccessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      res.status(HttpStatus.OK).json({ success: true, accessToken: newAccessToken });
      return;
    } catch (err) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ success: false, message: "Invalid refresh token" });
      return;
    }
  }
}

export default new TokenController();
