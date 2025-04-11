import { LeanDocument } from "mongoose";
import { IAdmin } from "../../../models/admin.model";

export interface IAdminRepository {
    findByEmail(email: string): Promise<LeanDocument<IAdmin> | null>;
}