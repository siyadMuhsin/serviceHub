import { AuthResult } from "../../../types/User";
export interface IAdminService {
    loginAdmin(email: string, password: string): Promise<AuthResult>;
}