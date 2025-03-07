import { Services } from "../../models/service.model";
import { IServices } from "../../types/Admin";

class ServiceRepository {
     async createService(data: Partial<IServices>) {
        return await Services.create(data);
    }

    async getServiceByName(name:string){
        return await Services.findOne({name})
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
        return await Services.findByIdAndUpdate(serviceId, data, { new: true }).populate('categoryId');
    }

     async deleteService(serviceId: string) {
        return await Services.findByIdAndDelete(serviceId);
    }
}
export default new ServiceRepository()