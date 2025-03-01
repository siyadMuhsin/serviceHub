import { Request, Response } from "express";
import adminService from "../../services/Admin/admin.service";

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
}

export default new AdminController();
