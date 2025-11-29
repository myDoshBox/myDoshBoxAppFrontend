// profileAuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileInfo: null,
  bankDetails: null,
};

const profileAuthSlice = createSlice({
  name: "profileAuth",
  initialState,
  reducers: {
    setProfileInfo: (state, action) => {
      state.profileInfo = action.payload;
    },
    setBankDetails: (state, action) => {
      state.bankDetails = action.payload;
    },
    clearProfileInfo: (state) => {
      state.profileInfo = null;
      state.bankDetails = null;
    },
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      if (state.profileInfo) {
        state.profileInfo[field] = value;
      }
    },
  },
});

export const {
  setProfileInfo,
  setBankDetails,
  clearProfileInfo,
  updateProfileField,
} = profileAuthSlice.actions;

export default profileAuthSlice.reducer;
