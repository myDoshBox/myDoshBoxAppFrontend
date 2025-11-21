import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "./allUsersAuthSlice";
import backendURL from "./../../../components/utils/config";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendURL}/auth`,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Endpoints that should NOT trigger token refresh on 401
// These are public/auth endpoints where 401 means "wrong credentials", not "expired token"
const AUTH_ENDPOINTS = [
  "login",
  "createIndUser",
  "createOrgUser",
  "verifyUser",
  "forgotPasswordIndividual",
  "forgotPasswordOrganization",
  "resetPasswordIndividual",
  "resetPasswordOrganization",
  "refreshToken",
  "createIndividualGoogle",
  "createIndividualGoogles",
  "getGoogleUrl",
];

// Wrapper to handle token refresh on 401 errors
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Get the endpoint name
  const endpoint = api.endpoint;
  if (AUTH_ENDPOINTS.includes(endpoint)) {
    return result;
  }

  // If we get a 401 on a PROTECTED endpoint, try to refresh the token
  if (result?.error?.status === 401) {
    console.log("Token expired on protected route, attempting refresh...");

    // Try to get a new token
    const refreshResult = await baseQuery(
      {
        url: "/individual/refresh-token",
        method: "POST",
        credentials: "include",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data?.status === "success") {
      console.log("Token refresh successful, retrying original request...");
      api.dispatch(setCredentials(refreshResult.data));

      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Token refresh failed, logging out...");

      // Refresh failed, log the user out
      api.dispatch(logout());

      // Mark that this is an auth redirect (not a manual visit to login)
      sessionStorage.setItem("auth_redirect", "true");
      window.location.href = "/signin";
    }
  }

  return result;
};

export const usersAPISlice = createApi({
  reducerPath: "usersAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    createIndUser: builder.mutation({
      query: (data) => ({
        url: "individual/signup",
        method: "POST",
        body: data,
      }),
    }),

    createOrgUser: builder.mutation({
      query: (data) => ({
        url: "organization/signup",
        method: "POST",
        body: data,
      }),
    }),

    verifyUser: builder.mutation({
      query: (token) => ({
        url: `individual/verify-email?token=${token}`,
        method: "GET",
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "individual/login",
        method: "POST",
        body: credentials,
      }),
    }),

    forgotPasswordIndividual: builder.mutation({
      query: (email) => ({
        url: "individual/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    forgotPasswordOrganization: builder.mutation({
      query: (email) => ({
        url: "organization/forgot-password",
        method: "POST",
        body: { organization_email: email },
      }),
    }),

    resetPasswordIndividual: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: `individual/reset-password?token=${token}`,
        method: "POST",
        body: {
          password,
          confirm_password: confirmPassword,
        },
      }),
    }),

    resetPasswordOrganization: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: `organization/reset-password?token=${token}`,
        method: "POST",
        body: {
          password,
          confirm_password: confirmPassword,
        },
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
        url: "individual/googleauth",
        method: "POST",
        body: data,
      }),
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/individual/refresh-token",
        method: "POST",
        credentials: "include",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateIndUserMutation,
  useLoginMutation,
  useCreateOrgUserMutation,
  useForgotPasswordIndividualMutation,
  useForgotPasswordOrganizationMutation,
  useResetPasswordIndividualMutation,
  useResetPasswordOrganizationMutation,
  useLazyCreateIndividualGoogleQuery,
  useCreateIndividualGooglesMutation,
  useGetGoogleUrlQuery,
  useCreateIndividualGoogleMutation,
  useVerifyUserMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = usersAPISlice;
