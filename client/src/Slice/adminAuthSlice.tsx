import { createSlice,PayloadAction,createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories } from "../services/Admin/category.service";
import { setInitialCategories, setInitialServices } from "./categoryServiceSlice";
import { useDispatch } from "react-redux";
import { getServices } from "../services/Admin/service.service";

interface AdminState{
    adminAuthenticated:boolean;

}
const initialState :AdminState={
    adminAuthenticated:false
}
export const fetchCategories = createAsyncThunk(
    "adminAuth/fetchCategories",
    async (_, { dispatch }) => {
      try {
        const response = await getCategories();
        if (response?.categories) {
          dispatch(setInitialCategories(response.categories));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
  );
  export const fetchServices = createAsyncThunk(
    "adminAuth/fetchServices",
    async (_, { dispatch }) => {
      try {
        const response = await getServices();
        if (response?.services) {
          dispatch(setInitialServices(response.services));
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    }
  );
const adminAuthSlice=createSlice({
    name:"adminAuth",
    initialState,
    reducers:{
        adminLogin:(state)=>{
          
            state.adminAuthenticated=true
        },
        adminLogout:(state)=>{
            state.adminAuthenticated=false
        }
    }
})
export const {adminLogin,adminLogout}=adminAuthSlice.actions
export default adminAuthSlice.reducer