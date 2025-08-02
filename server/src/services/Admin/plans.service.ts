// services/PlansService.ts
import { inject, injectable } from "inversify";
import { IPlanService } from "../../core/interfaces/services/IPlansService";
import { TYPES } from "../../di/types";
import { IPlanRespository } from "../../core/interfaces/repositories/IPlansRepository";
import { IPlan } from "../../models/plans.model";
import { mapPlanToDTO, PlanDTO } from "../../mappers/plans.mapper";

@injectable()
export class PlansService implements IPlanService {
  constructor(
    @inject(TYPES.PlanRepository) private _planRepository: IPlanRespository
  ) {}

  async createPlan(data: Omit<Partial<IPlan>, "durationDisplay">) {
    try {
      if (!data.name) throw new Error("Name must be requied");
      const existingPlan = await this._planRepository.findOne({
        name: data.name,
      });
      if (existingPlan) {
        return { success: false, message: "The Plan Name already taken" };
      }
      const plan = await this._planRepository.createPlan(data);
      const planToDTO=mapPlanToDTO(plan)
      return {
        success: true,
        message: "Plan created successfully",
        plan: planToDTO,
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
  async listAndUnlist(
    planId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const isPlanAvailable = await this._planRepository.findById(planId);
      if (!isPlanAvailable) {
        return { success: false, message: "Plan not fount" };
      }
      const newStatus = !isPlanAvailable.isActive;
      await this._planRepository.updateById(planId, { isActive: newStatus });
      return {
        success: true,
        message: `plan ${newStatus ? "listed" : "unlisted"} successfully`,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message);
    }
  }
  async getAllPlans(): Promise<{ plans: PlanDTO[] }> {
    try {
      const plans = await this._planRepository.findAll();
      const plansToDTO=plans.map((x)=>mapPlanToDTO(x))
      return { plans:plansToDTO };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message);
    }
  }
  async updatePlan(planId: string, updateData: Partial<IPlan>) {
    try {
      const existPlan = await this._planRepository.findById(planId);
      if (!existPlan) {
        return { success: false, message: "No matching plan found" };
      }
      const query = { _id: { $ne: existPlan._id }, name: updateData.name };
      const existingName = await this._planRepository.findOne(query);
      if (existingName)
        return { success: false, message: "The Plan name already exist" };
      const updatedPlan = await this._planRepository.updateById(
        planId,
        updateData
      );
      if (updatedPlan) {
        const planToDTO=mapPlanToDTO(updatedPlan)
        return {
          success: true,
          message: "Plan Updated Successfully",
          planData: planToDTO,
        };
      }
      return { success: false, message: "Plan updation failed" };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message);
    }
  }
  async availablePlans(): Promise<{ success: boolean; plans: PlanDTO[] }> {
    try {
      const plans = await this._planRepository.findMany({ isActive: true });
const plansToDTO=plans.map((x)=>mapPlanToDTO(x))
      if (plans) {
        return { success: true, plans:plansToDTO };
      }
      throw new Error("No Plans are available");
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || "Failed to fetchplans");
    }
  }
}
