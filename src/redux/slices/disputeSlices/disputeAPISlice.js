import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://mydoshbox-be.vercel.app/disputes/",
  // baseUrl: "http://localhost:54020/transactions/",
  // baseUrl: "http://localhost:9000/disputes/",
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

    fetchDisputeDetails: builder.query({
      query: (userEmail) => ({
        url: `fetch-all-dispute/${userEmail}`, // Assuming your endpoint is /transactions/:buyerEmail
        method: "GET",
      }),
    }),

    // : builder.query({
    //   query: (userEmail) => {
    //     const url = `fetch-all-dispute/${encodeURIComponent(userEmail)}`;
    //     console.log(
    //       "Making request to:",
    //       `https://mydoshbox-be.vercel.app/disputes/${url}`
    //     );
    //     return {
    //       url,
    //       method: "GET",
    //     };
    //   },
    //   transformResponse: (response) => {
    //     console.log("Raw response from API:", response);
    //     return response;
    //   },
    //   transformErrorResponse: (error) => {
    //     console.error("API Error:", error);
    //     return error;
    //   },
    // }),
  }),
});

export const {
  useInitiateDisputeMutation,
  // useVerifyEscrowProductTransactionPaymentMutation,
  // useBuyerConfirmsProductMutation,
  useFetchDisputeDetailsQuery,
  // useFetchSingleTransactionsQuery,
  // useSellerConfirmEscrowProductMutation,
  // useSellerFillOutShippingDetailsMutation,
  // useFetchAllShippingDetailsQuery,
} = disputeAPISlice;
