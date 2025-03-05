import { Request,Response } from "express";
import ExpertService from "../../services/Expert/expert.service";
import { AuthRequest } from "../../types/User";
class ExpertController{
    async createExpert(req: AuthRequest, res: Response) {
       
        try {
            if (!req.file) {
                console.log('file not found')
                res.status(400).json({success:false, error: "Certificate file is required!" });
                return
            }

            const expert = await ExpertService.createExpert(req.body, req.file,req.user.userId);

            res.status(201).json({success:true, message: "Expert created successfully", expert });
        } catch (error:any) {
            res.status(500).json({ error: error.message });
        }
    }

}
export default new ExpertController()