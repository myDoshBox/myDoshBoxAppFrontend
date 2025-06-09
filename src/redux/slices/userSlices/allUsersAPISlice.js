// import { apiSlice } from "./apiSlice";
// import { testSlice } from "./testSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const URL = "/auth";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:9000/auth/",
  baseUrl: "https://mydoshbox-be.onrender.com/auth",
  // baseUrl: "http://localhost:54020/auth",
  // baseUrl: "https://my-dosh-box-be.vercel.app",
});

export const usersAPISlice = createApi({
  reducerPath: "usersAPI",
  baseQuery,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    createIndUser: builder.mutation({
      query: (data) => ({
        url: `individual/signup`,
        method: "POST",
        body: data,
      }),
    }),

    createOrgUser: builder.mutation({
      query: (data) => ({
        url: `organization/signup`,
        method: "POST",
        body: data,
      }),
    }),

    verifyUser: builder.mutation({
      // query: ({ token }) => ({
      query: (token) => ({
        url: `verify-email`,
        method: "POST",
        // params: { token },
        body: { token },
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `/login`,
        method: "POST",
        body: data,
      }),
    }),

    getGoogleUrl: builder.query({
      query: () => "individual/oauth",
    }),

    createIndividualGoogle: builder.mutation({
      query: (code) => ({
        url: "individual/oauth/callback",
        method: "POST",
        body: { code },
      }),
    }),

    createIndividualGoogles: builder.mutation({
      query: (data) => ({
        url: `/individual/googleauth`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateIndUserMutation,
  useLoginMutation,
  useCreateOrgUserMutation,
  useLazyCreateIndividualGoogleQuery,
  useCreateIndividualGooglesMutation,
  useGetGoogleUrlQuery,
  useCreateIndividualGoogleMutation,
  useVerifyUserMutation,
  useLogoutMutation,
} = usersAPISlice;
