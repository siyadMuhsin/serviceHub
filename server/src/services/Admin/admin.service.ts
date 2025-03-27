import { inject, injectable } from 'inversify';
import { IAdminRepository } from '../../core/interfaces/repositories/IAdminRepository';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { IAdminService } from '../../core/interfaces/services/IAdminService';
import { AuthResult } from '../../types/User';
import { TYPES } from '../../di/types';

@injectable()
export class AdminService implements IAdminService {
    constructor(
        @inject(TYPES.AdminRepository) private adminRepository: IAdminRepository
    ) {}

    async loginAdmin(email: string, password: string): Promise<AuthResult> {
        try {
            const admin = await this.adminRepository.findByEmail(email);
            if (!admin) {
                return { success: false, message: "Admin not found" };
            }

            if (admin.adminPassword === password) {
                const accessToken = await generateAccessToken(admin._id, 'admin');
                const refreshToken = await generateRefreshToken(admin._id, 'admin');
                return { success: true, accessToken, refreshToken };
            } else {
                return { success: false, message: "Invalid password" };
            }
        } catch (error) {
            console.error("Error in admin login:", error);
            throw new Error("Login failed");
        }
    }
}