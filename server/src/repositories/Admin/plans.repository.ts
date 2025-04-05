// repositories/PlanRepository.ts
import { IPlanRespository } from "../../core/interfaces/repositories/IPlansRepository";
import Plans, { IPlan } from "../../models/plans.model";

export class PlanRepository implements IPlanRespository {
    async createPlan(planData: Omit<Partial<IPlan>, 'durationDisplay'>): Promise<IPlan> {
        const plan = new Plans(planData);
        return await plan.save();
    }
   async findById(id: string): Promise<IPlan | null> {
        return await Plans.findById(id)
    }
   async findByIdAndUpdate(id: string,update:Partial<IPlan>): Promise<IPlan |null> {
       return await Plans.findByIdAndUpdate(id,update,{new:true})
   }
   async getAllPlans(): Promise<IPlan[]> {
       return await Plans.find()
   }
   async findOneByName(name: string): Promise<IPlan | null> {
    return await Plans.findOne({name});
}
}