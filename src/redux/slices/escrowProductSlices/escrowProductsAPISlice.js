import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../userSlices/allUsersAuthSlice";
import backendURL from "./../../../components/utils/config";

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

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // If we get a 401, try to refresh the token
  if (result?.error?.status === 401) {
    console.log("Token expired, attempting refresh...");

    // Try to get a new token
    const refreshResult = await fetchBaseQuery({
      baseUrl: `${backendURL}/auth`,
      credentials: "include",
    })(
      {
        url: "/individual/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      api.dispatch(setCredentials(refreshResult.data));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      window.location.href = "/signin";
    }
  }

  return result;
};

export const escrowProductsAPISlice = createApi({
  reducerPath: "escrowProductsAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Escrow Products"],
  endpoints: (builder) => ({
    initiateEscrowProductTransaction: builder.mutation({
      query: (data) => ({
        url: `initiate-escrow-product-transaction`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Escrow Products"],
    }),

    // NEW: Edit Escrow Product Transaction
    editEscrowProductTransaction: builder.mutation({
      query: ({ transaction_id, ...data }) => ({
        url: `edit-escrow-product-transaction/${transaction_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Escrow Products"],
    }),

    verifyEscrowProductTransactionPayment: builder.mutation({
      query: (reference) => ({
        url: `verify-escrow-product-transaction-payment`,
        method: "PUT",
        body: { reference },
      }),
    }),

    fetchSingleTransactions: builder.query({
      query: (transactionId) => ({
        url: `get-single-escrow-product-transaction/${transactionId}`,
        method: "GET",
      }),
      providesTags: (result, error, transactionId) => [
        { type: "Escrow Products", id: transactionId },
      ],
    }),

    fetchAllTransactions: builder.query({
      query: (buyerEmail) => {
        console.log("📧 BuyerEmail in API call:", buyerEmail);

        // If no buyerEmail, return a safe endpoint or handle differently
        if (!buyerEmail || buyerEmail === "undefined") {
          return {
            url: `get-all-escrow-product-transaction`,
            method: "GET",
          };
        }

        return {
          url: `get-all-escrow-product-transaction/${buyerEmail}`,
          method: "GET",
        };
      },
      providesTags: ["Escrow Products"],
    }),

    sellerFillOutShippingDetails: builder.mutation({
      query: (data) => ({
        url: `seller-fill-out-shipping-details`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Escrow Products"],
    }),

    cancelTransaction: builder.mutation({
      query: (transaction_id) => ({
        url: `cancel-transaction/${transaction_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Escrow Products"],
    }),

    sellerConfirmsTransaction: builder.mutation({
      query: ({ transaction_id, confirmation, vendor_email }) => ({
        url: "seller-confirm-escrow-product-transaction",
        method: "POST",
        body: { transaction_id, confirmation, vendor_email },
      }),
      invalidatesTags: ["Escrow Products"],
    }),

    fetchAllShippingDetails: builder.query({
      query: (userEmail) => ({
        url: `get-all-shipping-details/${userEmail}`,
        method: "GET",
      }),
    }),

    buyerConfirmsProduct: builder.mutation({
      query: (transaction_id) => ({
        url: `buyer-confirms-product`,
        method: "PUT",
        body: { transaction_id },
      }),
      invalidatesTags: ["Escrow Products"],
    }),
  }),
});

export const {
  useInitiateEscrowProductTransactionMutation,
  useEditEscrowProductTransactionMutation,
  useVerifyEscrowProductTransactionPaymentMutation,
  useBuyerConfirmsProductMutation,
  useSellerConfirmsTransactionMutation,
  useFetchAllTransactionsQuery,
  useFetchSingleTransactionsQuery,
  useSellerFillOutShippingDetailsMutation,
  useFetchAllShippingDetailsQuery,
  useCancelTransactionMutation,
} = escrowProductsAPISlice;
