import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react";

// interface Category {
//     id: string;
//     name: string;
//     description: string;
//     image: string;
// }

// interface Service {
//     id: string;
//     name: string;
//     description: string;
//     image: string;
// }

interface CategoryServiceState {
  categories: [];
  services: [];
}

const initialState: CategoryServiceState = {
  categories: [],
  services: [],
};

const categoryServiceSlice = createSlice({
  name: "categoryService",
  initialState,
  reducers: {
    setInitialCategories: (state, action: PayloadAction<[]>) => {
      state.categories = action.payload;
    },
    setInitialServices: (state, action: PayloadAction<[]>) => {
      state.services = action.payload;
    },
    addToCategories: (state, action: PayloadAction<any>) => {
      state.categories.push(action.payload);
    },
    toggleCategoryStatus: (
      state,
      action: PayloadAction<{ id: string; status: boolean }>
    ) => {
      state.categories = state.categories.map((category) =>
        category._id === action.payload.id
          ? { ...category, isActive: !action.payload.status }
          : category
      );
    },
    updateCategory: (state, action: PayloadAction<any>) => {
      state.categories = state.categories.map((category) =>
        category._id === action.payload._id ? action.payload : category
      );
    },toggleServiceStatus: (
        state,
        action: PayloadAction<{ id: string; status: boolean }>
      ) => {
        state.services = state.services.map((service) =>
          service._id === action.payload.id
            ? { ...service, isActive: !action.payload.status }
            : service
        );
      },
    addToServices: (state, action: PayloadAction<any>) => {
      state.services.push(action.payload);
    },
    updateService:(state,action:PayloadAction<any>)=>{
        console.log(action.payload)
        state.services=state.services.map((service)=>
            service._id==action.payload._id ? action.payload : service
        )

    }
  },
});

export const {
  setInitialCategories,
  setInitialServices,
  addToCategories,
  toggleCategoryStatus,
  updateCategory,
  addToServices,
  updateService,
  toggleServiceStatus
} = categoryServiceSlice.actions;
export default categoryServiceSlice.reducer;
