import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { HttpStatus } from "../../types/httpStatus";
import { ICategoryService } from "../../core/interfaces/services/ICategoryService";
import { ICategoryController } from "../../core/interfaces/controllers/ICategoryController";
import { TYPES } from "../../di/types";
import logger from '../../config/logger';

@injectable()
export class CategoryController implements ICategoryController {
    constructor(
        @inject(TYPES.CategoryService) private _categoryService: ICategoryService
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

            const response = await this._categoryService.createCategory(
                name,
                description,
                req.file
            );

            this.sendResponse(res, response, response.success ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST);
        } catch (error) {
            const err= error as Error
            logger.error("Error in createCategory Controller:", err);
            this.sendResponse(res, {
                success: false,
                message: "Internal server error"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._categoryService.getAllCategories();
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            const err= error as Error
            logger.error("Error in getAllCategories:", err);
            this.sendResponse(res, {
                success: false,
                message: "Internal Server Error"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this._categoryService.getCategoryById(id);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND);
        } catch (error) {
            const err= error as Error
            logger.error("Error in getCategoryById:", err);
            this.sendResponse(res, {
                success: false,
                message: "Internal Server Error"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async list_and_unlist(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this._categoryService.changeStatus(id);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND);
        } catch (error) {
            const err= error as Error
            logger.error("Error in list_and_unlist:", err);
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
            const response = await this._categoryService.updateCategory(id, name, description, req.file);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            const err= error as Error
            logger.error("Error in updateCategory:", err);
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
            
            const { categories, total } = await this._categoryService.getCategoriesByLimit(page, limit, search);
            
            this.sendResponse(res, {
                categories,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            }, HttpStatus.OK);
        } catch (error) {
            const err= error as Error
            this.sendResponse(res, {
                error:err.message || "Failed to fetch categories"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
 
    async getCategoryToManage(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;
            const search = typeof req.query.search == 'string' ? req.query.search : "";
            
            const { success, message, result } = await this._categoryService.getCategoryToMange(page, limit, search);
            
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
        } catch (error) {
            const err= error as Error
            logger.error("Error in getCategoryToManage:", err);
            this.sendResponse(res, {
                success: false,
                message:err.message ||  "Internal Server Error"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private sendResponse(res: Response, data: any, status: HttpStatus): void {
        res.status(status).json(data);
    }
}