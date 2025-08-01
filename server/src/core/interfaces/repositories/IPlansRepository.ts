import { IPlan, PlainPlan } from "../../../models/plans.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IPlanRespository extends IBaseRepository<IPlan>{
    createPlan(planData:Partial<IPlan>):Promise<IPlan>
    // findById(id:string):Promise<IPlan | null>
    // updateById(id:string,update:Partial<IPlan>):Promise<IPlan |null>
    // findAll():Promise<IPlan[]>
    // findOne(quary:Partial<IPlan>):Promise <IPlan |null>
    // findMany(quary:Partial<PlainPlan>):Promise<IPlan[] | null>


}