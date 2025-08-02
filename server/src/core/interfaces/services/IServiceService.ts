import { IServices } from "../../../types/Admin";
import { ObjectId } from "mongoose";
import { ServiceDTO } from "../../../mappers/service.mapper";
export interface IServiceService {
    createService(name: string, categoryId: ObjectId, description: string, image: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        service?: ServiceDTO |null;
    }>;
    getAllServices(): Promise<{
        success: boolean;
        services?: ServiceDTO[];
        message?: string;
    }>;
    getServiceById(serviceId: string): Promise<{
        success: boolean;
        service?: ServiceDTO;
        message?: string;
    }>;
    getServicesByCategory(categoryId: string): Promise<{
        success: boolean;
        services?: ServiceDTO[];
        message?: string;
    }>;
    updateService(serviceId: string, data: Partial<IServices>, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        service?: ServiceDTO;
    }>;
    changeStatus(id: string): Promise<{
        success: boolean;
        message: string;
        service?: ServiceDTO;
    }>;
    getServicesByCategory_limit(categoryId: string, page: number, limit: number, search: string): Promise<{
        services: ServiceDTO[];
        totalServices: number;
    }>;
    getServicesToMange(page: number, limit: number, search: string): Promise<{
        services: ServiceDTO[];
        totalServices: number;
    }>;
}