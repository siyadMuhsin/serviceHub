import { adminAPI } from "config/axiosConfig";
import { ArrowUpWideNarrow } from "lucide-react";
interface IPlanRequest {
  name: string;
  durationMonths: number;
  price: number;
}

const createPlan = async (data: IPlanRequest) => {
  try {
    const response = await adminAPI.post("/plan", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create plan");
  }
};
const getAllPlans = async () => {
  try {
    const response = await adminAPI.get("/plans");
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
const actionChange = async (planId: string) => {
  try {
    const response = await adminAPI.patch(`/plan/${planId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.resonse.data.message);
  }
};
const updatePlan = async (
  planId: string,
  updateData: Partial<IPlanRequest>
) => {
  try {
    console.log(updateData, "from service");
    const response = await adminAPI.put(`/plan/${planId}`, updateData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

const getAllEarnings=async(plan:string,page:number,limit:number)=>{
  try {
    const response= await adminAPI.get(`/earnings?page=${page}&limit=${limit}&plan=${plan}`)
    return response.data
  } catch (error) {
    throw new Error(error?.response?.data?.message)
    
  }
}
export { createPlan, getAllPlans, actionChange, updatePlan,getAllEarnings };
