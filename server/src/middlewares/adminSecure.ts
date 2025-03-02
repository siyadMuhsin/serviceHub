import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/User";

export const verifyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.adminToken;
  if (!token) {
    res.json({ success: false, message: "Unauthorized" });
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.admin = decoded;
    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid token" });
  }
};
