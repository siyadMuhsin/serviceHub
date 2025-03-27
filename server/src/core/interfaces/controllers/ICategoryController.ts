import { Request, Response } from "express";

export interface ICategoryController {
    createCategory(req: Request, res: Response): Promise<void>;
    getAllCategories(req: Request, res: Response): Promise<void>;
    getCategoryById(req: Request, res: Response): Promise<void>;
    list_and_unlist(req: Request, res: Response): Promise<void>;
    updateCategory(req: Request, res: Response): Promise<void>;
    categoriesByLimit(req: Request, res: Response): Promise<void>;
    getCategoryToManage(req: Request, res: Response): Promise<void>;
}