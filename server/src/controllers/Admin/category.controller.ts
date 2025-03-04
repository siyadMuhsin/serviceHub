
import { Request, Response } from "express";
import { Category } from "../../models/category.model";

import CategoryServices from "../../services/Admin/category.service";
class CategoryController {
    async createCategory(req:Request,res:Response):Promise<void>{
        try{
            const {name,description,image}= req.body
            const response= await CategoryServices.createCategory(name,description,image)
            if(response?.success){
                res.json(response)
                return
            }
            res.json(response)
            return
        }catch(err:any){
            res.status(500).json({ success: false, message: err.message });
        }
    }

     /**
   * Get all categories
   */
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const response = await CategoryServices.getAllCategories();
      res.status(response.success ? 200 : 400).json(response);
    } catch (err: any) {
      console.error("Error in getAllCategories:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

   /**
   * Get category by ID
   */
   async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await CategoryServices.getCategoryById(id);
      res.status(response.success ? 200 : 404).json(response);
    } catch (err: any) {
      console.error("Error in getCategoryById:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  /**
   * Update category
   */
  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, image } = req.body;
      const response = await CategoryServices.updateCategory(id, name, description, image);
      res.status(response.success ? 200 : 400).json(response);
    } catch (err: any) {
      console.error("Error in updateCategory:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

   /**
   * Delete category
   */
   async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await CategoryServices.deleteCategory(id);
      res.status(response.success ? 200 : 404).json(response);
    } catch (err: any) {
      console.error("Error in deleteCategory:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

}

export default new CategoryController()