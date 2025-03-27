export interface IUserService {
    getUsers(): Promise<{ success: boolean; users?: any[]; message?: string }>;
    blockUnblockUser(id: string, block: boolean): Promise<{ 
        success: boolean; 
        message?: string; 
        updatedUser?: any 
    }>;
    checkBlocked(id: string): Promise<boolean | { success: boolean; message: string } |boolean>;
}