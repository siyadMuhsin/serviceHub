import servicesService from "../../services/Admin/services.service";
import ServicesService from "../../services/Admin/services.service";
import { Request,Response} from "express";
class ServiceController{
     async createService(req: Request, res: Response): Promise<void> {
        try {
            const { name, categoryId, description} = req.body;
            if (!name?.trim() || !categoryId?.trim() || !description?.trim()) {
                res.status(400).json({ success: false, message: "All fields are required" });
                return;
            }
            if(!req.file){
                res.status(400).json({success:false,message:'image must be needed'})
                return
            }
            const response = await ServicesService.createService(name, categoryId, description,req.file);
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
         
            const response = await ServicesService.updateService(id, req.body,req.file);
            console.log(response)
            res.status(response.success ? 200 : 400).json(response);
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    
    async ist_and_unlist(req:Request,res:Response):Promise<void>{
        try{
            const {id} = req.params
         
            const response= await servicesService.changeStatus(id)
           
            res.status(response.success ? 200 : 400).json(response);

        }catch(err:any){
            console.log(err)
            res.status(500).json({ success: false, message: err.message });
        }

    }
}
 
export default new ServiceController()