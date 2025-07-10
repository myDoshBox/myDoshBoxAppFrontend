import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://mydoshbox-be.onrender.com/disputes/",
  // baseUrl: "https://mydoshbox-be.vercel.app/disputes/",
  // baseUrl: "http://localhost:9000/transactions/",
});

export const disputeAPISlice = createApi({
  reducerPath: "escrowDisputeAPI",
  baseQuery,
  tagTypes: ["Escrow Dispute"],
  endpoints: (builder) => ({
    initiateDispute: builder.mutation({
      query: (data) => ({
        url: `initiate-dispute`,
        method: "POST",
        body: data,
      }),
    }),

    // verifyEscrowProductTransactionPayment: builder.mutation({
    //   query: (reference) => ({
    //     url: `verify-escrow-product-transaction-payment`,
    //     method: "PUT",
    //     body: { reference },
    //   }),
    // }),

    // fetchSingleTransactions: builder.query({
    //   query: (transactionId) => ({
    //     url: `get-single-escrow-product-transaction/${transactionId}`, // Assuming your endpoint is /transactions/:buyerEmail
    //     method: "GET",
    //   }),
    // }),

    // fetchAllTransactions: builder.query({
    //   query: (buyerEmail) => ({
    //     url: `get-all-escrow-product-transaction/${buyerEmail}`, // Assuming your endpoint is /transactions/:buyerEmail
    //     method: "GET",
    //   }),
    // }),

    // sellerFillOutShippingDetails: builder.mutation({
    //   // query: ({ token }) => ({
    //   query: (data) => ({
    //     url: `seller-fill-out-shipping-details`,
    //     method: "POST",
    //     // params: { token },
    //     body: data,
    //   }),
    // }),

    //   fetchAllShippingDetails: builder.query({
    //     query: (userEmail) => ({
    //       url: `get-all-shipping-details/${userEmail}`, // Assuming your endpoint is /transactions/:buyerEmail
    //       method: "GET",
    //     }),
    //   }),

    //   buyerConfirmsProduct: builder.mutation({
    //     query: (transaction_id) => ({
    //       url: `buyer-confirms-product`,
    //       method: "PUT",
    //       body: { transaction_id },
    //     }),
    //   }),
  }),
});

export const {
  useInitiateDisputeMutation,
  // useVerifyEscrowProductTransactionPaymentMutation,
  // useBuyerConfirmsProductMutation,
  // useFetchAllTransactionsQuery,
  // useFetchSingleTransactionsQuery,
  // useSellerConfirmEscrowProductMutation,
  // useSellerFillOutShippingDetailsMutation,
  // useFetchAllShippingDetailsQuery,
} = disputeAPISlice;
