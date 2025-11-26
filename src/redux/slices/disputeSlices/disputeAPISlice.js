// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { setCredentials, logout } from "../userSlices/allUsersAuthSlice";
// import backendURL from "./../../../components/utils/config";

// const baseQuery = fetchBaseQuery({
//   baseUrl: `${backendURL}/disputes`,
//   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const token = getState().usersauth.userInfo?.token;
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     headers.set("Content-Type", "application/json");
//     return headers;
//   },
// });

// // Wrapper to handle token refresh on 401 errors
// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   // If we get a 401, try to refresh the token
//   if (result?.error?.status === 401) {
//     console.log("Token expired, attempting refresh...");

//     // Try to get a new token
//     const refreshResult = await fetchBaseQuery({
//       baseUrl: `${backendURL}/auth`,
//       credentials: "include",
//     })(
//       {
//         url: "/individual/refresh-token",
//         method: "POST",
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult?.data) {
//       // Store the new token
//       api.dispatch(setCredentials(refreshResult.data));

//       // Retry the original query with new token
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       // Refresh failed, log the user out
//       api.dispatch(logout());
//       window.location.href = "/signin";
//     }
//   }

//   return result;
// };

// export const disputeAPISlice = createApi({
//   reducerPath: "escrowDisputeAPI",
//   baseQuery: baseQueryWithReauth,
//   tagTypes: ["Escrow Dispute"],
//   endpoints: (builder) => ({
//     initiateDispute: builder.mutation({
//       query: (data) => ({
//         url: `raise-dispute/${data.transaction_id}`,
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["Escrow Dispute"],
//     }),

//     fetchDisputeDetails: builder.query({
//       query: (userEmail) => ({
//         url: `fetch-all-dispute/${userEmail}`,
//         method: "GET",
//       }),
//       providesTags: ["Escrow Dispute"],
//     }),

//     // Fetch a single dispute by transaction ID
//     fetchDisputeByTransactionId: builder.query({
//       query: (transactionId) => ({
//         url: `fetch-dispute/${transactionId}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, transactionId) => [
//         { type: "Escrow Dispute", id: transactionId },
//       ],
//     }),
//   }),
// });

// export const {
//   useInitiateDisputeMutation,
//   useFetchDisputeDetailsQuery,
//   useFetchDisputeByTransactionIdQuery,
//   useResolveDisputeMutation,
// } = disputeAPISlice;

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
  tagTypes: ["Escrow Dispute", "Dispute Details"],
  endpoints: (builder) => ({
    // Raise a new dispute
    initiateDispute: builder.mutation({
      query: ({ transaction_id, ...data }) => ({
        url: `raise-dispute/${transaction_id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Escrow Dispute"],
    }),

    // Get all disputes for a user
    fetchDisputeDetails: builder.query({
      query: (userEmail) => ({
        url: `fetch-all-dispute/${userEmail}`,
        method: "GET",
      }),
      providesTags: ["Escrow Dispute"],
    }),

    // Get single dispute by transaction ID
    fetchDisputeByTransactionId: builder.query({
      query: (transactionId) => ({
        url: `details/${transactionId}`,
        method: "GET",
      }),
      providesTags: (result, error, transactionId) => [
        { type: "Dispute Details", id: transactionId },
      ],
    }),

    // Propose resolution
    proposeResolution: builder.mutation({
      query: ({ transaction_id, ...data }) => ({
        url: `propose-resolution/${transaction_id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { transaction_id }) => [
        "Escrow Dispute",
        { type: "Dispute Details", id: transaction_id },
      ],
    }),

    // Respond to resolution proposal
    respondToResolution: builder.mutation({
      query: ({ transaction_id, ...data }) => ({
        url: `respond-resolution/${transaction_id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { transaction_id }) => [
        "Escrow Dispute",
        { type: "Dispute Details", id: transaction_id },
      ],
    }),

    // Request mediator
    requestMediator: builder.mutation({
      query: (transaction_id) => ({
        url: `request-mediator/${transaction_id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, transaction_id) => [
        "Escrow Dispute",
        { type: "Dispute Details", id: transaction_id },
      ],
    }),

    // Cancel dispute
    cancelDispute: builder.mutation({
      query: (transaction_id) => ({
        url: `cancel-dispute/${transaction_id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, transaction_id) => [
        "Escrow Dispute",
        { type: "Dispute Details", id: transaction_id },
      ],
    }),

    // Get paginated disputes with filters
    fetchPaginatedDisputes: builder.query({
      query: ({ user_email, page = 1, limit = 10, stage }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (stage) params.append("stage", stage);

        return {
          url: `fetch-all-dispute/${user_email}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Escrow Dispute"],
    }),
  }),
});

export const {
  useInitiateDisputeMutation,
  useFetchDisputeDetailsQuery,
  useFetchDisputeByTransactionIdQuery,
  useProposeResolutionMutation,
  useRespondToResolutionMutation,
  useRequestMediatorMutation,
  useCancelDisputeMutation,
  useFetchPaginatedDisputesQuery,
} = disputeAPISlice;
