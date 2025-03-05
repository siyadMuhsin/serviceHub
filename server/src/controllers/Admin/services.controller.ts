import ServicesService from "../../services/Admin/services.service";
import { Request,Response} from "express";
class ServiceController{
     async createService(req: Request, res: Response): Promise<void> {
        try {
            const { name, categoryId, description, image } = req.body;
            const response = await ServicesService.createService(name, categoryId, description, image);
            res.status(response.success ? 200 : 400).json(response);
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

     async getAllServices(req: Request, res: Response): Promise<void> {
        console.log('service get in')
        try {
            const response = await ServicesService.getAllServices();
            res.json(response);
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
     async getServiceById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await ServicesService.getServiceById(id);
            res.json(response);
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

     async getServicesByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { categoryId } = req.params;
            const response = await ServicesService.getServicesByCategory(categoryId);
            res.json(response);
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

     async updateService(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await ServicesService.updateService(id, req.body);
            res.status(response.success ? 200 : 400).json(response);
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
     async deleteService(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await ServicesService.deleteService(id);
            res.status(response.success ? 200 : 400).json(response);
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
 
export default new ServiceController()