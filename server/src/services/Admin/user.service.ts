import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IUserService } from '../../core/interfaces/services/IUserService';
import { TYPES } from '../../di/types';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) {}

    async getUsers() {
        try {
            const users = await this.userRepository.findAll();
            return { success: true, users };
        } catch (error) {
            console.error("Error fetching users:", error);
            return { 
                success: false, 
                message: "Failed to fetch users" 
            };
        }
    }

    async blockUnblockUser(id: string, block: boolean) {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                return { 
                    success: false, 
                    message: "User not found" 
                };
            }

            const newStatus = !user.isBlocked;
            const updatedUser = await this.userRepository.updateById(id, { 
                isBlocked: newStatus 
            });

            return { 
                success: true, 
                message: `User ${block ? "blocked" : "unblocked"} successfully`,
                updatedUser 
            };
        } catch (error) {
            console.error("Error updating user status:", error);
            return { 
                success: false, 
                message: "Failed to update user status" 
            };
        }
    }

    async checkBlocked(id: string) {
        try {
            const user = await this.userRepository.findById(id);
            
            return user?.isBlocked ?true:false;
        } catch (error) {
            console.error("Error checking user block status:", error);
            return { 
                success: false, 
                message: "Failed to check user status" 
            };
        }
    }
}