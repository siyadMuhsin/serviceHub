import { Request, Response, NextFunction, response } from "express";
import dotenv from 'dotenv'
import { AuthRequest } from "../types/User";
import jwt ,{JwtPayload}from "jsonwebtoken";
import { TokenVerify } from "../utils/jwt";
import servicesService from "../services/Admin/services.service";
import userService from "../services/Admin/user.service";
import { HttpStatus } from "../types/httpStatus";

dotenv.config()

const verifyToken =async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken; // Get token from cookie
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized: No token provided" });
      return
    }

    const secretKey = process.env.ACCESS_SECRET;
    if (!secretKey) {
      console.error("Missing ACCESS_SECRET in environment variables");
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
       return
    }

    const decoded =await TokenVerify(token,secretKey)
    const response =await userService.checkBloked(decoded.userId)
    console.log(response)
    if (!response){
      res.status(HttpStatus.FORBIDDEN).json({ success: false, message: "Your account has been blocked by the admin." });
      return 
    }
  
    req.user = decoded; // Attach user info to request object

    next(); // Move to the next middleware
  } catch (err) {
     res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

export const verifyExpert=async(req:AuthRequest,res:Response,next:NextFunction)=>{
  try {
    const token = req.cookies?.accessToken
    if(!token){
      res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized: No token provided" });
      return
    }
    const secretKey = process.env.ACCESS_SECRET;

    if (!secretKey) {
      console.error("Missing ACCESS_SECRET in environment variables");
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
       return
    }
    const decoded = await TokenVerify(token, secretKey); // Ensure type consistency
    if (decoded.role !== 'expert' || !decoded.expertId) {
      res.status(HttpStatus.FORBIDDEN).json({ success: false, message: 'Access denied: Not an expert' });
      return
    }
    req.expert = decoded; // Attach user info to request object
    next()
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Unauthorized: Invalid token" });
    
  }

}


export default verifyToken;