import { Request, Response } from "express";
import adminService from "../../services/Admin/admin.service";
import { AuthRequest } from "../../types/User";

class AdminController {
  async login(req: Request, res: Response):Promise<void> {
    
    try {
      const { email, password } = req.body;
      const response = await adminService.loginAdmin(email, password);
      if(response.success){
        res.cookie("adminToken", response.token, { httpOnly: true, secure: false });
        res.json({ success: true, message: "Login successful"})
        return
      }
      res.json(response)
      return 
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("adminToken");
    res.json({ success: true, message: "Logged out successfully" });
  }
  
  async checkAdmin(req:AuthRequest,res:Response){
     try {
      if (!req.admin) {
        res.json({ success: false, message: "Unauthorized" });
        return
      }
       res.status(200).json({ success: true, admin: req.admin });
    } catch (error) {
      console.error("Error checking admin:", error);
       res.json({ success: false, message: "Internal server error" });
    }
    

  }
}

export default new AdminController();
