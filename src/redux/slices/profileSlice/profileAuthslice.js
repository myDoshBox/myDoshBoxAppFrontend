import { createSlice } from "@reduxjs/toolkit";
import { profileAPISlice } from "./profileAPISlice";
import { logout } from "../userSlices/allUsersAuthSlice";

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
  extraReducers: (builder) => {
    builder.addMatcher(
      profileAPISlice.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        state.profileInfo = action.payload.data.profile;
      }
    );

    builder.addMatcher(
      profileAPISlice.endpoints.updateProfile.matchFulfilled,
      (state, action) => {
        if (action.payload.data.profile) {
          state.profileInfo = action.payload.data.profile;
        }
      }
    );

    builder.addMatcher(
      profileAPISlice.endpoints.uploadProfileImage.matchFulfilled,
      (state, action) => {
        if (action.payload.data.profile) {
          state.profileInfo = action.payload.data.profile;
        }
      }
    );

    // Clear profile state on logout
    builder.addMatcher(
      (action) => action.type === logout.type,
      (state) => {
        state.profileInfo = null;
        state.bankDetails = null;
      }
    );
  },
});

export const {
  setProfileInfo,
  setBankDetails,
  clearProfileInfo,
  updateProfileField,
} = profileAuthSlice.actions;

export default profileAuthSlice.reducer;
