import { injectable } from 'inversify';
import User, { IUser } from "../models/user.model";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IExpert } from '../types/Expert';
import Expert from '../models/expert.model';
import { BaseRepository } from './BaseRepository';
import { FilterQuery, LeanDocument } from 'mongoose';

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
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
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
            console.error(`Error updating user by email (${email}):`, error);
            throw new Error("Failed to update user");
        }
    }

    async findOneBYToken(token: string): Promise<IUser | null> {
        try {
            return await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: new Date() }
            }).lean();
        } catch (error) {
            console.error("Error finding user by token:", error);
            throw new Error("Failed to find user by token");
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
            console.error("Error clearing reset token:", error);
            throw new Error("Failed to reset password");
        }
    }
    async getExpertByUserId(id:string){
        try {
           return await Expert.findOne({userId:id}).populate('categoryId','_id name').populate('serviceId','_id name')
        } catch (error) {
            throw new Error("failed to get expert by userId")
        }
    }
}