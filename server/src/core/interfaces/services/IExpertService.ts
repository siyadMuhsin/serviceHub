import { IExpert } from "../../../types/Expert";
import { Request } from "express";

export interface IExpertService {
    createExpert(data: Partial<IExpert>, file: Express.Multer.File, userId: string): Promise<IExpert |null>;
    getExperts(): Promise<IExpert[]>;
    getExpertBy_limit(page: number, limit: number, filter: string, search: string): Promise<{
        success: boolean;
        experts?: IExpert[];
        totalRecords?: number;
        totalPages?: number;
        message?: string;
    }>;
    actionChange(id: string, action: string): Promise<{
        success: boolean;
        message?: string;
        data?: IExpert;
    }>;
    block_unblock(id: string, active: boolean): Promise<{
        success: boolean;
        message?: string;
        data?: IExpert;
    }>;
    getExpertData(id: string): Promise<{
        success: boolean;
        expert?: IExpert;
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
}