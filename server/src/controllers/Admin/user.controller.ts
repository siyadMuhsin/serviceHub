import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { IUserService } from "../../core/interfaces/services/IUserService";
import { HttpStatus } from "../../types/httpStatus";
import { IUsersController } from "../../core/interfaces/controllers/IUsersController";
import { TYPES } from "../../di/types";
import { AuthRequest } from '../../types/User';
import logger from '../../config/logger';

@injectable()
export class UsersController implements IUsersController {
    constructor(
        @inject(TYPES.UserService) private _userService: IUserService
    ) {}

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const search = req.query.search as string || "";
            const response = await this._userService.getUsers(page, limit, search);
            
            if (response.success) {
                this.sendResponse(res, response, HttpStatus.OK);
            } else {
                this.sendResponse(res, response, HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            const err= error as Error
            this.handleError(res, "Failed to fetch users", err);
        }
    }

    async block_unblockUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { block } = req.body;
            if (typeof block !== "boolean") {
                this.sendResponse(
                    res, 
                    { success: false, message: "Invalid status value" }, 
                    HttpStatus.BAD_REQUEST
                );
                return;
            }
            const response = await this._userService.blockUnblockUser(id, block);
            this.sendResponse(
                res, 
                response, 
                HttpStatus.OK, 
                HttpStatus.BAD_REQUEST
            );
        } catch (error) {
            const err= error as Error
            this.handleError(res, "Failed to update user status", err);
        }
    }
    async getLatestUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const {users}=await this._userService.getUsers(1,3,"")
            res.status(HttpStatus.OK).json(users)
        } catch (error) {
            const err= error as Error
            this.sendResponse(res,{message:err.message||"Interval server Error"},HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private sendResponse(
        res: Response,
        data: any,
        successStatus: HttpStatus,
        errorStatus?: HttpStatus
    ): void {
        const status = data.success ? successStatus : (errorStatus || HttpStatus.BAD_REQUEST);
        res.status(status).json(data);
    }

    private handleError(res: Response, message: string, error: Error): void {
        logger.error(message, error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            message:error.message || "Internal server error" 
        });
    }
}