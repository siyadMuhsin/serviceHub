import { injectable } from 'inversify';
import { Services } from "../../models/service.model";
import { IServices } from "../../types/Admin";
import { ObjectId } from "mongodb";
import { IServiceRepository } from "../../core/interfaces/repositories/IServiceRepository";
import { BaseRepository } from '../BaseRepository';

@injectable()
export class ServiceRepository extends BaseRepository<IServices> implements IServiceRepository {
    constructor(){
        super(Services)
    }
    async createService(data: Partial<IServices>) {
return this.create(data)
    }

    async getServiceByName(name: string) {
        return await Services.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    }

    async getAllServices() {
        return await Services.find({}, { name: 1 }).populate("categoryId", "name");
    }

    async getServiceById(serviceId: string) {
        return await Services.findById(serviceId).populate("categoryId");
    }

    async getServicesByCategory(categoryId: string) {
        return await Services.find({ categoryId });
    }

    async updateService(serviceId: string, data: Partial<IServices>) {
        return await Services.findByIdAndUpdate(serviceId, data, {
            new: true,
        }).populate("categoryId");
    }

    async deleteService(serviceId: string) {
        const result = await Services.findByIdAndDelete(serviceId);
        return !!result;
    }

    async getServicesByCategoryLimit(
        categoryId: string,
        limit: number,
        page: number,
        search: string
    ) {
        try {
            const skip = (page - 1) * limit;
            const categoryObjectId = new ObjectId(categoryId);
            const query: any = { categoryId: categoryObjectId, isActive: true };
            
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }

            const services = await Services.find(query)
                .skip(skip)
                .limit(limit)
                .exec();
                
            const totalServices = await Services.countDocuments(query);
            return { services, totalServices };
        } catch (error: any) {
            throw new Error(`Error fetching services: ${error.message}`);
        }
    }

    async getAllServicesByLimit(page: number, limit: number, search: string) {
        try {
            const skip = (page - 1) * limit;
            const query: any = {};
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }
            const services = await Services.find(query)
                .populate("categoryId")
                .skip(skip)
                .limit(limit)
                .exec();
            const totalServices = await Services.countDocuments(query);
            return { services, totalServices };
        } catch (error: any) {
            throw new Error(`Error fetching services: ${error.message}`);
        }
    }
}