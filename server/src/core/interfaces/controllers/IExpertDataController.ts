    import {  Response } from "express";
import { AuthRequest } from "../../../types/User";
export interface IExpertDataController {
    get_expertData(req: AuthRequest, res: Response): Promise<void>;
}