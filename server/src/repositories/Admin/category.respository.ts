import { Category } from "../../models/category.model";
import { ICategory } from "../../types/Admin";
class CategoryRepository{
    async createCategory(categoryData: Partial<ICategory>):Promise<ICategory>{
        const category= new Category(categoryData)
        return await category.save();
    }
    async getAllCategories():Promise<ICategory []>{

        return await Category.find()
    }
    async getCategoryByName(name:string):Promise<ICategory | null>{
        return await Category.findOne({name})
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

      async getCategoriesByLimit(page: number, limit: number,search:string) {
        const query:any ={isActive:true}
        if(search){
          query.name={ $regex: search, $options: "i" }
        }
      

    const skip = (page - 1) * limit;

    const categories = await Category.find(query)
      .skip(skip)
      .limit(limit);

    // Correct count query with the same search condition
    const total = await Category.countDocuments(query);

    return { categories, total };
  }
} 
export default new CategoryRepository()