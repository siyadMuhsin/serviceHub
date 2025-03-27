import { Request, Response } from "express";

export interface IServiceController {
    createService(req: Request, res: Response): Promise<void>;
    getAllServices(req: Request, res: Response): Promise<void>;
    getServiceById(req: Request, res: Response): Promise<void>;
    getServicesByCategory(req: Request, res: Response): Promise<void>;
    updateService(req: Request, res: Response): Promise<void>;
    ist_and_unlist(req: Request, res: Response): Promise<void>;
    getServicesByCategory_limit(req: Request, res: Response): Promise<void>;
    getServicesToMange(req: Request, res: Response): Promise<void>;
}