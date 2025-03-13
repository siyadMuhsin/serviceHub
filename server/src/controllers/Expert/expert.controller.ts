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

    async getExperts(req: Request, res: Response) {
        try {
            console.log(req.query)
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const filter=req.query.filter as string 
console.log(page,limit)
            const response = await ExpertService.getExpertBy_limit(page, limit,filter);
            // console.log(response);

            res.status(response.success ? 200 : 400).json(response);
        } catch (error) {
            console.error('Error fetching experts:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

}
export default new ExpertController()