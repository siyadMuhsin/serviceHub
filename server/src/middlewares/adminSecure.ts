import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { AuthRequest } from "../types/User";
import { HttpStatus } from "../types/httpStatus";
import logger from "../config/logger";

export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) {
  res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: No token provided"
    });
    return
  }

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.ACCESS_SECRET as string
    );

    if (decoded.role !== "admin") {
      res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: "Forbidden: Admins only"
      });
      return
    }

    req.admin = decoded;
    next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Access token expired"
      });
      return
    }

    logger.error("JWT verification error:", error);

     res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: Invalid token"
    });
  }
};
