import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { IUserService } from "../../core/interfaces/services/IUserService";
import { HttpStatus } from "../../types/httpStatus";
import { IUsersController } from "../../core/interfaces/controllers/IUsersController";
import { TYPES } from "../../di/types";

@injectable()
export class UsersController implements IUsersController {
    constructor(
        @inject(TYPES.UserService) private userService: IUserService
    ) {}

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.userService.getUsers();
            this.sendResponse(res, response, HttpStatus.OK, HttpStatus.BAD_REQUEST);
        } catch (error) {
            this.handleError(res, "Failed to fetch users", error);
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

            const response = await this.userService.blockUnblockUser(id, block);
            this.sendResponse(
                res, 
                response, 
                HttpStatus.OK, 
                HttpStatus.BAD_REQUEST
            );
        } catch (error) {
            this.handleError(res, "Failed to update user status", error);
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

    private handleError(res: Response, message: string, error: unknown): void {
        console.error(message, error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}