import { Request } from "express";

// declare module "express" {
//   interface Request {
//     user?: string | any; 
//   }
// }
export interface AuthRequest extends Request {
  user?: any; // You can replace `any` with a proper user type if available
  admin?:any;
}