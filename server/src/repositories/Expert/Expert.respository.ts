import { injectable } from 'inversify';
import Expert from "../../models/expert.model";
import { IExpert } from "../../types/Expert";
import { IExpertRepository } from "../../core/interfaces/repositories/IExpertRepository";
import { findPackageJSON } from 'module';
import mongoose from 'mongoose';
import { BaseRepository } from '../BaseRepository';
import { IUser } from '../../models/user.model';

@injectable()
export class ExpertRepository extends BaseRepository<IExpert> implements IExpertRepository {
  constructor(){
    super(Expert)
  }
    async createExpert(data: Partial<IExpert>, userId: string): Promise<IExpert> {
        try {
          
            const newData: Partial<IExpert> = {
            ...data,
            userId :userId as unknown as IUser,
            location: {
                type: "Point", 
                coordinates: data.location?.coordinates || [0, 0] 
            }
        };
            // const expert = new Expert(newData);
            return await this.create(newData)
        } catch (error: any) {
            throw new Error(`Error in ExpertRepository: ${error.message}`);
        }
    }

    async getExperts(): Promise<IExpert[]> {
        return await Expert.find().populate("userId categoryId serviceId");
    }

    async getExpertBy_limit(page: number, limit: number, query: any) {
        try {
            const skip = (page - 1) * limit;
            const experts = await Expert.find(query)
                .populate('userId', 'name email')
                .populate('categoryId', 'name')
                .populate('serviceId', 'name')
                .skip(skip)
                .limit(limit);

            const totalRecords = await Expert.countDocuments(query);

            return { experts, totalRecords };
        } catch (error) {
            console.error('Error in fetching experts:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<IExpert | null> {
        return await Expert.findById(id).populate("userId categoryId serviceId subscription.plan" );
    }

    async findByIdAndUpdate(id: string, update: Partial<IExpert>) {
    const leanDoc= await this.updateById(id,update)
    return this.transformToObject(leanDoc)
        // return await Expert.findByIdAndUpdate(id, update, { new: true });
    }

    async findOne(query: object): Promise<IExpert | null> {
        return await Expert.findOne(query).populate("userId serviceId categoryId");
    }
    async pushToField(expertId: string,field:keyof IExpert, value:any): Promise<IExpert | null> {
        try {
           return await Expert.findByIdAndUpdate(
                expertId,
                { $push: {[field]:value} },
                { new: true }
            );
        } catch (error: any) {
            throw new Error(`Error pushing image to gallery: ${error.message}`);
        }
    }
    async pullFromField(expertId: string, field: keyof IExpert, value: any) {
        return await Expert.findByIdAndUpdate(
          expertId,
          { $pull: { [field]: value } },
          { new: true }
        );
      }

      async findNearbyExperts(
        userLat: number,
        userLng: number,
        distanceInKm = 25,
        serviceId: string
      ): Promise<any[] | null> {
        try {
          const maxDistanceInMeters = distanceInKm * 1000;
         
      
          const results = await Expert.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [userLng, userLat],
                },
                distanceField: "distanceInKm",
                maxDistance: maxDistanceInMeters,
                spherical: true,
                distanceMultiplier: 0.001, // convert to km
                query: {
                  isBlocked: false,
                  "subscription.isActive": true,
                  serviceId: new mongoose.Types.ObjectId(serviceId),
                  
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userId",
              },
            },
            {
              $unwind: "$userId",
            },
            {
              $lookup: {
                from: "services",
                localField: "serviceId",
                foreignField: "_id",
                as: "serviceId",
              },
            },
            {
              $unwind: "$serviceId",
            },
            {
              $project: {
                userId: 1,
                serviceId: { name: 1 },
                distanceInKm: 1,
                location: 1,
              },
            },
          ]);
      
          return results;
        } catch (error: any) {
          throw new Error(error.message || "Failed to fetch nearby experts");
        }
      }
      
    async getExpertDataToUser(userLat:number,userLng:number,distanceInKm=25,expertId:string):Promise<IExpert|null>{
        const maxDistanceInMeters = distanceInKm * 1000;
        return await Expert.findOne({
            _id:expertId,
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [userLng, userLat],
                },
                $maxDistance: maxDistanceInMeters,
              },
            },
            isBlocked:false,
          }).populate("userId serviceId categoryId");

    }
    async findDistanceLocation(userLng: number, userLat: number): Promise<any> {
      return await Expert.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [userLng, userLat], // must be in [lng, lat] order
            },
            distanceField: "distanceInMeters",
            spherical: true,
            distanceMultiplier: 0.001, // to get distance in kilometers
          }
        }
      ])
    }
}