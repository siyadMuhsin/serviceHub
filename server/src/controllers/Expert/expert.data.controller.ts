import { triggerAsyncId } from "async_hooks";
import { AuthRequest } from "../../types/User";
import { Response } from "express";
import ExpertRespository from "../../repositories/Expert/Expert.respository";
import expertService from "../../services/Expert/expert.service";

class ExpertData{
    async get_expertData(req:AuthRequest,res:Response):Promise<void>{
        try {
            const expertId = req.expert?.expertId; 
            if (!expertId) {
              res.status(400).json({ success: false, message: 'Expert ID is missing' });
              return;
            }
            const response = await expertService.getExpertData(expertId);
            res.status(response.success ? 200 : 400).json(response);
          } catch (error) {
            console.error('Error fetching expert data:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
          }

    }
}
export default new ExpertData()