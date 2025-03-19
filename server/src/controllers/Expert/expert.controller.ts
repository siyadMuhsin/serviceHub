import { Request, Response } from "express";
import ExpertService from "../../services/Expert/expert.service";
import { AuthRequest } from "../../types/User";
import expertService from "../../services/Expert/expert.service";
class ExpertController {
  async createExpert(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        console.log("file not found");
        res
          .status(400)
          .json({ success: false, error: "Certificate file is required!" });
        return;
      }
      const expert = await ExpertService.createExpert(
        req.body,
        req.file,
        req.user.userId
      );
      res
        .status(201)
        .json({
          success: true,
          message: "Expert created successfully",
          expert,
        });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getExperts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.filter as string;
      const search = req.query.search as string;
      const response = await ExpertService.getExpertBy_limit(
        page,
        limit,
        filter,
        search
      );
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      console.error("Error fetching experts:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async actionChange(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action } = req.body;
      const validActions = ["approved", "rejected"]; // Add valid actions as needed
      if (!validActions.includes(action)) {
        res.status(400).json({ success: false, message: "Invalid action" });
        return;
      }
      if (!id || !action) {
        res
          .status(400)
          .json({ success: false, message: "Missing required parameters" });
        return;
      }
      const response = await expertService.actionChange(id, action);

      res.status(response?.success ? 200 : 400).json(response);
    } catch (error) {
      console.error("Error in actionChange:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }
  }

  async blockAndUnlockExpert(req: Request, res: Response) {
    try {
        
      const { id } = req.params;
      const { active } = req.body;
      
      if (!id || typeof active !=='boolean') {
        res
          .status(400)
          .json({ success: false, message: "Missing or invalid parameters" });
        return;
      }
      const response = await ExpertService.block_unblock(id, active);
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      console.error("Error in blockAndUnlockExpert:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }
  }
  async getExpertData(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await expertService.getExpertData(id);
      res.status(response.success ? 200 : 400).json(response);
      return;
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }
  }

  async switch_expert(req:AuthRequest,res:Response){
    try {
        const userId = req.user?.userId; // Ensure userId is extracted correctly
        if (!userId) {
             res.status(400).json({ success: false, message: "User not found" });
             return
        }
        const response = await expertService.switch_expert(userId);
       res.status(response.success?200:400).json(response)
    } catch (error) {
        console.error("Error in switch_expert controller:", error);
         res.status(500).json({ success: false, message: "Internal server error" });
    }

  }

}
export default new ExpertController();
