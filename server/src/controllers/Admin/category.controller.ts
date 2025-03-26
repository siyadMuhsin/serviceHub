import { Request, Response } from "express";
import { Category } from "../../models/category.model";
import { HttpStatus } from "../../types/httpStatus";
import CategoryServices from "../../services/Admin/category.service";
class CategoryController {
  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;

      // Validate required fields
      if (!name || !description) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({
            success: false,
            message: "Name and description are required",
          });
        return;
      }

      // Validate image upload
      if (!req.file) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Image upload is required" });
        return;
      }

      // Call service to create category
      const response = await CategoryServices.createCategory(
        name,
        description,
        req.file
      );

      res.status(response.success ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST).json(response);
      return;
    } catch (error: any) {
      console.error("Error in createCategory Controller:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
      return;
    }
  }

  /**
   * Get all categories
   */
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const response = await CategoryServices.getAllCategories();
      res.status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
    } catch (err: any) {
      console.error("Error in getAllCategories:", err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await CategoryServices.getCategoryById(id);
      res.status(response.success ? HttpStatus.OK : 404).json(response);
    } catch (err: any) {
      console.error("Error in getCategoryById:", err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  /**
   * list and unlist category
   */
  async list_and_unlist(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.params);
      const {id}= req.params
      const response= await CategoryServices.changeStatus(id)
      res.status(response.success ? HttpStatus.OK : 404).json(response);
    } catch (error) {
      console.error("Error in getCategoryById:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  /**
   * Update category
   */
  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const { name, description} = req.body;
     const response= await CategoryServices.updateCategory(id,name,description,req.file)
      res.status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
    } catch (err: any) {
      console.error("Error in updateCategory:", err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  /**
   *  get categories by limit
   */

  async categoriesByLimit(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
   
      const limit = parseInt(req.query.limit as string) || 10;
      const search = typeof req.query.searchQuary === 'string' ? req.query.searchQuary : '';
      console.log(search)
      const { categories, total } = await CategoryServices.getCategoriesByLimit(page, limit,search);
      res.status(HttpStatus.OK).json({
        categories,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch categories" });
    }
  }
 
  async getCategoryToManage(req:Request,res:Response){
    try {
  
    const page= parseInt(req.query.page as string)||1 
    const limit= parseInt(req.query.limit as string) ||8
    const search = typeof req.query.search == 'string' ? req.query.search : "" ;
      const { success,message,result }= await CategoryServices.getCategoryToMange(page,limit,search);
     if(!success || !result){
      res.status(HttpStatus.BAD_REQUEST).json(message);
      return
     }
     
     res.status(HttpStatus.OK).json({
      success,
      categories:result?.categories,
      currentPage: page,
      totalPages: Math.ceil(result.total / limit),
      totalItems: result.total,
    });
    } catch (err: any) {
      console.error("Error in getAllCategories:", err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal Server Error" });
    }


  }
}

export default new CategoryController();
