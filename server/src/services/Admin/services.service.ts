import { ObjectId } from "mongoose";
import servicesRepository from "../../repositories/Admin/services.repository";
import { IServices } from "../../types/Admin";

class ServicesService{
    // Create a new service
     async createService(name: string, categoryId: ObjectId, description: string, image: string) {
        try {
            const existingService= await servicesRepository.getServiceByName(name)
            if(existingService){
                return {success:false,message:'Service name already used'}
            }
            const service = await servicesRepository.createService({ name, categoryId, description, image });
            return { success: true, message: "Service created successfully", service };
        } catch (error) {
            return { success: false, message: "Error creating service", error };
        }
    }

      // Get all services
       async getAllServices() {
        try {
            const services = await servicesRepository.getAllServices();
            return { success: true, services };
        } catch (error) {
            return { success: false, message: "Error fetching services", error };
        }
    }

       // Get service by ID
     async getServiceById(serviceId: string) {
        try {
            const service = await servicesRepository.getServiceById(serviceId);
            if (!service) {
                return { success: false, message: "Service not found" };
            }
            return { success: true, service };
        } catch (error) {
            return { success: false, message: "Error fetching service", error };
        }
    }
    // Get services by category
     async getServicesByCategory(categoryId: string) {
        try {
            const services = await servicesRepository.getServicesByCategory(categoryId);
            return { success: true, services };
        } catch (error) {
            return { success: false, message: "Error fetching services by category", error };
     
        }
    }
    // Update service
     async updateService(serviceId: string, data: Partial<IServices>) {
        try {
            const updatedService = await servicesRepository.updateService(serviceId, data);
            if (!updatedService) {
                return { success: false, message: "Service not found or update failed" };
            }
            return { success: true, message: "Service updated successfully", updatedService };
        } catch (error) {
            return { success: false, message: "Error updating service", error };
        }
    }
      // Delete service
       async deleteService(serviceId: string) {
        try {
            const deletedService = await servicesRepository.deleteService(serviceId);
            if (!deletedService) {
                return { success: false, message: "Service not found or deletion failed" };
            }
            return { success: true, message: "Service deleted successfully" };
        } catch (error) {
            return { success: false, message: "Error deleting service", error };
        }
    }
}

export default new ServicesService()