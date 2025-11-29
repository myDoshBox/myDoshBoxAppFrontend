// profileAPISlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../userSlices/allUsersAuthSlice";
import backendURL from "./../../../components/utils/config";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendURL}/profile`,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = getState().usersauth.userInfo?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const formDataEndpoints = ["updateProfile", "uploadProfileImage"];
    if (!formDataEndpoints.includes(endpoint)) {
      headers.set("Content-Type", "application/json");
    }

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

export const profileAPISlice = createApi({
  reducerPath: "profileAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "BankDetails"],
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query({
      query: () => ({
        url: "getUserProfile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (data) => {
        const isFormData = data instanceof FormData;

        return {
          url: "update",
          method: "PUT",
          body: data,
          headers: isFormData ? {} : { "Content-Type": "application/json" },
        };
      },
      invalidatesTags: ["Profile"],
    }),

    // Upload profile image only
    uploadProfileImage: builder.mutation({
      query: (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);

        return {
          url: "upload-image",
          method: "POST",
          body: formData,
          headers: {},
        };
      },
      invalidatesTags: ["Profile"],
    }),

    // Delete profile image
    deleteProfileImage: builder.mutation({
      query: () => ({
        url: "delete-image",
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),

    // Get bank details
    getBankDetails: builder.query({
      query: () => ({
        url: "/bank-details",
        method: "GET",
      }),
      providesTags: ["BankDetails"],
    }),

    // Update bank details
    updateBankDetails: builder.mutation({
      query: (data) => ({
        url: "/bank-details",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BankDetails"],
    }),

    // Create user profile (for new users)
    createProfile: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
  useGetBankDetailsQuery,
  useUpdateBankDetailsMutation,
  useCreateProfileMutation,
  useLazyGetProfileQuery,
  useLazyGetBankDetailsQuery,
} = profileAPISlice;
