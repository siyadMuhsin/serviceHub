import adminRepository from "../../repositories/Admin/admin.repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

interface AuthResult {
    message?: string;
    user?: object;
    token?: string;
    error?: string;
    success?: boolean;
    accessToken?:string;
    refreshToken?:string
  }
class AdminService {
  async loginAdmin(email: string, password: string): Promise<AuthResult> {
    const admin = await adminRepository.findByEmail(email);
    console.log(admin)
    if (!admin) return {success:false,message:"Admin not found"};
    if(admin.adminPassword===password){
        const accessToken =await generateAccessToken(admin._id,'admin')
        const refreshToken =await generateRefreshToken(admin._id,'admin')
        return {success:true,accessToken,refreshToken}
    }else{
        return {success:false,message:"invalid password"}
    }
  }
}

export default new AdminService();
