import { injectable } from 'inversify';
import User, { IUser } from "../models/user.model";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IExpert } from '../types/Expert';
import Expert from '../models/expert.model';
import { BaseRepository } from './BaseRepository';
import { FilterQuery, LeanDocument } from 'mongoose';
import logger from '../config/logger';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor(){
        super(User)
    }
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        try {
            const newData={...userData,location:{
                type:'Point',
                coordinates:[0,0]
            }}
            return await this.create(newData)
        } catch (error) {
          const err= error as Error
            logger.error("Error creating user:", err);
            throw new Error(err.message||"Failed to create user");
        }
    }

    async findUserAndUpdate(email: string, update: Partial<IUser>): Promise<IUser | null> {
        try {
            return await User.findOneAndUpdate(
                { email }, 
                update, 
                { new: true }
            ).lean();
        } catch (error) {
          const err= error as Error
            logger.error(`Error updating user by email (${email}):`, err);
            throw new Error(err.message||"Failed to update user");
        }
    }

    async findOneBYToken(token: string): Promise<IUser | null> {
        try {
            return await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: new Date() }
            }).lean();
        } catch (error) {
          const err= error as Error
            logger.error("Error finding user by token:", err);
            throw new Error(err.message||"Failed to find user by token");
        }
    }
    async findByIdClearToken(id: string, password: string): Promise<IUser | null> {
        try {
            return await User.findByIdAndUpdate(
                id,
                {
                    password,
                    $unset: { resetPasswordToken: "", resetPasswordExpires: "" } 
                },
                { new: true }
            );
        } catch (error) {
          const err= error as Error
            logger.error("Error clearing reset token:", err);
            throw new Error(err.message||"Failed to reset password");
        }
    }
    async getExpertByUserId(id:string){
        try {
           return await Expert.findOne({userId:id}).populate('categoryId','_id name').populate('serviceId','_id name')
        } catch (error) {
          const err= error as Error
            throw new Error(err.message||"failed to get expert by userId")
        }
    }
    async addToSavedServices(userId: string, serviceId: string): Promise<void> {
       await User.updateOne(
          { _id: userId },
          { $addToSet: { savedServices: serviceId } } ,// Add only if not already present
        );
      }
      async removeFromSavedServices(userId: string, serviceId: string): Promise<void> {
        await User.updateOne(
          { _id: userId },
          { $pull: { savedServices: serviceId } } // Remove the serviceId from savedServices array
        );
      }
      async findUserWithSavedServices(userId: string):Promise<any > {
        return await User.findById(userId).populate("savedServices");
      }

      async findUsersByPagination(page: number,limit: number,search?: string): Promise<{
        users: IUser[];
        total: number;
        totalPages: number;
        currentPage: number;
      }> {
        const skip = (page - 1) * limit;
        // Create a query for search
        const query: any = {};
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ];
        }
        const [users, total] = await Promise.all([
          User.find(query)
          .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            
            .exec(),
          User.countDocuments(query)
        ]);
        return {
          users: users.map(user => user.toObject()), 
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page
        };
      }
}