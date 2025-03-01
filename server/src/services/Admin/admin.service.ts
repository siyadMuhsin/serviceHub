import adminRepository from "../../repositories/Admin/admin.repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface AuthResult {
    message?: string;
    user?: object;
    token?: string;
    error?: string;
    success?: boolean;
  }
class AdminService {
  async loginAdmin(email: string, password: string): Promise<AuthResult> {
    const admin = await adminRepository.findByEmail(email);
    console.log(admin)
    if (!admin) return {success:false,message:"Admin not found"};
    if(admin.adminPassword===password){
        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET as string, {
            expiresIn: "2h",
          });
          return {success:true,token}
    }else{
        return {success:false,message:"invalid password"}
    }
  }
}

export default new AdminService();
