import { Request, Response } from "express";
import { HttpStatus } from "../../../types/httpStatus";

export interface ITokenController {
    userRefreshToken(req: Request, res: Response): Promise<void>;
    adminRefreshToken(req: Request, res: Response): Promise<void>;
}