import { Services } from "../../models/service.model";
import { IServices } from "../../types/Admin";
import {ObjectId} from 'mongodb'
class ServiceRepository {
  async createService(data: Partial<IServices>) {
    return await Services.create(data);
  }

  async getServiceByName(name: string) {
    return await Services.findOne({ name });
  }
  async getAllServices() {
    return await Services.find().populate("categoryId");
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
    return await Services.findByIdAndDelete(serviceId);
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
      const query: any = { categoryId:categoryObjectId,isActive:true };
    if (search) {
        query.name = { $regex: search, $options: 'i' }; 
    }
      const services = await Services.find( query )
        .skip(skip)
        .limit(limit)
        .exec();
      const totalServices = await Services.countDocuments(query)
      return { services, totalServices };
    } catch (error: any) {
      throw new Error(`Error fetching services: ${error.message}`);
    }
  }
}
export default new ServiceRepository();
