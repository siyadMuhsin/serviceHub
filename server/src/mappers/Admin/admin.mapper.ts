import { IAdmin } from "../../models/admin.model";


export interface AdminDTO {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const mapAdminToDTO = (admin: IAdmin): AdminDTO => {
    return {
        id: admin._id.toString(),
        name: admin.adminName,
        email: admin.adminEmail,
        role: 'admin',
    };
};
