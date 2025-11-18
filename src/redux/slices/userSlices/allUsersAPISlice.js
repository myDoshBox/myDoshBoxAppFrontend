import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: "https://mydoshbox-be.vercel.app/auth",
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const usersAPISlice = createApi({
  reducerPath: "usersAPI",
  baseQuery,
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
      query: (body) => ({
        url: "individual/login",
        method: "POST",
        body,
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

    getMe: builder.query({
      query: () => ({
        url: "/me",
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
  useGetMeQuery,
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
} = usersAPISlice;
