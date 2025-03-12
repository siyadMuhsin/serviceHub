import { ObjectId } from "mongoose";
import servicesRepository from "../../repositories/Admin/services.repository";
import { IServices } from "../../types/Admin";
import multer from "multer";
import { CloudinaryService } from "../../config/cloudinary";


class ServicesService{
    // Create a new service
     async createService(name: string, categoryId: ObjectId, description: string, image: Express.Multer.File) {
        try {
            const existingService= await servicesRepository.getServiceByName(name)
            if(existingService){
                return {success:false,message:'Service name already used'}
            }  
            const imageUrl= await CloudinaryService.uploadImage(image)
            if(!imageUrl){
                return {success:false,message:'Cloudnary upload failed'}
            }
            const service = await servicesRepository.createService({ name, categoryId, description, image:imageUrl });
            const populateCatory=await servicesRepository.getServiceById(service._id)
            return { success: true, message: "Service created successfully", service:populateCatory };
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
    async updateService(
        serviceId: string,
        data: Partial<IServices>,
        file?: Express.Multer.File
      ) {
        try {
          let imageUrl: string | null = null;
      
          // Upload new image if a file is provided
          if (file) {
            imageUrl = await CloudinaryService.uploadImage(file);
            if (!imageUrl) {
              return { success: false, message: "Cloudinary upload error" };
            }
            console.log(imageUrl)
            data.image = imageUrl; // Assign the uploaded image URL to data
          }
      
          // Fetch the existing service
          const existingService = await servicesRepository.getServiceById(serviceId);
          if (!existingService) {
            return { success: false, message: "Service not found" };
          }
      
          const updatedData: any = {};
          if (data.name) updatedData.name = data.name;
          if (data.description) updatedData.description = data.description;
          if(data.categoryId)updatedData.categoryId=data.categoryId
          if (imageUrl) {
            updatedData.image = imageUrl;
          } else {
            updatedData.image = existingService.image; // Keep old image
          }
      
          // Merge new data with existing service data
          const updatedService = await servicesRepository.updateService(serviceId, updatedData);
      
          if (!updatedService) {
            return { success: false, message: "Service update failed" };
          }
      
          return {
            success: true,
            message: "Service updated successfully",
            service:updatedService,
          };
        } catch (error) {
          console.error("Error updating service:", error);
          return { success: false, message: "Error updating service", error };
        }
      }
      
      // Delete service
     async changeStatus(id:string){
         try {
         
              const service=await servicesRepository.getServiceById(id)
              if(!service){
                return { success: false, message: "Service not found" };
              }
              const updateStatus= !service.isActive
              const updatedService=await servicesRepository.updateService(id,{isActive:updateStatus})
             
              return { success: true,
                message: `Service ${updateStatus ? "listed" : "unlisted"} successfully`,
                service: updatedService}
            } catch (err:any) {
             
              return {success:false,message:err.message}
            }
     }
     async getServicesByCategory_limit(categoryId:string,page:number,limit:number,search:string){
      
      console.log(search)
      const response=await servicesRepository.getServicesByCategoryLimit(categoryId,limit,page,search)
      return response
     }
}

export default new ServicesService()