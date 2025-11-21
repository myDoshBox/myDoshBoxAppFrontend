import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const usersAuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;

      if (user) {
        state.userInfo = {
          ...user,
          token: accessToken,
          refreshToken: refreshToken,
        };
      } else {
        state.userInfo = {
          ...state.userInfo,
          token: accessToken,
          refreshToken: refreshToken || state.userInfo?.refreshToken,
        };
      }

      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout } = usersAuthSlice.actions;
export default usersAuthSlice.reducer;
