import { ICategory } from "../../../types/Admin";

export interface ICategoryRepository {
    createCategory(categoryData: Partial<ICategory>): Promise<ICategory>;
    getAllCategories(): Promise<ICategory[]>;
    getCategoryByName(name: string): Promise<ICategory | null>;
    getCategoryById(id: string): Promise<ICategory | null>;
    updateCategory(id: string, updateData: Partial<ICategory>): Promise<ICategory | null>;
    deleteCategory(id: string): Promise<boolean>;
    getCategoriesByLimit(page: number, limit: number, search: string, isAdmin?: boolean): Promise<{ categories: ICategory[]; total: number }>;
}