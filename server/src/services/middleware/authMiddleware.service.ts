import { inject, injectable } from 'inversify';
import { IUserService } from '../../core/interfaces/services/IUserService';

import { TokenVerify } from "../../utils/jwt";
import { TYPES } from "../../di/types";

@injectable()
export class AuthMiddlewareService {
    constructor(
        @inject(TYPES.UserService) private userService: IUserService,
        private readonly accessSecret: string
    ) {
        if (!this.accessSecret) {
            throw new Error("ACCESS_SECRET environment variable is not set");
        }
    }

    async verifyToken(token: string): Promise<any> {
        return await TokenVerify(token, this.accessSecret);
    }

    async checkUserBlocked(userId: string): Promise<boolean> {
        const response = await this.userService.checkBlocked(userId);
        return typeof response === 'boolean' ? response : false;
    }
}