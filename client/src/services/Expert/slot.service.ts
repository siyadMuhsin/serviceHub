import { ISlot } from "@/Interfaces/interfaces";
import { expertAPI } from "config/axiosConfig";
import { FaAws } from "react-icons/fa";

const getExpertSlot = async () => {
  try {
    const response = await expertAPI.get("/slots");
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
const createSlot = async (data: Partial<ISlot>) => {
  try {
    const response = await expertAPI.post("/slot", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
const deleteSlot = async (slotId: string) => {
  try {
    const response = await expertAPI.delete(`/slot/${slotId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
export { getExpertSlot, createSlot, deleteSlot };
