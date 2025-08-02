import { IExpert } from "../../../types/Expert";
import { Request } from "express";
import { ExpertDTO } from "../../../mappers/expert.mapper";
export interface IExpertService {
    createExpert(data: Partial<IExpert>, file: Express.Multer.File, userId: string): Promise<ExpertDTO |null>;
    getExperts(): Promise<ExpertDTO[]>;
    getExpertBy_limit(page: number, limit: number, filter: string, search: string): Promise<{
        success: boolean;
        experts?: ExpertDTO[];
        totalRecords?: number;
        totalPages?: number;
        message?: string;
    }>;
    actionChange(id: string, action: string,reason?:string): Promise<{
        success: boolean;
        message?: string;
        data?: ExpertDTO;
    }>;
    block_unblock(id: string, active: boolean): Promise<{
        success: boolean;
        message?: string;
        data?: ExpertDTO;
    }>;
    getExpertData(id: string): Promise<{
        success: boolean;
        expert?: ExpertDTO;
        message?: string;
    }>;
    switch_expert(userId: string): Promise<{
        success: boolean;
        message?: string;
        accessToken?: string;
        refreshToken?: string;
    }>;
    switch_user(expertId: string): Promise<{
        success: boolean;
        message?: string;
        accessToken?: string;
        refreshToken?: string;
    }>;
    checkBlocked(expertId:string):Promise<boolean|{success:boolean,message:string}>
    getTotalExpertCount():Promise<{totalExperts:number}>
}