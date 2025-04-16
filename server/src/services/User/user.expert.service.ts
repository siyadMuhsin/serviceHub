import { inject, injectable } from "inversify";
import { IUserExpertService } from "../../core/interfaces/services/IUserExpertService";
import { IExpert } from "../../types/Expert";
import { TYPES } from "../../di/types";
import { IExpertRepository } from "../../core/interfaces/repositories/IExpertRepository";
import { IUserRepository } from "../../core/interfaces/repositories/IUserRepository";
import { IServiceRepository } from "../../core/interfaces/repositories/IServiceRepository";
@injectable()
export class UserExpertService implements IUserExpertService{
    constructor(
        @inject(TYPES.ExpertRepository) private expertResposity :IExpertRepository,
        @inject(TYPES.UserRepository) private userRepository :IUserRepository,
        @inject(TYPES.ServiceRepository) private serviceRepository:IServiceRepository
    ){}
    async getExpertsByService(serviceId: string, userId: string): Promise<{ success: boolean; message: string; experts: IExpert[] | null; }> {
        try {
            const service= await this.serviceRepository.getServiceById(serviceId)
            if(!service){
                return {success:false,message:"Invalid ServiceId",experts:[]}
            }
            const user= await this.userRepository.findById(userId)
            if(!user){
                return {success:false,message:"User not Fount",experts:[]}
            }
            if(user.location?.coordinates){
                const [userLng ,userLat]= user.location?.coordinates
                const experts= await this.expertResposity.findNearbyExperts(userLat,userLng,25,serviceId)
                // const res= await this.expertResposity.findDistanceLocation(userLng,userLat)
                const result:any=experts?.map((item)=>{
                    return{_id:item._id,
                        name:item.userId.name,
                        profile:item.userId.profile_image,
                        service:item.serviceId.name,
                        experience:item.experience,
                        distanceInKm:item.distanceInKm
                    }
                })
                return {success:true,message:"Fetch experts successFully",experts:result}
            }
            return {success:false,message:"Fetching failed",experts:[]}
           
        } catch (error:any) {
            throw new Error(error.message)
        }

    }
    async getExpertDetails(userId: string, experId: string){
        try {
            const user=await this.userRepository.findById(userId)
            if(!user||!user.location){
                return {success:false,message:"your location not added"}
            }
            const {coordinates}=user.location
            const data= await this.expertResposity.getExpertDataToUser(coordinates[1],coordinates[0],25,experId)
return{success:true,message:'Data found successFully',expert:data}
        } catch (error:any) {
            throw new Error(error.message)
        }
        
    }

}