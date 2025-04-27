import { inject, injectable } from 'inversify';
import { IUserService } from '../../core/interfaces/services/IUserService';

import { TokenVerify } from "../../utils/jwt";
import { TYPES } from "../../di/types";
import { IExpertService } from '../../core/interfaces/services/IExpertService';

@injectable()
export class AuthMiddlewareService {
    constructor(
        @inject(TYPES.UserService) private _userService: IUserService,
        @inject(TYPES.ExpertService) private _expertService:IExpertService,
        private readonly _accessSecret: string
    ) {
        if (!this._accessSecret) {
            throw new Error("ACCESS_SECRET environment variable is not set");
        }
    }

    async verifyToken(token: string): Promise<any> {
        return await TokenVerify(token, this._accessSecret);
    }

    async checkUserBlocked(userId: string): Promise<boolean> {
        const response = await this._userService.checkBlocked(userId);
        return typeof response === 'boolean' ? response : false;
    }
    async checkExpertBlocked(expertId:string):Promise<boolean>{
        const response= await this._expertService.checkBlocked(expertId)
        return typeof response==='boolean' ? response :false
 
    }
}