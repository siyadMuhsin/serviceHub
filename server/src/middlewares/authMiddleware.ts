import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'
import { AuthRequest } from "../types/User";
import jwt from "jsonwebtoken";
dotenv.config()

// interface AuthRequest extends Request {
//   user?: any; // You can replace `any` with a proper user type if available
// }


const verifyToken = (req: AuthRequest, res: Response, next: NextFunction):void => {
  const token = req.cookies?.token; // Get the token from the cookie

  if (!token) {
     res.json({ success: false, message: "Unauthorized: No token provided" });
     return;
  }

  const secretKey:string|undefined=process.env.JWT_SECRET
  try {
    if(secretKey){
     
        const decoded = jwt.verify(token,secretKey ); 
        req.user = decoded ; // Attach the decoded user to the request object
    }
    
    next();
  } catch (err) {
     res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
     return
  }
};

export default verifyToken;