import { Express } from "express";
import { ICategory } from "../../../types/Admin";
import { CategoryDTO } from "../../../mappers/category.mapper";

export interface ICategoryService {
    createCategory(name: string, description: string, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        category?: CategoryDTO;
    }>;
    getAllCategories(): Promise<{
        success: boolean;
        categories?: CategoryDTO[];
        message?: string;
    }>;
    changeStatus(id: string): Promise<{
        success: boolean;
        message: string;
        category?: CategoryDTO;
    }>;
    getCategoryById(id: string): Promise<{
        success: boolean;
        category?: CategoryDTO;
        message?: string;
    }>;
    updateCategory(id: string, name?: string, description?: string, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        updatedCategory?: CategoryDTO;
    }>;
    getCategoriesByLimit(page: number, limit: number, search: string): Promise<{
        categories: CategoryDTO[];
        total: number;
    }>;
    getCategoryToMange(page: number, limit: number, search: string): Promise<{
        success: boolean;
        message: string;
        result?: {
            categories: CategoryDTO[];
            total: number;
        };
    }>;
}