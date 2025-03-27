import { Express } from "express";
import { ICategory } from "../../../types/Admin";

export interface ICategoryService {
    createCategory(name: string, description: string, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        category?: ICategory;
    }>;
    getAllCategories(): Promise<{
        success: boolean;
        categories?: ICategory[];
        message?: string;
    }>;
    changeStatus(id: string): Promise<{
        success: boolean;
        message: string;
        category?: ICategory;
    }>;
    getCategoryById(id: string): Promise<{
        success: boolean;
        category?: ICategory;
        message?: string;
    }>;
    updateCategory(id: string, name?: string, description?: string, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        updatedCategory?: ICategory;
    }>;
    getCategoriesByLimit(page: number, limit: number, search: string): Promise<{
        categories: ICategory[];
        total: number;
    }>;
    getCategoryToMange(page: number, limit: number, search: string): Promise<{
        success: boolean;
        message: string;
        result?: {
            categories: ICategory[];
            total: number;
        };
    }>;
}