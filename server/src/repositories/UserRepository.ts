import { injectable } from 'inversify';
import User, { IUser } from "../models/Usermodel";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";

@injectable()
export class UserRepository implements IUserRepository {
    async getAlluser(): Promise<IUser[]> {
        try {
            return await User.find().lean();
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw new Error("Failed to fetch users");
        }
    }

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email }).lean();
        } catch (error) {
            console.error(`Error finding user by email (${email}):`, error);
            throw new Error("Failed to find user by email");
        }
    }

    async findUserById(id: string): Promise<IUser | null> {
        try {
            return await User.findById(id).lean();
        } catch (error) {
            console.error(`Error finding user by ID (${id}):`, error);
            throw new Error("Failed to find user by ID");
        }
    }

    async findByIdAndUpdate(id: string, update: Partial<IUser>): Promise<IUser | null> {
        try {
            return await User.findByIdAndUpdate(
                id, 
                update, 
                { new: true }
            ).lean();
        } catch (error) {
            console.error(`Error updating user by ID (${id}):`, error);
            throw new Error("Failed to update user");
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
}