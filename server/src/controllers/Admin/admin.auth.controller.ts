import { Request, Response } from "express";
import adminService from "../../services/Admin/admin.service";
import { AuthRequest } from "../../types/User";
import { HttpStatus } from "../../types/httpStatus";
class AdminController {
  async login(req: Request, res: Response):Promise<void> {
    
    try {
      const { email, password } = req.body;
      const response = await adminService.loginAdmin(email, password);
      if(response.success){
        res.cookie("adminAccessToken", 
          response.accessToken,
           { httpOnly: true, secure: false });
        
        res.cookie('adminRefreshToken',
          response.refreshToken,
          { httpOnly: true, secure: false })

        res.status(HttpStatus.OK).json({ success: true, message: "Login successful"})
        return;
      }
      res.json(response)
      return 
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("adminAccessToken");
    res.clearCookie('adminRefreshToken')
    res.json({ success: true, message: "Logged out successfully" });
  }
  
  async checkAdmin(req:AuthRequest,res:Response){
    
     try {
      if (!req.admin) {
        res.json({ success: false, message: "Unauthorized" });
        return
      }
       res.status(HttpStatus.OK).json({ success: true, admin: req.admin });
    } catch (error) {
      console.error("Error checking admin:", error);
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
    

  }
}

export default new AdminController();
