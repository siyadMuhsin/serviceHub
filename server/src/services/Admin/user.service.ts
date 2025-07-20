import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IUserService } from '../../core/interfaces/services/IUserService';
import { TYPES } from '../../di/types';
import logger from '../../config/logger';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository
    ) {}

    async getUsers(page: number, limit: number, search: string = "") {
        try {
            const { users, total, totalPages, currentPage } = 
                await this._userRepository.findUsersByPagination(page, limit, search);
            return { 
                success: true, 
                users,
                totalUsers: total,
                totalPages,
                currentPage
            };
        } catch (error) {
            const err= error as Error
            logger.error("Error fetching users:", err);
            return { 
                success: false, 
                message:err.message|| "Failed to fetch users" 
            };
        }
    }

    async blockUnblockUser(id: string, block: boolean) {
        try {
            const user = await this._userRepository.findById(id);
            if (!user) {
                return { 
                    success: false, 
                    message: "User not found" 
                };
            }

            const newStatus = !user.isBlocked;
            const updatedUser = await this._userRepository.updateById(id, { 
                isBlocked: newStatus 
            });

            return { 
                success: true, 
                message: `User ${block ? "blocked" : "unblocked"} successfully`,
                updatedUser 
            };
        } catch (error) {
            const err= error as Error
            logger.error("Error updating user status:", err);
            return { 
                success: false, 
                message:err.message|| "Failed to update user status" 
            };
        }
    }

    async checkBlocked(id: string) {
        try {
            const user = await this._userRepository.findById(id);
            
            return user?.isBlocked ?true:false;
        } catch (error) {
            const err= error as Error
            logger.error("Error checking user block status:", err);
            return { 
                success: false, 
                message:err.message|| "Failed to check user status" 
            };
        }
    }
   async getTotalUserCount(): Promise<{ totalUsers: number; }> {
       try {
        const result= await this._userRepository.count({})
        return {totalUsers:result}
       } catch (error) {
        const err= error as Error
        throw new Error(err.message)
       }
   }
}