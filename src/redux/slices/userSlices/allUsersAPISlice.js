// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { setCredentials, logout } from "./allUsersAuthSlice";
// import backendURL from "./../../../components/utils/config";

// const baseQuery = fetchBaseQuery({
//   baseUrl: `${backendURL}/auth`,
//   credentials: "include",
//   prepareHeaders: (headers) => {
//     headers.set("Content-Type", "application/json");
//     return headers;
//   },
// });

// // Endpoints that should NOT trigger token refresh on 401
// const AUTH_ENDPOINTS = [
//   "login",
//   "createIndUser",
//   "createOrgUser",
//   "verifyUser",
//   "forgotPasswordIndividual",
//   "forgotPasswordOrganization",
//   "resetPasswordIndividual",
//   "resetPasswordOrganization",
//   "refreshToken",
//   "createIndividualGoogle",
//   "createIndividualGoogles",
//   "getGoogleUrl",
//   "googleLogin",
//   "facebookLogin",
// ];

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);
//   const endpoint = api.endpoint;

//   if (AUTH_ENDPOINTS.includes(endpoint)) return result;

//   if (result?.error?.status === 401) {
//     console.log("Token expired, attempting refresh...");
//     const refreshResult = await baseQuery(
//       {
//         url: "individual/refresh-token",
//         method: "POST",
//         credentials: "include",
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult?.data?.status === "success") {
//       api.dispatch(setCredentials(refreshResult.data));
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logout());
//       sessionStorage.setItem("auth_redirect", "true");
//       window.location.href = "/signin";
//     }
//   }
//   return result;
// };

// export const usersAPISlice = createApi({
//   reducerPath: "usersAPI",
//   baseQuery: baseQueryWithReauth,
//   tagTypes: ["Users"],
//   endpoints: (builder) => ({
//     createIndUser: builder.mutation({
//       query: (data) => ({
//         url: "individual/signup",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     createOrgUser: builder.mutation({
//       query: (data) => ({
//         url: "organization/signup",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     verifyUser: builder.mutation({
//       query: (token) => ({
//         url: `individual/verify-email?token=${token}`,
//         method: "GET",
//       }),
//     }),

//     login: builder.mutation({
//       query: (credentials) => ({
//         url: "individual/login",
//         method: "POST",
//         body: credentials,
//       }),
//     }),

//     // Google OAuth Login
//     googleLogin: builder.mutation({
//       query: (credential) => ({
//         url: "individual/google",
//         method: "POST",
//         body: { credential },
//       }),
//     }),

//     // Facebook OAuth Login
//     facebookLogin: builder.mutation({
//       query: (accessToken) => ({
//         url: "individual/facebook",
//         method: "POST",
//         body: { accessToken },
//       }),
//     }),

//     forgotPasswordIndividual: builder.mutation({
//       query: (email) => ({
//         url: "individual/forgot-password",
//         method: "POST",
//         body: { email },
//       }),
//     }),

//     forgotPasswordOrganization: builder.mutation({
//       query: (email) => ({
//         url: "organization/forgot-password",
//         method: "POST",
//         body: { organization_email: email },
//       }),
//     }),

//     resetPasswordIndividual: builder.mutation({
//       query: ({ token, password, confirmPassword }) => ({
//         url: `individual/reset-password?token=${token}`,
//         method: "POST",
//         body: { password, confirm_password: confirmPassword },
//       }),
//     }),

//     resetPasswordOrganization: builder.mutation({
//       query: ({ token, password, confirmPassword }) => ({
//         url: `organization/reset-password?token=${token}`,
//         method: "POST",
//         body: { password, confirm_password: confirmPassword },
//       }),
//     }),

//     getGoogleUrl: builder.query({
//       query: () => "individual/oauth",
//     }),

//     createIndividualGoogle: builder.mutation({
//       query: (code) => ({
//         url: "individual/oauth/callback",
//         method: "POST",
//         body: { code },
//       }),
//     }),

//     createIndividualGoogles: builder.mutation({
//       query: (data) => ({
//         url: "individual/googleauth",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     refreshToken: builder.mutation({
//       query: () => ({
//         url: "individual/refresh-token",
//         method: "POST",
//         credentials: "include",
//       }),
//     }),

//     logout: builder.mutation({
//       query: () => ({ url: "/logout", method: "POST", credentials: "include" }),
//     }),
//   }),
// });

// export const {
//   useCreateIndUserMutation,
//   useLoginMutation,
//   useCreateOrgUserMutation,
//   useForgotPasswordIndividualMutation,
//   useForgotPasswordOrganizationMutation,
//   useResetPasswordIndividualMutation,
//   useResetPasswordOrganizationMutation,
//   useLazyCreateIndividualGoogleQuery,
//   useCreateIndividualGooglesMutation,
//   useGetGoogleUrlQuery,
//   useCreateIndividualGoogleMutation,
//   useVerifyUserMutation,
//   useLogoutMutation,
//   useRefreshTokenMutation,
//   useGoogleLoginMutation,
//   useFacebookLoginMutation,
// } = usersAPISlice;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "./allUsersAuthSlice";
import backendURL from "./../../../components/utils/config";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendURL}/auth`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});

// Endpoints that should NOT trigger token refresh on 401
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
  "googleLogin",
  "facebookLogin",
];

const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log("🔍 RTK Query Request:", {
    endpoint: api.endpoint,
    url: typeof args === "string" ? args : args.url,
    method: typeof args === "object" ? args.method : "GET",
  });

  let result = await baseQuery(args, api, extraOptions);
  const endpoint = api.endpoint;

  // Don't retry auth endpoints
  if (AUTH_ENDPOINTS.includes(endpoint)) {
    console.log(`✅ Auth endpoint '${endpoint}' - no retry`);
    return result;
  }

  // If we get 401, try to refresh token
  if (result?.error?.status === 401) {
    console.log("🔄 401 detected, attempting token refresh...");

    const refreshResult = await baseQuery(
      {
        url: "individual/refresh-token",
        method: "POST",
        credentials: "include",
        // Don't send body - cookies will be used
      },
      api,
      extraOptions
    );

    console.log("🔄 Refresh result:", {
      status: refreshResult?.data?.status,
      hasError: !!refreshResult?.error,
      errorStatus: refreshResult?.error?.status,
    });

    if (refreshResult?.data?.status === "success") {
      console.log("✅ Token refreshed successfully");

      // Update Redux with new tokens
      api.dispatch(
        setCredentials({
          accessToken: refreshResult.data.accessToken,
          refreshToken: refreshResult.data.refreshToken,
          user: refreshResult.data.user,
        })
      );

      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("❌ Token refresh failed, logging out");
      api.dispatch(logout());
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

    // Google OAuth Login
    googleLogin: builder.mutation({
      query: (credential) => ({
        url: "individual/google",
        method: "POST",
        body: { credential },
      }),
    }),

    // Facebook OAuth Login
    facebookLogin: builder.mutation({
      query: (accessToken) => ({
        url: "individual/facebook",
        method: "POST",
        body: { accessToken },
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
        body: { password, confirm_password: confirmPassword },
      }),
    }),

    resetPasswordOrganization: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: `organization/reset-password?token=${token}`,
        method: "POST",
        body: { password, confirm_password: confirmPassword },
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
        url: "individual/refresh-token",
        method: "POST",
        credentials: "include",
        // ✅ No body needed - cookies will be sent automatically
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "individual/logout",
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
  useGoogleLoginMutation,
  useFacebookLoginMutation,
} = usersAPISlice;
