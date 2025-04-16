import { inject, injectable } from 'inversify';
import { IServiceRepository } from "../../core/interfaces/repositories/IServiceRepository";
import { IServices } from "../../types/Admin";
import { CloudinaryService } from "../../config/cloudinary";
import { IServiceService } from '../../core/interfaces/services/IServiceService';
import { TYPES } from "../../di/types";
import mongoose, { ObjectId, Types } from 'mongoose';

@injectable()
export class ServiceService implements IServiceService {
    constructor(
        @inject(TYPES.ServiceRepository) private serviceRepository: IServiceRepository
    ) {}

    async createService(name: string, categoryId: any, description: string, image: Express.Multer.File) {
        try {
            const existingService = await this.serviceRepository.getServiceByName(name);
            if (existingService) {
                return { success: false, message: 'Service name already used' };
            }

            const imageUrl = await CloudinaryService.uploadImage(image);
            if (!imageUrl) {
                return { success: false, message: 'Cloudinary upload failed' };
            }

            const service = await this.serviceRepository.create({ 
                name, 
                categoryId, 
                description, 
                image: imageUrl 
            });
            
            const populatedService = await this.serviceRepository.getServiceById(service._id);
            return { 
                success: true, 
                message: "Service created successfully", 
                service: populatedService 
            };
        } catch (error) {
            console.error("Error creating service:", error);
            return { 
                success: false, 
                message: "Error creating service" 
            };
        }
    }

    async getAllServices() {
        try {
            const services = await this.serviceRepository.getAllServices();
            return { success: true, services };
        } catch (error) {
            console.error("Error fetching services:", error);
            return { 
                success: false, 
                message: "Error fetching services" 
            };
        }
    }

    async getServiceById(serviceId: string) {
        try {
            const service = await this.serviceRepository.getServiceById(serviceId);
            if (!service) {
                return { success: false, message: "Service not found" };
            }
            return { success: true, service };
        } catch (error) {
            console.error("Error fetching service:", error);
            return { 
                success: false, 
                message: "Error fetching service" 
            };
        }
    }

    async getServicesByCategory(categoryId: string) {
        try {
            const categoryIdObjectId= new mongoose.Schema.Types.ObjectId(categoryId)
            const services = await this.serviceRepository.findMany({categoryId:categoryIdObjectId});
            return { success: true, services };
        } catch (error) {
            console.error("Error fetching services by category:", error);
            return { 
                success: false, 
                message: "Error fetching services by category" 
            };
        }
    }

    async updateService(serviceId: string, data: Partial<IServices>, file?: Express.Multer.File) {
        try {
            let imageUrl: string | null = null;

            if (file) {
                imageUrl = await CloudinaryService.uploadImage(file);
                if (!imageUrl) {
                    return { success: false, message: "Cloudinary upload error" };
                }
                data.image = imageUrl;
            }

            const existingService = await this.serviceRepository.getServiceById(serviceId);
            if (!existingService) {
                return { success: false, message: "Service not found" };
            }

            const updatedData: any = {};
            if (data.name) updatedData.name = data.name;
            if (data.description) updatedData.description = data.description;
            if (data.categoryId) updatedData.categoryId = data.categoryId;
            updatedData.image = imageUrl || existingService.image;

            const updatedService = await this.serviceRepository.updateService(serviceId, updatedData);
            if (!updatedService) {
                return { success: false, message: "Service update failed" };
            }

            return {
                success: true,
                message: "Service updated successfully",
                service: updatedService,
            };
        } catch (error) {
            console.error("Error updating service:", error);
            return { 
                success: false, 
                message: "Error updating service" 
            };
        }
    }

    async changeStatus(id: string) {
        try {
            const service = await this.serviceRepository.getServiceById(id);
            if (!service) {
                return { success: false, message: "Service not found" };
            }

            const updateStatus = !service.isActive;
            const updatedService = await this.serviceRepository.updateService(id, { isActive: updateStatus });

            if(updatedService){
              return {
                success: true,
                message: `Service ${updateStatus ? "listed" : "unlisted"} successfully`,
                service: updatedService
            };
            }else{
              return {success:false,message:"updated service not found"}
            }
            
        } catch (err: any) {
            console.error("Error changing service status:", err);
            return {
                success: false,
                message: err.message
            };
        }
    }

    async getServicesByCategory_limit(categoryId: string, page: number, limit: number, search: string) {
        try {
            const response = await this.serviceRepository.getServicesByCategoryLimit(
                categoryId,
                limit,
                page,
                search
            );
            return response;
        } catch (error) {
            console.error("Error fetching services by category limit:", error);
            throw error;
        }
    }

    async getServicesToMange(page: number, limit: number, search: string) {
        try {
            const response = await this.serviceRepository.getAllServicesByLimit(page, limit, search);
            return response;
        } catch (error: any) {
            console.error("Error fetching services to manage:", error);
            throw new Error(`Error fetching services: ${error.message}`);
        }
    }
}