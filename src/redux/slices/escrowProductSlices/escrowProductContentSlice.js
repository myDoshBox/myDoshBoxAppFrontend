import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //   userInfo: localStorage.getItem("productInfo")
  //     ? JSON.parse(localStorage.getItem("userInfo"))
  //     : null,

  escrowProductInfo: null,
  shippingInfo: null,
};

const escrowProductInfoSlice = createSlice({
  name: "escrowProduct",
  initialState,
  reducers: {
    setEscrowProduct: (state, action) => {
      state.escrowProductInfo = action.payload;
    },

    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
  },
});

// const shippingInfoSlice = createSlice({
//   name: "shippingInfo",
//   initialState,
//   reducers: {
//     setShippingInfo: (state, action) => {
//       state.shippingInfo = action.payload;
//     },
//   },
// });

export const { setEscrowProduct, setShippingInfo } =
  escrowProductInfoSlice.actions;

export default escrowProductInfoSlice.reducer;
