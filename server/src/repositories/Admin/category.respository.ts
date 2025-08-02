import { injectable } from "inversify";
import { Category } from "../../models/category.model";
import { ICategory } from "../../types/Admin";
import { ICategoryRepository } from "../../core/interfaces/repositories/ICategoryRepository";
import { BaseRepository } from "../BaseRepository";

@injectable()
export class CategoryRepository
  extends BaseRepository<ICategory>
  implements ICategoryRepository
{
  constructor() {
    super(Category);
  }
  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    return this.create(categoryData);
  }

  async getAllCategories(): Promise<ICategory[]> {
    const leanDoc = await this.findAll();
    return this.transformAllToObjects(leanDoc);
  }

  async getCategoryByName(name: string): Promise<ICategory | null> {
    return await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    const leanDoc = await this.findById(id);
    return this.transformToObject(leanDoc);
  }

  async updateCategory(
    id: string,
    updateData: Partial<ICategory>
  ): Promise<ICategory | null> {
    const leanDoc = await this.updateById(id, updateData);
    return this.transformToObject(leanDoc);
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }

  async getCategoriesByLimit(
    page: number,
    limit: number,
    search: string,
    isAdmin?: boolean
  ): Promise<{ categories: ICategory[]; total: number }> {
    const query: any = {};

    if (isAdmin !== true) {
      query.isActive = true;
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const categories = await Category.find(query).skip(skip).limit(limit).sort({createdAt:-1});

    const total = await Category.countDocuments(query);

    return { categories, total };
  }
}
