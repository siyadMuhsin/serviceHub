import { IServices } from "../../../types/Admin";
import { ObjectId } from "mongoose";

export interface IServiceRepository {
    createService(data: Partial<IServices>): Promise<any>;
    getServiceByName(name: string): Promise<IServices | null>;
    getAllServices(): Promise<IServices[]>;
    getServiceById(serviceId: string): Promise<IServices | null>;
    getServicesByCategory(categoryId: string): Promise<IServices[]>;
    updateService(serviceId: string, data: Partial<IServices>): Promise<IServices | null>;
    deleteService(serviceId: string): Promise<boolean>;
    getServicesByCategoryLimit(categoryId: string, limit: number, page: number, search: string): Promise<{ services: IServices[]; totalServices: number }>;
    getAllServicesByLimit(page: number, limit: number, search: string): Promise<{ services: IServices[]; totalServices: number }>;
}