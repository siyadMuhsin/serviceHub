import { inject, injectable } from 'inversify';
import { AuthRequest } from "../../types/User";
import { Response } from "express";
import { IExpertService } from "../../core/interfaces/services/IExpertService";
import { HttpStatus } from "../../types/httpStatus";
import { IExpertDataController } from "../../core/interfaces/controllers/IExpertDataController";
import { TYPES } from "../../di/types";

@injectable()
export class ExpertDataController implements IExpertDataController {
    constructor(
        @inject(TYPES.ExpertService) private expertService: IExpertService
    ) {}

    async get_expertData(req: AuthRequest, res: Response): Promise<void> {
        try {
            const expertId = req.expert?.expertId; 
            if (!expertId) {
                this.sendErrorResponse(res, 'Expert ID is missing', HttpStatus.BAD_REQUEST);
                return;
            }

            const response = await this.expertService.getExpertData(expertId);
            this.sendResponse(res, response, response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
        } catch (error) {
            console.error('Error fetching expert data:', error);
            this.sendErrorResponse(res, 'Internal server error');
        }
    }

    private sendResponse(res: Response, data: any, status: HttpStatus): void {
        res.status(status).json(data);
    }

    private sendErrorResponse(res: Response, message: string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR): void {
        res.status(status).json({ 
            success: false, 
            message 
        });
    }
}