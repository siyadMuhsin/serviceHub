import { Request, Response } from "express";

export interface IUsersController {
    getUsers(req: Request, res: Response): Promise<void>;
    block_unblockUser(req: Request, res: Response): Promise<void>;
}