import { IPlan } from "../../../models/plans.model";

export interface IPlanRespository{
    createPlan(planData:Partial<IPlan>):Promise<IPlan>
    findById(id:string):Promise<IPlan | null>
    findByIdAndUpdate(id:string,update:Partial<IPlan>):Promise<IPlan |null>
    getAllPlans():Promise<IPlan[]>
    findOneByName(name:string):Promise <IPlan |null>

}