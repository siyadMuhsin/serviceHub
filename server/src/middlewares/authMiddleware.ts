import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'
import { AuthRequest } from "../types/User";
import jwt ,{JwtPayload}from "jsonwebtoken";
import { TokenVerify } from "../utils/jwt";

dotenv.config()

// interface AuthRequest extends Request {
//   user?: any; // You can replace `any` with a proper user type if available
// }


const verifyToken =async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('verify token')
    const token = req.cookies?.accessToken; // Get token from cookie
    if (!token) {
      // creating new access token

      res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
      return
    }

    const secretKey = process.env.ACCESS_SECRET;
    if (!secretKey) {
      console.error("Missing ACCESS_SECRET in environment variables");
       res.status(500).json({ success: false, message: "Internal Server Error" });
       return
    }

    const decoded =await TokenVerify(token,secretKey)
  
    req.user = decoded; // Attach user info to request object

    next(); // Move to the next middleware
  } catch (err) {
     res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

export const verifyExpert=async(req:AuthRequest,res:Response,next:NextFunction)=>{
  try {
    const token = req.cookies?.accessToken
    if(!token){
      res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
      return
    }
    const secretKey = process.env.ACCESS_SECRET;

    if (!secretKey) {
      console.error("Missing ACCESS_SECRET in environment variables");
       res.status(500).json({ success: false, message: "Internal Server Error" });
       return
    }
    const decoded = await TokenVerify(token, secretKey); // Ensure type consistency
    if (decoded.role !== 'expert' || !decoded.expertId) {
      return res.status(403).json({ success: false, message: 'Access denied: Not an expert' });
    }
    req.expert = decoded; // Attach user info to request object
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    
  }

}


export default verifyToken;