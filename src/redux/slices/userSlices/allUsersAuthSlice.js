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
      console.log("🔄 setCredentials payload:", action.payload);

      const { user, accessToken, refreshToken } = action.payload;

      // Store the user data directly (not nested)
      state.userInfo = {
        ...user, // This spreads: { id, email, phone_number, role }
        token: accessToken,
        refreshToken: refreshToken,
      };

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
