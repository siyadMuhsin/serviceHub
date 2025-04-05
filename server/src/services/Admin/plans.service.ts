// services/PlansService.ts
import { inject, injectable } from "inversify";
import { IPlanService } from "../../core/interfaces/services/IPlansService";
import { TYPES } from "../../di/types";
import { IPlanRespository } from "../../core/interfaces/repositories/IPlansRepository";
import { IPlan } from "../../models/plans.model";

@injectable()
export class PlansService implements IPlanService {
  constructor(
    @inject(TYPES.PlanRepository) private planRepository: IPlanRespository
  ) {}

  async createPlan(data: Omit<Partial<IPlan>, "durationDisplay">) {
    try {
      if(!data.name)throw new Error ('Name must be requied')
      const existingPlan = await this.planRepository.findOneByName( data.name );
if(existingPlan){
  return {success:false,message:"The Plan Name already taken"}
}
      const plan = await this.planRepository.createPlan(data);
      return {
        success: true,
        message: "Plan created successfully",
        plan: plan,
      };
    } catch (error: any) {
      if (error.code === 11000) {
        return {
          success: false,
          message: "Plan with this name already exists",
        };
      }
      throw error;
    }
  }
  async listAndUnlist(planId: string): Promise<{ success: boolean; message: string; }> {
    try {
        const isPlanAvailable= await this.planRepository.findById(planId)
        if(!isPlanAvailable){
            return {success:false,message:"Plan not fount"}
        }
        const newStatus=!isPlanAvailable.isActive
        await this.planRepository.findByIdAndUpdate(planId,{isActive:newStatus})
        return {success:true,message:`plan ${newStatus?'listed':'unlisted'} successfully`}
    } catch (error:any) {
        throw new Error(error.message)
    }
  }
  async getAllPlans(): Promise<{plans:IPlan[]}> {
    try {
      const plans=await this.planRepository.getAllPlans()
      return {plans}
    } catch (error :any) {
      throw new Error(error.message)
      
    }
  }
  async updatePlan(planId: string, updateData: Partial<IPlan>){
    try {
      const existPlan = await this.planRepository.findById(planId)
      if(!existPlan){
        return {success:false,message:"No matching plan found"}
      }
      const updatedPlan= await this.planRepository.findByIdAndUpdate(planId,updateData)
      if(updatedPlan){
        return {success:true,message:"Plan Updated Successfully",planData:updatedPlan}
      }
      return {success:false,message:"Plan updation failed"}
    } catch (error:any) {
      throw new Error(error.message)
    }
  }
}
