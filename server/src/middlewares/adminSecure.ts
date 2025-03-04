import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/User";

export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.adminAccessToken;
 console.log(token)
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
