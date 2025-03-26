import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/User";
import { HttpStatus } from "../types/httpStatus";

export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.adminAccessToken;
  if (!token) {
    res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized: No token provided" });
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
