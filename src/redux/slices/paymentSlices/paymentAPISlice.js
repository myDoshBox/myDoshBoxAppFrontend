import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import backendURL from "../../../components/utils/config";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendURL}/transactions`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().usersauth.userInfo?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const paymentAPISlice = createApi({
  reducerPath: "paymentAPI",
  baseQuery,
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: ({ transaction_id, buyer_email }) => ({
        url: "verify-escrow-product-transaction-payment",
        method: "PUT",
        body: { transaction_id, buyer_email },
      }),
      transformResponse: (response) => {
        console.log("Initiate Payment Response:", response);
        return response;
      },
    }),

    verifyPayment: builder.mutation({
      query: ({ transaction_id, buyer_email, reference }) => ({
        url: "verify-escrow-product-transaction-payment",
        method: "PUT",
        body: { transaction_id, buyer_email, reference },
      }),
      invalidatesTags: ["Payment"],
    }),

    getPaymentStatus: builder.query({
      query: (transaction_id) => ({
        url: `get-payment-status/${transaction_id}`,
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useGetPaymentStatusQuery,
} = paymentAPISlice;
