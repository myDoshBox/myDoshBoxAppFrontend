import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //   userInfo: localStorage.getItem("productInfo")
  //     ? JSON.parse(localStorage.getItem("userInfo"))
  //     : null,

  disputeInfo: null,
};

const escrowDisputeInfoSlice = createSlice({
  name: "escrowDispute",
  initialState,
  reducers: {
    setDisputeInfo: (state, action) => {
      state.disputeInfo = action.payload;
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

export const { setDisputeInfo } = escrowDisputeInfoSlice.actions;

export default escrowDisputeInfoSlice.reducer;
