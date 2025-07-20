import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { IServiceService } from "../../core/interfaces/services/IServiceService";
import { HttpStatus } from "../../types/httpStatus";
import { IServiceController } from '../../core/interfaces/controllers/IServiceController';



import { TYPES } from "../../di/types";
import logger from '../../config/logger';

@injectable()
export class ServiceController implements IServiceController {
    constructor(
        @inject(TYPES.ServiceService) private _serviceService: IServiceService
    ) {}

    async createService(req: Request, res: Response): Promise<void> {
        try {
            const { name, categoryId, description } = req.body;
            if (!name?.trim() || !categoryId?.trim() || !description?.trim()) {
                this.sendResponse(res, {
                    success: false,
                    message: "All fields are required"
                }, HttpStatus.BAD_REQUEST);
                return;
            }
            if (!req.file) {
                this.sendResponse(res, {
                    success: false,
                    message: "Image is required"
                }, HttpStatus.BAD_REQUEST);
                return;
            }

            const response = await this._serviceService.createService(
                name,
                categoryId,
                description,
                req.file
            );

            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            const err= error as Error
            this.sendErrorResponse(res, err);
        }
    }

    async getAllServices(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._serviceService.getAllServices();
            this.sendResponse(res, response, HttpStatus.OK);
        } catch (error) {
            const err= error as Error
            this.sendErrorResponse(res, err);
        }
    }

    async getServiceById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this._serviceService.getServiceById(id);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND);
        } catch (error) {
            const err= error as Error
            this.sendErrorResponse(res, err);
        }
    }

    async getServicesByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { categoryId } = req.params;
            const response = await this._serviceService.getServicesByCategory(categoryId);
            this.sendResponse(res, response, HttpStatus.OK);
        } catch (error) {
            const err= error as Error
            this.sendErrorResponse(res, err);
        }
    }

    async updateService(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this._serviceService.updateService(
                id,
                req.body,
                req.file
            );
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            const err= error as Error
            this.sendErrorResponse(res, err);
        }
    }

    async list_and_unlist(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this._serviceService.changeStatus(id);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            const err= error as Error
            this.sendErrorResponse(res, err);
        }
    }

    async getServicesByCategory_limit(req: Request, res: Response): Promise<void> {
        try {
            const { categoryId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;
            const search = typeof req.query.searchQuary === "string" 
                ? req.query.searchQuary 
                : "";

            if (!categoryId) {
                this.sendResponse(res, {
                    error: "Category ID is required"
                }, HttpStatus.BAD_REQUEST);
                return;
            }

            const { services, totalServices } = await this._serviceService.getServicesByCategory_limit(
                categoryId,
                page,
                limit,
                search
            );

            this.sendResponse(res, {
                success: true,
                services,
                currentPage: page,
                totalPages: Math.ceil(totalServices / limit),
            }, HttpStatus.OK);
        } catch (error) {
            const err= error as Error
            this.sendErrorResponse(res, err);
        }
    }

    async getServicesToMange(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = typeof req.query.search === 'string' 
                ? req.query.search 
                : "";
            const { services, totalServices } = await this._serviceService.getServicesToMange(page, limit, search);
            this.sendResponse(res, {
                success: true,
                services,
                currentPage: page,
                totalPage: Math.ceil(totalServices / limit)
            }, HttpStatus.OK);
        } catch (error) {
            const err= error as Error
            this.sendErrorResponse(res, err);
        }
    }

    private sendResponse(res: Response, data: any, status: HttpStatus): void {
        res.status(status).json(data);
    }

    private sendErrorResponse(res: Response, error:Error): void {
        logger.error("Error:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}