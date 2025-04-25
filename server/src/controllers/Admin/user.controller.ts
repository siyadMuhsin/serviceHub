import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { IUserService } from "../../core/interfaces/services/IUserService";
import { HttpStatus } from "../../types/httpStatus";
import { IUsersController } from "../../core/interfaces/controllers/IUsersController";
import { TYPES } from "../../di/types";
import { AuthRequest } from '../../types/User';

@injectable()
export class UsersController implements IUsersController {
    constructor(
        @inject(TYPES.UserService) private userService: IUserService
    ) {}

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const search = req.query.search as string || "";
            const response = await this.userService.getUsers(page, limit, search);
            
            if (response.success) {
                this._sendResponse(res, response, HttpStatus.OK);
            } else {
                this._sendResponse(res, response, HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            this._handleError(res, "Failed to fetch users", error);
        }
    }

    async block_unblockUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { block } = req.body;

            if (typeof block !== "boolean") {
                this._sendResponse(
                    res, 
                    { success: false, message: "Invalid status value" }, 
                    HttpStatus.BAD_REQUEST
                );
                return;
            }

            const response = await this.userService.blockUnblockUser(id, block);
            this._sendResponse(
                res, 
                response, 
                HttpStatus.OK, 
                HttpStatus.BAD_REQUEST
            );
        } catch (error) {
            this._handleError(res, "Failed to update user status", error);
        }
    }
    async getLatestUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const {users}=await this.userService.getUsers(1,3,"")
            res.status(HttpStatus.OK).json(users)
        } catch (error) {
            this._sendResponse(res,{message:"Interval server Error"},HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private _sendResponse(
        res: Response,
        data: any,
        successStatus: HttpStatus,
        errorStatus?: HttpStatus
    ): void {
        const status = data.success ? successStatus : (errorStatus || HttpStatus.BAD_REQUEST);
        res.status(status).json(data);
    }

    private _handleError(res: Response, message: string, error: unknown): void {
        console.error(message, error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}