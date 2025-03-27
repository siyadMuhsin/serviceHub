import { injectable } from 'inversify';
import Admin, { IAdmin } from '../../models/admin.model';
import { IAdminRepository } from '../../core/interfaces/repositories/IAdminRepository';

@injectable()
export class AdminRepository implements IAdminRepository {
    async findByEmail(email: string): Promise<IAdmin | null> {
        return await Admin.findOne({ adminEmail: email });
    }
}