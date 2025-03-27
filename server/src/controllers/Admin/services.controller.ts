import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { IServiceService } from "../../core/interfaces/services/IServiceService";
import { HttpStatus } from "../../types/httpStatus";
import { IServiceController } from '../../core/interfaces/controllers/IServiceController';



import { TYPES } from "../../di/types";

@injectable()
export class ServiceController implements IServiceController {
    constructor(
        @inject(TYPES.ServiceService) private serviceService: IServiceService
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

            const response = await this.serviceService.createService(
                name,
                categoryId,
                description,
                req.file
            );

            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error: any) {
            this.sendErrorResponse(res, error);
        }
    }

    async getAllServices(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.serviceService.getAllServices();
            this.sendResponse(res, response, HttpStatus.OK);
        } catch (error: any) {
            this.sendErrorResponse(res, error);
        }
    }

    async getServiceById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this.serviceService.getServiceById(id);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND);
        } catch (error: any) {
            this.sendErrorResponse(res, error);
        }
    }

    async getServicesByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { categoryId } = req.params;
            const response = await this.serviceService.getServicesByCategory(categoryId);
            this.sendResponse(res, response, HttpStatus.OK);
        } catch (error: any) {
            this.sendErrorResponse(res, error);
        }
    }

    async updateService(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this.serviceService.updateService(
                id,
                req.body,
                req.file
            );
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error: any) {
            this.sendErrorResponse(res, error);
        }
    }

    async ist_and_unlist(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this.serviceService.changeStatus(id);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (err: any) {
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

            const { services, totalServices } = await this.serviceService.getServicesByCategory_limit(
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
        } catch (error: any) {
            this.sendErrorResponse(res, error);
        }
    }

    async getServicesToMange(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = typeof req.query.search === 'string' 
                ? req.query.search 
                : "";

            const { services, totalServices } = await this.serviceService.getServicesToMange(page, limit, search);

            this.sendResponse(res, {
                success: true,
                services,
                currentPage: page,
                totalPage: Math.ceil(totalServices / limit)
            }, HttpStatus.OK);
        } catch (error: any) {
            this.sendErrorResponse(res, error);
        }
    }

    private sendResponse(res: Response, data: any, status: HttpStatus): void {
        res.status(status).json(data);
    }

    private sendErrorResponse(res: Response, error: any): void {
        console.error("Error:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}