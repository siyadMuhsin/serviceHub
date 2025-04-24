export interface IUserService {
    getUsers(page:number,limit:number,search:string): Promise<{ success: boolean; users?: any[]; message?: string }>;
    blockUnblockUser(id: string, block: boolean): Promise<{ 
        success: boolean; 
        message?: string; 
        updatedUser?: any 
    }>;
    checkBlocked(id: string): Promise<boolean | { success: boolean; message: string } |boolean>;
    getTotalUserCount():Promise<{totalUsers:number}>
}