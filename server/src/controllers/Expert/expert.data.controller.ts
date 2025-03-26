
import { AuthRequest } from "../../types/User";
import { Response } from "express";
import expertService from "../../services/Expert/expert.service";
import { HttpStatus } from "../../types/httpStatus";

class ExpertData{
    async get_expertData(req:AuthRequest,res:Response):Promise<void>{
        try {
            const expertId = req.expert?.expertId; 
            if (!expertId) {
              res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'Expert ID is missing' });
              return;
            }
            const response = await expertService.getExpertData(expertId);
            res.status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
          } catch (error) {
            console.error('Error fetching expert data:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
          }

    }
}
export default new ExpertData()