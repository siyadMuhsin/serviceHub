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
   async findById(id: string): Promise<IPlan | null> {
    const leanDoc= await this.findById(id)
        return this.transformToObject(leanDoc)
    }
   async findByIdAndUpdate(id: string,update:Partial<IPlan>): Promise<IPlan |null> {
    const leanDoc= await this.updateById(id,update)
     return this.transformToObject(leanDoc)
   }
   async getAllPlans(): Promise<IPlan[]> {
    const leanDoc= await this.findAll()
    return this.transformAllToObjects(leanDoc)
   }
   async findOneByName(name: string): Promise<IPlan | null> {
    const leanDoc= await this.findOne({name})
    return this.transformToObject(leanDoc)
   }
   async findMany(query:Partial<PlainPlan>): Promise<IPlan[] | null> {
    return await Plans.find(query) || null;
  }
}