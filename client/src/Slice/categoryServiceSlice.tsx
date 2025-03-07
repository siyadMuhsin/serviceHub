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
    services: []
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
        toggleCategoryStatus: (state, action: PayloadAction<{ id: string; status: boolean }>) => {
           console.log(action.payload.status)
            state.categories = state.categories.map(category =>
                category._id === action.payload.id ? { ...category, isActive: !action.payload.status } : category
            );
        }
    }
});

export const { setInitialCategories, setInitialServices ,addToCategories,toggleCategoryStatus} = categoryServiceSlice.actions;
export default categoryServiceSlice.reducer;
