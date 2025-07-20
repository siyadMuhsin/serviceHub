import { inject, injectable } from 'inversify';
import { ICategoryRepository } from "../../core/interfaces/repositories/ICategoryRepository";
import { ICategory } from "../../types/Admin";
import { CloudinaryService } from "../../config/cloudinary";
import { ICategoryService } from '../../core/interfaces/services/ICategoryService';
import { TYPES } from "../../di/types";
import logger from '../../config/logger';

@injectable()
export class CategoryService implements ICategoryService {
    constructor(
        @inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository
    ) {}
    async createCategory(name: string, description: string, file: Express.Multer.File) {
        try {
            const existingCategory = await this._categoryRepository.getCategoryByName(name);
            if (existingCategory) {
                return { success: false, message: "Category name is already in use" };
            }
            const imageUrl = await CloudinaryService.uploadImage(file);
            if (!imageUrl) {
                return { success: false, message: "Cloudinary upload failed" };
            }

            const category = await this._categoryRepository.create({
                name,
                description,
                image: imageUrl,
            });
            return {
                success: true,
                message: "Category created successfully",
                category,
            };
        } catch (error) {
            const err= error as Error
            logger.error("Error in createCategory Service:", err);
            return {
                success: false,
                message:err.message|| "Something went wrong. Please try again.",
            };
        }
    }

    async getAllCategories() {
        try {
            const categories = await this._categoryRepository.findAll();
            return { success: true, categories };
        } catch (error) {
            const err= error as Error
            logger.error("Error in getAllCategories:", err);
            return { success: false, message:err.message|| "Failed to fetch categories" };
        }
    }

    async changeStatus(id: string) {
        try {
            const category = await this._categoryRepository.findById(id);
            if (!category) {
                return { success: false, message: "Category not found" };
            }
            const updateStatus = !category.isActive;
            const updatedCategory = await this._categoryRepository.updateById(id, { isActive: updateStatus });
            if(updatedCategory){
              return { 
                success: true,
                message: `Category ${updateStatus ? "listed" : "unlisted"} successfully`,
                category: updatedCategory 
            };
            }else{
              return {success:false,message:"update category not found"}
            }
            
        } catch (error) {
            const err=error as Error
            return { success: false, message: err.message };
        }
    }

    async getCategoryById(id: string) {
        try {
            const category = await this._categoryRepository.findById(id);
            if (!category) {
                return { success: false, message: "Category not found" };
            }

            return { success: true, category };
        } catch (error) {
            const err= error as Error
            logger.error("Error in getCategoryById:", err);
            return { success: false, message:err.message|| "Failed to fetch category" };
        }
    }

    async updateCategory(id: string, name?: string, description?: string, file?: Express.Multer.File) {
        try {
            let imageUrl: string | null = null;
            if (file) {
                imageUrl = await CloudinaryService.uploadImage(file);
                if (!imageUrl) {
                    return { success: false, message: "Cloudinary upload failed" };
                }
            }
            const existingCategory = await this._categoryRepository.findById(id);
            if (!existingCategory) {
                return { success: false, message: "Category not found" };
            }
    
            const updatedData: any = {};
            if (name) updatedData.name = name;
            if (description) updatedData.description = description;
            if (imageUrl) {
                updatedData.image = imageUrl;
            } else {
                updatedData.image = existingCategory.image;
            }
    
            const updatedCategory = await this._categoryRepository.updateById(id, updatedData);
            if (!updatedCategory) {
                return { success: false, message: "Failed to update category" };
            }
            return {
                success: true,
                message: "Category updated successfully",
                updatedCategory,
            };
        } catch (error) {
            const err= error as Error
            logger.error("Error in updateCategory:", err);
            return { success: false, message:err.message|| "Failed to update category" };
        }
    }
    async getCategoriesByLimit(page: number, limit: number, search: string) {
        const result = await this._categoryRepository.getCategoriesByLimit(page, limit, search);
        return result;
    }
    async getCategoryToMange(page: number, limit: number, search: string) {
        try {
            const isAdmin = true;
            const result = await this._categoryRepository.getCategoriesByLimit(page, limit, search, isAdmin);
            return { success: true, message: "category get in success", result };
        } catch (error) {
            const err= error as Error
            logger.error("Error in getCategoryToMange:", err);
            return { success: false, message:err.message|| "Failed to get categories" };
        }
    }
}