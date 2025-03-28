import { inject, injectable } from "inversify";
import { IProfileService } from "../../core/interfaces/services/IProfileService";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../core/interfaces/repositories/IUserRepository";
@injectable()
export class ProfileService implements IProfileService {
    constructor(
        @inject(TYPES.UserRepository) private userRepositry :IUserRepository
     ){}

   
     async addLocation(userId: string, lat: number, lng: number) {
        try {
            const location:any = {} ;
            location.lat=lat
            location.lng=lng
    
            const user = await this.userRepositry.findByIdAndUpdate(userId,{ location },);
            if (!user) {
                return { 
                    success: false, 
                    message: "User not found" 
                };
            }
            return { 
                success: true, 
                message: "Location updated successfully",  
            };
        } catch (error) {
            console.error("Error in addLocation:", error);
            return { 
                success: false, 
                message: "Failed to update location" 
            };
        }
    }
}
