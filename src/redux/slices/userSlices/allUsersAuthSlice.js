import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Persist user info across page reloads
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const usersAuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // action.payload should be the backend response containing "user"
      state.userInfo = action.payload.user;
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      // no need to remove tokens—they are HttpOnly cookies
    },
  },
});

export const { setCredentials, logout } = usersAuthSlice.actions;
export default usersAuthSlice.reducer;





// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   userInfo: localStorage.getItem("userInfo")
//     ? JSON.parse(localStorage.getItem("userInfo"))
//     : null,
// };

// const usersAuthSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       state.userInfo = action.payload;
//       localStorage.setItem("userInfo", JSON.stringify(action.payload));
//     },

//     logout: (state) => {
//       state.userInfo = null;
//       localStorage.removeItem("userInfo");
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//     },
//   },
// });

// export const { setCredentials, logout } = usersAuthSlice.actions;

// export default usersAuthSlice.reducer;
