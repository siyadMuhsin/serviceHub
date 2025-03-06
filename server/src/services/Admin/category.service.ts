import { resolve } from "path";
import CategoryRepository from "../../repositories/Admin/category.respository";
import { ICategory } from "../../types/Admin";
import cloudinary from "../../config/cloudinary";
import { CloudinaryService } from "../../config/cloudinary";
import { error } from "console";

class CategoryService {
     /**
   * Create a new category
   */
  async createCategory(name: string, description: string ,file: Express.Multer.File) {
    try {
      const existingCategory = await CategoryRepository.getCategoryByName(name);
      if (existingCategory) {
        return { success: false, message: "Category name is already in use" };
      }

      const imageUrl = await CloudinaryService.uploadImage(file);
      if (!imageUrl) {
        return { success: false, message: "Cloudinary upload failed" };
      }
      
      const category = await CategoryRepository.createCategory({ name, description, image: imageUrl });
      return { success: true, message: "Category created successfully", category };
    } catch (error: any) {
      
      console.error("Error in createCategory Service:", error);
      return { success: false, message: "Something went wrong. Please try again." };
    }
  }

   /**
   * Get all categories
   */

  async getAllCategories() {
    try {
      const categories = await CategoryRepository.getAllCategories();
      return { success: true, categories };
    } catch (error: any) {
      console.error("Error in getAllCategories:", error);
      return { success: false, message: "Failed to fetch categories" };
    }
  }

  /**
   * Get category by ID
   */

  async getCategoryById(id: string) {
    try {
      const category = await CategoryRepository.getCategoryById(id);
      if (!category) {
        return { success: false, message: "Category not found" };
      }

      return { success: true, category };
    } catch (error: any) {
      console.error("Error in getCategoryById:", error);
      return { success: false, message: "Failed to fetch category" };
    }
  }

   /**
   * Update category
   */

  async updateCategory(
    id: string,
    name?: string,
    description?: string,
    image?: string
  ) {
    try {
      const updatedCategory = await CategoryRepository.updateCategory(id, {
        name,
        description,
        image,
      });
      if (!updatedCategory) {
        return { success: false, message: "Category not found" };
      }

      return {
        success: true,
        message: "Category updated successfully",
        updatedCategory,
      };
    } catch (error: any) {
      console.error("Error in updateCategory:", error);
      return { success: false, message: "Failed to update category" };
    }
  }

   /**
   * Delete category
   */
  
  async deleteCategory(id: string) {
    try {
      const isDeleted = await CategoryRepository.deleteCategory(id);
      if (!isDeleted) {
        return { success: false, message: "Category not found" };
      }

      return { success: true, message: "Category deleted successfully" };
    } catch (error: any) {
      console.error("Error in deleteCategory:", error);
      return { success: false, message: "Failed to delete category" };
    }
  }
}

export default new CategoryService();
