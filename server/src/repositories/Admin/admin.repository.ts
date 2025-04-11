import { injectable } from 'inversify';
import Admin, { IAdmin } from '../../models/admin.model';
import { IAdminRepository } from '../../core/interfaces/repositories/IAdminRepository';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
    constructor(){
        super(Admin)
    }
    async findByEmail(email: string) {
        return await this.findOne({ adminEmail: email });
    }
}