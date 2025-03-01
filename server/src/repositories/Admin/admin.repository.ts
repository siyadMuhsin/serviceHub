import Admin ,{IAdmin} from '../../models/admin.model';
class adminRepository {
     async findByEmail(email: string) {
         return await Admin.findOne({adminEmail:email});
        }
          
}
export default new adminRepository()