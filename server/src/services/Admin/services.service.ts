import { inject, injectable } from 'inversify';
import { IServiceRepository } from "../../core/interfaces/repositories/IServiceRepository";
import { IServices } from "../../types/Admin";
import { CloudinaryService } from "../../config/cloudinary";
import { IServiceService } from '../../core/interfaces/services/IServiceService';
import { TYPES } from "../../di/types";
import mongoose, { ObjectId, Types } from 'mongoose';
import logger from '../../config/logger';
import { mapServiceToDTO } from '../../mappers/service.mapper';

@injectable()
export class ServiceService implements IServiceService {
    constructor(
        @inject(TYPES.ServiceRepository) private _serviceRepository: IServiceRepository
    ) {}

    async createService(name: string, categoryId: any, description: string, image: Express.Multer.File) {
        try {
            const existingService = await this._serviceRepository.getServiceByName(name);
            if (existingService) {
                return { success: false, message: 'Service name already used' };
            }

            const imageUrl = await CloudinaryService.uploadImage(image);
            if (!imageUrl) {
                return { success: false, message: 'Cloudinary upload failed' };
            }
            const service = await this._serviceRepository.create({ name, categoryId,  description, image: imageUrl });
            const populatedService = await this._serviceRepository.getServiceById(service._id);
            if(!populatedService)throw new Error("Error creating service")
            const serviceDTO=mapServiceToDTO(populatedService)
            return { 
                success: true, 
                message: "Service created successfully", 
                service: serviceDTO
            };
        } catch (error) {
            const err= error as Error
            logger.error("Error creating service:", err);
            return { 
                success: false, 
                message:err.message|| "Error creating service" 
            };
        }
    }

    async getAllServices() {
        try {
            const services = await this._serviceRepository.getAllServices();
            const servicesDTO=services.map((x)=>mapServiceToDTO(x))
            return { success: true, services:servicesDTO };
        } catch (error) {
            const err= error as Error
            logger.error("Error fetching services:", err);
            return { 
                success: false, 
                message:err.message|| "Error fetching services" 
            };
        }
    }

    async getServiceById(serviceId: string) {
        try {
            const service = await this._serviceRepository.getServiceById(serviceId);
            if (!service) {
                return { success: false, message: "Service not found" };
            }
            const serviceDTO=mapServiceToDTO(service)
            return { success: true, service:serviceDTO };
        } catch (error) {
            const err= error as Error
            logger.error("Error fetching service:", err);
            return { 
                success: false, 
                message:err.message|| "Error fetching service" 
            };
        }
    }

    async getServicesByCategory(categoryId: string) {
        try {
            const categoryIdObjectId= new mongoose.Schema.Types.ObjectId(categoryId)
            const services = await this._serviceRepository.findMany({categoryId:categoryIdObjectId});
            const servicesDTO=services.map((x)=>mapServiceToDTO(x))

            return { success: true, services:servicesDTO };
        } catch (error) {
            const err= error as Error
            logger.error("Error fetching services by category:", err);
            return { 
                success: false, 
                message:err.message|| "Error fetching services by category" 
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

            const existingService = await this._serviceRepository.getServiceById(serviceId);
            if (!existingService) {
                return { success: false, message: "Service not found" };
            }
            const query={_id:{$ne:existingService._id},name:data.name}
            const existingName=await this._serviceRepository.findOne(query)
            if(existingName){
                return {success:false,message:"The service Name Already Exisits"}
            }
            const updatedData: any = {};
            if (data.name) updatedData.name = data.name;
            if (data.description) updatedData.description = data.description;
            if (data.categoryId) updatedData.categoryId = data.categoryId;
            updatedData.image = imageUrl || existingService.image;

            const updatedService = await this._serviceRepository.updateService(serviceId, updatedData);
            if (!updatedService) {
                return { success: false, message: "Service update failed" };
            }
            const serviceDTO=mapServiceToDTO(updatedService)
            return {
                success: true,
                message: "Service updated successfully",
                service: serviceDTO,
            };
        } catch (error) {
            const err= error as Error
            logger.error("Error updating service:", err);
            return { 
                success: false, 
                message:err.message|| "Error updating service" 
            };
        }
    }

    async changeStatus(id: string) {
        try {
            const service = await this._serviceRepository.getServiceById(id);
            if (!service) {
                return { success: false, message: "Service not found" };
            }

            const updateStatus = !service.isActive;
            const updatedService = await this._serviceRepository.updateService(id, { isActive: updateStatus });

            if(updatedService){
                const serviceDTO=mapServiceToDTO(updatedService)
              return {
                success: true,
                message: `Service ${updateStatus ? "listed" : "unlisted"} successfully`,
                service: serviceDTO
            };
            }else{
              return {success:false,message:"updated service not found"}
            }
            
        } catch (error) {
            const err= error as Error
            logger.error("Error changing service status:", err);
            return {
                success: false,
                message: err.message
            };
        }
    }

    async getServicesByCategory_limit(categoryId: string, page: number, limit: number, search: string) {
        try {
            const response = await this._serviceRepository.getServicesByCategoryLimit(
                categoryId,
                limit,
                page,
                search
            );
            const servicesDTO=response.services.map((x)=>mapServiceToDTO(x))
            return {...response,services:servicesDTO};
        } catch (error) {
            const err= error as Error
            logger.error("Error fetching services by category limit:", err);
            throw err.message;
        }
    }

    async getServicesToMange(page: number, limit: number, search: string) {
        try {
            const response = await this._serviceRepository.getAllServicesByLimit(page, limit, search);
            const servicesDTO=response.services.map((x)=>mapServiceToDTO(x))

            return {...response,services:servicesDTO};
        } catch (error) {
            const err= error as Error
            logger.error("Error fetching services to manage:", error);
            throw new Error(`Error fetching services: ${err.message}`);
        }
    }
}