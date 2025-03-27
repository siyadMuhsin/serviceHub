import { IServices } from "../../../types/Admin";
import { ObjectId } from "mongoose";

export interface IServiceService {
    createService(name: string, categoryId: ObjectId, description: string, image: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        service?: IServices |null;
    }>;
    getAllServices(): Promise<{
        success: boolean;
        services?: IServices[];
        message?: string;
    }>;
    getServiceById(serviceId: string): Promise<{
        success: boolean;
        service?: IServices;
        message?: string;
    }>;
    getServicesByCategory(categoryId: string): Promise<{
        success: boolean;
        services?: IServices[];
        message?: string;
    }>;
    updateService(serviceId: string, data: Partial<IServices>, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        service?: IServices;
    }>;
    changeStatus(id: string): Promise<{
        success: boolean;
        message: string;
        service?: IServices;
    }>;
    getServicesByCategory_limit(categoryId: string, page: number, limit: number, search: string): Promise<{
        services: IServices[];
        totalServices: number;
    }>;
    getServicesToMange(page: number, limit: number, search: string): Promise<{
        services: IServices[];
        totalServices: number;
    }>;
}