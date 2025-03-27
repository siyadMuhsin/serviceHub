import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { IExpertService } from "../../core/interfaces/services/IExpertService";
import { HttpStatus } from "../../types/httpStatus";
import { IExpertController } from "../../core/interfaces/controllers/IExpertController";
import { TYPES } from "../../di/types";
import { setAuthCookies } from '../../utils/setAuthCookies ';
import { AuthRequest } from '../../types/User';


@injectable()
export class ExpertController implements IExpertController {
    constructor(
        @inject(TYPES.ExpertService) private expertService: IExpertService
    ) {}

    async createExpert(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.file) {
                this.sendResponse(res, {
                    success: false,
                    error: "Certificate file is required!"
                }, HttpStatus.BAD_REQUEST);
                return;
            }

            const expert = await this.expertService.createExpert(
                req.body,
                req.file,
                req.user.userId
            );
            
            this.sendResponse(res, {
                success: true,
                message: "Expert created successfully",
                expert,
            }, HttpStatus.CREATED);
        } catch (error: any) {
            this.sendErrorResponse(res, error);
        }
    }

    async getExperts(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const filter = req.query.filter as string;
            const search = req.query.search as string;
            
            const response = await this.expertService.getExpertBy_limit(
                page,
                limit,
                filter,
                search
            );
            
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            this.sendErrorResponse(res, error);
        }
    }

    async actionChange(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { action ,reason} = req.body;
            const validActions = ["approved", "rejected"];
            
            if (!validActions.includes(action)) {
                this.sendResponse(res, {
                    success: false,
                    message: "Invalid action"
                }, HttpStatus.BAD_REQUEST);
                return;
            }
            
            if (!id || !action) {
                this.sendResponse(res, {
                    success: false,
                    message: "Missing required parameters"
                }, HttpStatus.BAD_REQUEST);
                return;
            }
            
            const response = await this.expertService.actionChange(id, action,reason);
            this.sendResponse(res, response, response?.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            this.sendErrorResponse(res, error);
        }
    }

    async blockAndUnlockExpert(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { active } = req.body;
            
            if (!id || typeof active !== 'boolean') {
                this.sendResponse(res, {
                    success: false,
                    message: "Missing or invalid parameters"
                }, HttpStatus.BAD_REQUEST);
                return;
            }
            
            const response = await this.expertService.block_unblock(id, active);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            this.sendErrorResponse(res, error);
        }
    }

    async getExpertData(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this.expertService.getExpertData(id);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            this.sendErrorResponse(res, error);
        }
    }

    async switch_expert(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                this.sendResponse(res, {
                    success: false,
                    message: "User not found"
                }, HttpStatus.BAD_REQUEST);
                return;
            }
            
            const response = await this.expertService.switch_expert(userId);
            if (response.success && response.accessToken && response.refreshToken) {
                await setAuthCookies(res, response.accessToken, response.refreshToken);
                this.sendResponse(res, response, HttpStatus.OK);
                return;
            }
            
            this.sendResponse(res, response, HttpStatus.BAD_REQUEST);
        } catch (error) {
            this.sendErrorResponse(res, error);
        }
    }

    async switch_user(req: AuthRequest, res: Response): Promise<void> {
        try {
            const expertId = req?.expert?.expertId;
            if (!expertId) {
                this.sendResponse(res, {
                    success: false,
                    message: "Expert not found"
                }, HttpStatus.BAD_REQUEST);
                return;
            }
            
            const response = await this.expertService.switch_user(expertId);
            if (response.success && response.accessToken && response.refreshToken) {
                await setAuthCookies(res, response.accessToken, response.refreshToken);
            }
            this.sendResponse(res, response, HttpStatus.OK);
        } catch (err) {
            this.sendErrorResponse(res, err);
        }
    }

    private sendResponse(res: Response, data: any, status: HttpStatus): void {
        res.status(status).json(data);
    }

    private sendErrorResponse(res: Response, error: any): void {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Internal server error" 
        });
    }
}