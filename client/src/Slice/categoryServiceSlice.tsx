import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        }
    }
});

export const { setInitialCategories, setInitialServices } = categoryServiceSlice.actions;
export default categoryServiceSlice.reducer;
