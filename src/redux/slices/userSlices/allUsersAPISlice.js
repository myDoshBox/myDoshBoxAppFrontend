import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "./allUsersAuthSlice";
import backendURL from "./../../../components/utils/config";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendURL}/auth`,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Only add Authorization header for refresh token endpoint
    if (endpoint === "refreshToken") {
      const token = getState().usersauth.userInfo?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
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

    // Try to get a new token - this will use the refreshToken endpoint
    const refreshResult = await baseQuery(
      {
        url: "/individual/refresh-token",
        method: "POST",
        credentials: "include",
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

    // Forgot Password endpoints
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

    // Reset Password endpoints
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
