import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { HttpStatus } from "../../types/httpStatus";
import { ICategoryService } from "../../core/interfaces/services/ICategoryService";
import { ICategoryController } from "../../core/interfaces/controllers/ICategoryController";
import { TYPES } from "../../di/types";

@injectable()
export class CategoryController implements ICategoryController {
    constructor(
        @inject(TYPES.CategoryService) private categoryService: ICategoryService
    ) {}

    async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                this.sendResponse(res, {
                    success: false,
                    message: "Name and description are required"
                }, HttpStatus.BAD_REQUEST);
                return;
            }

            if (!req.file) {
                this.sendResponse(res, {
                    success: false,
                    message: "Image upload is required"
                }, HttpStatus.BAD_REQUEST);
                return;
            }

            const response = await this.categoryService.createCategory(
                name,
                description,
                req.file
            );

            this.sendResponse(res, response, response.success ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST);
        } catch (error: any) {
            console.error("Error in createCategory Controller:", error);
            this.sendResponse(res, {
                success: false,
                message: "Internal server error"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.categoryService.getAllCategories();
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (err: any) {
            console.error("Error in getAllCategories:", err);
            this.sendResponse(res, {
                success: false,
                message: "Internal Server Error"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this.categoryService.getCategoryById(id);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND);
        } catch (err: any) {
            console.error("Error in getCategoryById:", err);
            this.sendResponse(res, {
                success: false,
                message: "Internal Server Error"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async list_and_unlist(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this.categoryService.changeStatus(id);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND);
        } catch (error) {
            console.error("Error in list_and_unlist:", error);
            this.sendResponse(res, {
                success: false,
                message: "Internal Server Error"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const response = await this.categoryService.updateCategory(id, name, description, req.file);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (err: any) {
            console.error("Error in updateCategory:", err);
            this.sendResponse(res, {
                success: false,
                message: "Internal Server Error"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async categoriesByLimit(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = typeof req.query.searchQuary === 'string' ? req.query.searchQuary : '';
            
            const { categories, total } = await this.categoryService.getCategoriesByLimit(page, limit, search);
            
            this.sendResponse(res, {
                categories,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            }, HttpStatus.OK);
        } catch (error) {
            this.sendResponse(res, {
                error: "Failed to fetch categories"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
 
    async getCategoryToManage(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;
            const search = typeof req.query.search == 'string' ? req.query.search : "";
            
            const { success, message, result } = await this.categoryService.getCategoryToMange(page, limit, search);
            
            if (!success || !result) {
                this.sendResponse(res, { message }, HttpStatus.BAD_REQUEST);
                return;
            }
            
            this.sendResponse(res, {
                success,
                categories: result.categories,
                currentPage: page,
                totalPages: Math.ceil(result.total / limit),
                totalItems: result.total,
            }, HttpStatus.OK);
        } catch (err: any) {
            console.error("Error in getCategoryToManage:", err);
            this.sendResponse(res, {
                success: false,
                message: "Internal Server Error"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private sendResponse(res: Response, data: any, status: HttpStatus): void {
        res.status(status).json(data);
    }
}