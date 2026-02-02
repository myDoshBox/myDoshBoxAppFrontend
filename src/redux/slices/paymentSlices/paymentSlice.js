import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentInfo: null,
  paymentReference: null,
  authorizationUrl: null,
  isProcessing: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentInfo: (state, action) => {
      state.paymentInfo = action.payload;
    },

    setPaymentReference: (state, action) => {
      state.paymentReference = action.payload;
    },

    setAuthorizationUrl: (state, action) => {
      state.authorizationUrl = action.payload;
    },

    setPaymentProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },

    clearPaymentInfo: (state) => {
      state.paymentInfo = null;
      state.paymentReference = null;
      state.authorizationUrl = null;
      state.isProcessing = false;
    },
  },
});

export const {
  setPaymentInfo,
  setPaymentReference,
  setAuthorizationUrl,
  setPaymentProcessing,
  clearPaymentInfo,
} = paymentSlice.actions;

export default paymentSlice.reducer;
