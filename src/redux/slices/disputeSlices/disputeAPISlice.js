import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../userSlices/allUsersAuthSlice";
import backendURL from "./../../../components/utils/config";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendURL}/disputes`,
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

// Wrapper to handle token refresh on 401 errors
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
      // Store the new token
      api.dispatch(setCredentials(refreshResult.data));

      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, log the user out
      api.dispatch(logout());
      window.location.href = "/signin";
    }
  }

  return result;
};

export const disputeAPISlice = createApi({
  reducerPath: "escrowDisputeAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Escrow Dispute"],
  endpoints: (builder) => ({
    initiateDispute: builder.mutation({
      query: (data) => ({
        url: `raise-dispute/${data.transaction_id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Escrow Dispute"],
    }),

    fetchDisputeDetails: builder.query({
      query: (userEmail) => ({
        url: `fetch-all-dispute/${userEmail}`,
        method: "GET",
      }),
      providesTags: ["Escrow Dispute"],
    }),

    // Fetch a single dispute by transaction ID
    fetchDisputeByTransactionId: builder.query({
      query: (transactionId) => ({
        url: `fetch-dispute/${transactionId}`,
        method: "GET",
      }),
      providesTags: (result, error, transactionId) => [
        { type: "Escrow Dispute", id: transactionId },
      ],
    }),
  }),
});

export const {
  useInitiateDisputeMutation,
  useFetchDisputeDetailsQuery,
  useFetchDisputeByTransactionIdQuery,
  useResolveDisputeMutation,
} = disputeAPISlice;
