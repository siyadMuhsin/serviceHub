import { IUser } from "../../../models/user.model";
import { IExpert } from "../../../types/Expert";

export interface IUserRepository {
  getAlluser(): Promise<IUser[]>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;
  findByIdAndUpdate(id: string, update: Partial<IUser>): Promise<IUser | null>;
  findUserAndUpdate(email: string, update: Partial<IUser>): Promise<IUser | null>;
  findOneBYToken(token: string): Promise<IUser | null>;
  findByIdClearToken(token:string,password:string):Promise <IUser |null>;
  getExpertByUserId(id:string):Promise<IExpert |null>
}