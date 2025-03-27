import { injectable } from 'inversify';
import { Category } from "../../models/category.model";
import { ICategory } from "../../types/Admin";
import { ICategoryRepository } from "../../core/interfaces/repositories/ICategoryRepository";

@injectable()
export class CategoryRepository implements ICategoryRepository {
    async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
        const category = new Category(categoryData);
        return await category.save();
    }

    async getAllCategories(): Promise<ICategory[]> {
        return await Category.find({}, { name: 1 });
    }

    async getCategoryByName(name: string): Promise<ICategory | null> {
        return await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    }

    async getCategoryById(id: string): Promise<ICategory | null> {
        return await Category.findById(id);
    }

    async updateCategory(id: string, updateData: Partial<ICategory>): Promise<ICategory | null> {
        return await Category.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteCategory(id: string): Promise<boolean> {
        const result = await Category.findByIdAndDelete(id);
        return !!result;
    }

    async getCategoriesByLimit(page: number, limit: number, search: string, isAdmin?: boolean): Promise<{ categories: ICategory[]; total: number }> {
        const query: any = {};
        
        if (isAdmin !== true) {
            query.isActive = true;
        }
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;
        const categories = await Category.find(query)
            .skip(skip)
            .limit(limit);

        const total = await Category.countDocuments(query);

        return { categories, total };
    }
}