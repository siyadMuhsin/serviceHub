import { IPlan } from "../../../models/plans.model";

export interface IPlanService{
    createPlan(data: Omit<Partial<IPlan>, 'durationDisplay'>):Promise<{
        success:boolean,
        message:string,
        plan?:IPlan
    }>
    listAndUnlist(planId:string):Promise<{
        success:boolean,message:string
    }>
} 