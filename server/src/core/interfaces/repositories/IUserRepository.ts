import { FilterQuery, LeanDocument, UpdateQuery } from "mongoose";
import { IUser } from "../../../models/user.model";
import { IExpert } from "../../../types/Expert";
import { IServices } from "../../../types/Admin";

export interface IUserRepository {
  findAll(): Promise<LeanDocument<IUser>[]>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  findOne(quary: Partial<IUser>): Promise<LeanDocument<IUser> | null>;
  findById(id: string): Promise<LeanDocument<IUser> | null>;
  updateById(id: string, update: Partial<IUser>): Promise<IUser | null>;
  findUserAndUpdate(email: string, update: Partial<IUser>): Promise<IUser | null>;
  findOneBYToken(token: string): Promise<IUser | null>;
  findByIdClearToken(token:string,password:string):Promise <IUser |null>;
  getExpertByUserId(id:string):Promise<IExpert |null>
  addToSavedServices(userId:string,serviceId:string):Promise<void>
  removeFromSavedServices(userId:string,serviceId:string):Promise<void>
  findUserWithSavedServices(userId:string):Promise<IUser>

}