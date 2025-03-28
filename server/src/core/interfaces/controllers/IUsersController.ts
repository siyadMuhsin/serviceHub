import { Request, Response } from "express";
import { AuthRequest } from "../../../types/User";

export interface IUsersController {
    getUsers(req: Request, res: Response): Promise<void>;
    block_unblockUser(req: Request, res: Response): Promise<void>;
  
}