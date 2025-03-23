import { createSlice,PayloadAction,createAsyncThunk } from "@reduxjs/toolkit";


interface AdminState{
    adminAuthenticated:boolean;

}
const initialState :AdminState={
    adminAuthenticated:false
}

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