// features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
role:string
  otpSent: boolean;
  otpVerified: boolean;
  isAuthenticated:boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  role:'user',
  error: null,
  otpSent: false,
  otpVerified: false,
  isAuthenticated:false,
  
  

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signUpStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signUpSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.otpSent = true;
      state.user = action.payload;
    },
    signUpFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    verifyOtpStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    verifyOtpSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.otpVerified = true;
      state.otpSent=false;
      state.user = action.payload;
    },
    verifyOtpFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.otpSent = false;
      state.otpVerified = false;
    },
    changeRole(state, action) {
      console.log(action.payload)
    state.role=action.payload
  },
    setUser:(state,action)=>{
      state.user=action.payload.user

    },
    updateUser: (state, action) => {
      if (action.payload) {
        state.user = {
          ...state.user, 
          ...action.payload, 
        };
      }
    },
    // login actions
    loginStart:(state)=>{
      state.loading= true;
      state.error=null
    },
    loginSuccess:(state,action:PayloadAction<any>)=>{
    
      state.loading=false;
      state.user= action.payload.user;
      state.isAuthenticated=true
     
    },
    loginFailure:(state,action:PayloadAction<any>)=>{
      state.loading=false,
      state.error=action.payload
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },


  },
});

export const {
  signUpStart,
  signUpSuccess,
  signUpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  resetAuthState,
  loginFailure,
  loginStart,
  loginSuccess,
  changeRole,
  updateUser,
  setUser,
  logout
} = authSlice.actions;

export default authSlice.reducer;