import { IServices } from "../../../types/Admin";
import { IBaseRepository } from "./IBaseRepository";
export interface IServiceRepository extends IBaseRepository<IServices>{
    create(data: Partial<IServices>): Promise<any>;
    getServiceByName(name: string): Promise<IServices | null>;
    getAllServices(): Promise<IServices[]>;
    getServiceById(serviceId: string): Promise<IServices | null>;
    findMany(quary:Partial<IServices>): Promise<IServices[]>;
    updateService(serviceId: string, data: Partial<IServices>): Promise<IServices | null>;
    delete(serviceId: string): Promise<boolean>;
    getServicesByCategoryLimit(categoryId: string, limit: number, page: number, search: string): Promise<{ services: IServices[]; totalServices: number }>;
    getAllServicesByLimit(page: number, limit: number, search: string): Promise<{ services: IServices[]; totalServices: number }>;
}