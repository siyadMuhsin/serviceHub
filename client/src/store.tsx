import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import adminAuthReducer from './Slice/adminAuthSlice'
import categoryService from './Slice/categoryServiceSlice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
        adminAuth:adminAuthReducer,
        categoryService:categoryService,
    }
})
export type RootState= ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;