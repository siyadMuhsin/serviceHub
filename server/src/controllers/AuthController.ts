import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;
            
            
            const response = await AuthService.registerUser(name, email, password);
            if(response.success){
                res.json({ success: true, message: response.message });
            }else{
                res.json({ success: false, message: response.message });
            }
            
            // return
        } catch (error: any) {
             res.status(400).json({ success: false, message: error.message });
             return
        }
    }

    static async verifyOtp(req:Request,res:Response):Promise<void>{
        try{
            const {email,otp}=req.body;
          
            const response = await AuthService.verifyOtp(email,otp);
            console.log(response)
            if(response.success){
              res.status(200).json(response)
            }else{
                res.json(response)
            }
        }catch(err:any){
            console.log(err)
            res.status(400).json({success:false,message:err.message})

        }

    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const response = await AuthService.loginUser(email, password);
            if(response.success){
                res.status(200).json({ message: 'User logged in', user: response.user, token: response.token });
                return
            }
            res.status(400).json({ message: response.message });
            return
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
    static async resendOtp(req:Request,res:Response):Promise<void>{
        try{
            console.log(req.body)
            const {email}=req.body;
            const response = await AuthService.resendOtp(email)
                res.json(response)
        }catch(err:any){
            res.status(400).json({success:false,message:err.message})
            return
        }
    }
}

export default AuthController;