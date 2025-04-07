import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userLocation: { lat: null, lng: null, address: null },
  expertLocation: { lat: null, lng: null, address: null },
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setUserLocation: (state, action) => {
      state.userLocation = action.payload; // { lat, lng, address }
    },
    setExpertLocation: (state, action) => {
      console.log('from slice',action.payload)
      state.expertLocation = action.payload; // { lat, lng, address }
    },
    resetLocations: (state) => {
      
      state.userLocation = { lat: null, lng: null, address: null };
      state.expertLocation = { lat: null, lng: null, address: null };
    },
  },
});

export const { setUserLocation, setExpertLocation, resetLocations } = locationSlice.actions;
export default locationSlice.reducer;
