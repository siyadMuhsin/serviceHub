import { ICategory } from "../../../types/Admin";

export interface ICategoryRepository {
    create(categoryData: Partial<ICategory>): Promise<ICategory>;
    findAll(): Promise<ICategory[]>;
    getCategoryByName(name: string): Promise<ICategory | null>;
    findById(id: string): Promise<ICategory | null>;
    updateById(id: string, updateData: Partial<ICategory>): Promise<ICategory | null>;
    delete(id: string): Promise<boolean>;
    getCategoriesByLimit(page: number, limit: number, search: string, isAdmin?: boolean): Promise<{ categories: ICategory[]; total: number }>;
}