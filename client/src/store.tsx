import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import adminAuthReducer from './Slice/adminAuthSlice'
import locationReducer from './Slice/locationSlice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
        adminAuth:adminAuthReducer,
        location:locationReducer
      
    }
})
export type RootState= ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;