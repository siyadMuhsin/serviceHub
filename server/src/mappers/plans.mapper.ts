
import { IPlan } from "../models/plans.model";

export interface PlanDTO {
    _id:string;
    name:string;
    durationMonths: number;
  durationDisplay: string;
  price: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export const mapPlanToDTO = (plan: IPlan): PlanDTO => {
    return {
        _id: plan._id.toString(),
        name: plan.name,
        durationMonths: plan.durationMonths,
        durationDisplay: plan.durationDisplay,
        isActive:plan.isActive,
        price:plan.price
    };
};
