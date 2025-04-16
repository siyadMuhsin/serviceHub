// repositories/PlanRepository.ts
import { IPlanRespository } from "../../core/interfaces/repositories/IPlansRepository";
import Plans, { IPlan, PlainPlan } from "../../models/plans.model";
import { BaseRepository } from "../BaseRepository";

export class PlanRepository extends BaseRepository<IPlan> implements IPlanRespository {
    constructor(){
        super(Plans)
    }
    async createPlan(planData: Omit<Partial<IPlan>, 'durationDisplay'>): Promise<IPlan> {
        return this.create(planData)

    }

}