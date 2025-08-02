import { PlanDTO } from "../../../mappers/plans.mapper";
import { IPlan } from "../../../models/plans.model";

export interface IPlanService {
  createPlan(data: Omit<Partial<IPlan>, "durationDisplay">): Promise<{
    success: boolean;
    message: string;
    plan?: PlanDTO;
  }>;
  listAndUnlist(planId: string): Promise<{
    success: boolean;
    message: string;
  }>;
  updatePlan(
    planId: string,
    updateData: Partial<IPlan>
  ): Promise<{
    success: boolean;
    message: string;
    planData?: PlanDTO;
  }>;
  getAllPlans(): Promise<{plans:PlanDTO[]}>;
  availablePlans():Promise<{
    success:boolean,
    plans:PlanDTO[]}>
} 