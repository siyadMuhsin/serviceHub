import { Request, Response } from "express";
import ExpertService from "../../services/Expert/expert.service";
import { AuthRequest } from "../../types/User";
import expertService from "../../services/Expert/expert.service";
import { setAuthCookies } from "../../utils/setAuthCookies "
import { HttpStatus } from "../../types/httpStatus"; // Adjust the import path

class ExpertController {
  async createExpert(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          success: false, 
          error: "Certificate file is required!" 
        });
        return;
      }
      const expert = await ExpertService.createExpert(
        req.body,
        req.file,
        req.user.userId
      );
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Expert created successfully",
        expert,
      });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        error: error.message 
      });
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
      res.status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
    } catch (error) {
      console.error("Error fetching experts:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: "Server error" 
      });
    }
  }

  async actionChange(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action } = req.body;
      const validActions = ["approved", "rejected"];
      
      if (!validActions.includes(action)) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          success: false, 
          message: "Invalid action" 
        });
        return;
      }
      
      if (!id || !action) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          success: false, 
          message: "Missing required parameters" 
        });
        return;
      }
      
      const response = await expertService.actionChange(id, action);
      res.status(response?.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
    } catch (error) {
      console.error("Error in actionChange:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  }

  async blockAndUnlockExpert(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { active } = req.body;
      
      if (!id || typeof active !== 'boolean') {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          success: false, 
          message: "Missing or invalid parameters" 
        });
        return;
      }
      
      const response = await ExpertService.block_unblock(id, active);
      res.status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
    } catch (error) {
      console.error("Error in blockAndUnlockExpert:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  }

  async getExpertData(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await expertService.getExpertData(id);
      res.status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  }

  async switch_expert(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          success: false, 
          message: "User not found" 
        });
        return;
      }
      
      const response = await expertService.switch_expert(userId);
      if (response.success) {
        if (response.accessToken && response.refreshToken) {
          await setAuthCookies(res, response.accessToken, response.refreshToken);
          res.status(HttpStatus.OK).json(response);
          return;
        }
      }
      
      res.status(HttpStatus.BAD_REQUEST).json(response);
    } catch (error) {
      console.error("Error in switch_expert controller:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  }

  async switch_user(req: AuthRequest, res: Response) {
    try {
      const expertId = req?.expert?.expertId;
      if (!expertId) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          success: false, 
          message: "Expert not found" 
        });
        return;
      }
      
      const response = await expertService.switch_user(expertId);
      if (response.success) {
        if (response.accessToken && response.refreshToken) {
          await setAuthCookies(res, response.accessToken, response.refreshToken);
        }
        res.status(HttpStatus.OK).json(response);
        return;
      }
      
      res.status(HttpStatus.BAD_REQUEST).json(response);
    } catch (err) {
      console.error("Error in switch_user controller:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  }  
}

export default new ExpertController();