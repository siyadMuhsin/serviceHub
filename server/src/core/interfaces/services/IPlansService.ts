import { IPlan } from "../../../models/plans.model";

export interface IPlanService {
  createPlan(data: Omit<Partial<IPlan>, "durationDisplay">): Promise<{
    success: boolean;
    message: string;
    plan?: IPlan;
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
    planData?: IPlan;
  }>;
  getAllPlans(): Promise<{plans:IPlan[]}>;
  availablePlans():Promise<{
    success:boolean,
    plans:IPlan[]}>
} 