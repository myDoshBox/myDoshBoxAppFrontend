import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { UserDashboardNavbar } from "../../../../components/NavbarComponents/TopNavbars";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../../../redux/slices/profileSlice/profileAPISlice";
import { setProfileInfo } from "../../../../redux/slices/profileSlice/profileAuthslice";

export const UserUpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Get user info from Redux store
  const { userInfo } = useSelector((state) => state.usersauth);

  // Get profile info from Redux store
  const { profileInfo } = useSelector((state) => state.profileAuth);

  // RTK Query hooks
  const {
    data: profileData,
    isLoading: fetching,
    error: fetchError,
    refetch,
  } = useGetProfileQuery();

  const [updateProfile, { isLoading: updating, error: updateError }] =
    useUpdateProfileMutation();

  // Form data state
  const [formData, setFormData] = useState({
    phone_number: "",
    name: "",
  });

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  // UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Determine user type and role for conditional rendering
  const userRole = userInfo?.role || userInfo?.userInfo?.role;
  const isIndividual = userRole?.includes("ind");
  const isOrganization = userRole?.includes("org");
  const isMediator = userRole === "mediator";
  const isAdmin = userRole?.includes("admin");

  /**
   * Update form data when profile is fetched
   */
  // Update the useEffect to handle image properly
  useEffect(() => {
    if (profileData?.data?.profile) {
      const profile = profileData.data.profile;
      dispatch(setProfileInfo(profile));

      setFormData({
        phone_number: profile.phone_number || "",
        name: profile.name || "",
      });

      // IMPORTANT: Set currentImage from the profile data
      if (profile.image) {
        setCurrentImage(profile.image);
        console.log("Setting current image:", profile.image);
      }
    }
  }, [profileData, dispatch]);

  // Also update when profileInfo changes in Redux
  useEffect(() => {
    if (profileInfo?.image && !currentImage) {
      setCurrentImage(profileInfo.image);
      console.log("Setting image from Redux store:", profileInfo.image);
    }
  }, [profileInfo, currentImage]);

  /**
   * Handle errors from RTK Query
   */
  useEffect(() => {
    if (fetchError) {
      setError(fetchError?.data?.message || "Error loading profile data");
    }

    if (updateError) {
      setError(updateError?.data?.message || "Error updating profile");
    }
  }, [fetchError, updateError]);

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear messages on input change
    setError("");
    setSuccess("");
  };

  /**
   * Handle image file selection
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should not exceed 5MB");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setError("");
    }
  };

  /**
   * Remove selected image
   */
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Trigger file input click
   */
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Validate form data before submission
   */
  const validateForm = () => {
    if (formData.phone_number && formData.phone_number.length < 10) {
      setError("Phone number must be at least 10 digits");
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();

      if (formData.name) submitData.append("name", formData.name);
      if (formData.phone_number)
        submitData.append("phone_number", formData.phone_number);
      if (imageFile) submitData.append("image", imageFile);

      const result = await updateProfile(submitData).unwrap();

      if (result.status === "success") {
        setSuccess(result.message || "Profile updated successfully!");

        // Update current image if new one was uploaded
        if (result.data?.profile?.image) {
          setCurrentImage(result.data.profile.image);
        }

        // Clear image selection
        handleRemoveImage();

        // Refetch profile to get updated data
        refetch();

        // Redirect to settings page after 2 seconds
        setTimeout(() => {
          navigate("/userdashboard/settings");
        }, 2000);
      }
    } catch (err) {
      const errorMsg =
        err?.data?.message || "Error updating profile. Please try again.";
      setError(errorMsg);
      console.error("Profile update error:", err);
    }
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    navigate("/userdashboard/settings");
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-12">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "12px" }}>
            <div className="card-body p-4 p-md-5">
              {/* Page Header with User Role Badge */}
              <div className="text-center mb-4">
                <h3
                  className="mb-2"
                  style={{
                    color: "#1E3A2F",
                    fontWeight: "600",
                    fontSize: "1.75rem",
                  }}>
                  Update Profile
                </h3>

                {/* User Role Badge */}
                <div className="mb-3">
                  <span
                    className="badge"
                    style={{
                      backgroundColor: isIndividual
                        ? "#2D7A5E"
                        : isOrganization
                        ? "#1E40AF"
                        : isMediator
                        ? "#7C3AED"
                        : isAdmin
                        ? "#DC2626"
                        : "#6B7280",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                    }}>
                    {isIndividual
                      ? "Individual User"
                      : isOrganization
                      ? "Organization User"
                      : isMediator
                      ? "Mediator"
                      : isAdmin
                      ? "Administrator"
                      : "User"}
                  </span>
                </div>

                <p className="text-muted mb-0">
                  Update your personal information
                </p>
              </div>

              {/* Loading State for Initial Data Fetch */}
              {fetching ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    Loading your profile...
                  </p>
                </div>
              ) : (
                <>
                  {/* Error Alert */}
                  {error && (
                    <div
                      className="alert alert-danger d-flex align-items-center"
                      role="alert">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="me-2 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 8V12M12 16H12.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>{error}</span>
                      <button
                        type="button"
                        className="btn-close ms-auto"
                        onClick={() => setError("")}></button>
                    </div>
                  )}

                  {/* Success Alert */}
                  {success && (
                    <div
                      className="alert alert-success d-flex align-items-center"
                      role="alert">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="me-2 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M22 11.08V12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C15.18 2 17.98 3.39 19.88 5.53"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M22 4L12 14.01L9 11.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{success}</span>
                    </div>
                  )}

                  {/* User Role Specific Information */}
                  {isOrganization && (
                    <div
                      className="alert alert-info d-flex align-items-center"
                      role="alert">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="me-2 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 16V12M12 8H12.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <small>
                        <strong>Organization Note:</strong> Your organization
                        email remains unchanged for administrative purposes.
                      </small>
                    </div>
                  )}

                  {/* Update Profile Form */}
                  <form onSubmit={handleSubmit}>
                    {/* Profile Image Upload Section */}
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{
                          color: "#1E3A2F",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                        }}>
                        Profile Image
                      </label>

                      <div className="d-flex flex-column align-items-center">
                        {/* Image Preview */}
                        <div
                          className="position-relative mb-3"
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "3px solid #2D7A5E",
                            cursor: "pointer",
                            backgroundColor: "#F3F4F6",
                          }}
                          onClick={handleImageClick}>
                          {imagePreview || currentImage ? (
                            <img
                              src={imagePreview || currentImage}
                              alt="Profile"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="d-flex flex-column justify-content-center align-items-center h-100"
                              style={{ color: "#6B7280" }}>
                              <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <small className="mt-2">Click to upload</small>
                            </div>
                          )}

                          {/* Overlay on hover */}
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                              backgroundColor: "rgba(0,0,0,0.5)",
                              opacity: 0,
                              transition: "opacity 0.3s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.opacity = 1)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.opacity = 0)
                            }>
                            <svg
                              width="30"
                              height="30"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Hidden File Input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />

                        {/* Upload/Remove Buttons */}
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={handleImageClick}
                            style={{ borderRadius: "6px" }}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="me-1"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M17 8L12 3L7 8"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 3V15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {imagePreview ? "Change Image" : "Upload Image"}
                          </button>

                          {imagePreview && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={handleRemoveImage}
                              style={{ borderRadius: "6px" }}>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="me-1"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M18 6L6 18"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M6 6L18 18"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Remove
                            </button>
                          )}
                        </div>

                        <small className="text-muted mt-2 text-center">
                          Supported formats: JPG, PNG, GIF (Max 5MB)
                        </small>
                      </div>
                    </div>

                    {/* Full Name Field */}
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="form-label"
                        style={{
                          color: "#1E3A2F",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                        }}>
                        {isOrganization ? "Organization Name" : "Full Name"}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={
                          isOrganization
                            ? "Enter your organization name"
                            : "Enter your full name"
                        }
                        style={{
                          borderColor: "#D1D5DB",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          fontSize: "1rem",
                        }}
                      />
                      <small className="text-muted">
                        {isOrganization
                          ? "This will be displayed as your organization name"
                          : "This will be displayed on your profile"}
                      </small>
                    </div>

                    {/* Phone Number Field */}
                    <div className="mb-4">
                      <label
                        htmlFor="phone_number"
                        className="form-label"
                        style={{
                          color: "#1E3A2F",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                        }}>
                        {isOrganization ? "Contact Number" : "Phone Number"}
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder={
                          isOrganization
                            ? "Enter your contact number"
                            : "Enter your phone number"
                        }
                        style={{
                          borderColor: "#D1D5DB",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          fontSize: "1rem",
                        }}
                      />
                      <small className="text-muted">
                        {isOrganization
                          ? "Include country code for international calls"
                          : "Include country code (e.g., +234 for Nigeria)"}
                      </small>
                    </div>
                    {/* Action Buttons */}
                    <div className="d-flex gap-3 mt-4 align-items-center justify-content-end">
                      {/* Cancel Button */}
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancel}
                        disabled={updating}
                        style={{
                          borderRadius: "8px",
                          padding: "10px 20px",
                          fontWeight: "500",
                          borderColor: "#6B7280",
                          color: "#6B7280",
                          fontSize: "0.9rem",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!updating) {
                            e.currentTarget.style.backgroundColor = "#6B7280";
                            e.currentTarget.style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!updating) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#6B7280";
                          }
                        }}>
                        Cancel
                      </button>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="btn"
                        disabled={updating || fetching}
                        style={{
                          backgroundColor: "#2D7A5E",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 24px",
                          fontWeight: "500",
                          fontSize: "0.9rem",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!updating && !fetching) {
                            e.currentTarget.style.backgroundColor = "#235F4A";
                            e.currentTarget.style.transform =
                              "translateY(-1px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 8px rgba(45, 122, 94, 0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!updating && !fetching) {
                            e.currentTarget.style.backgroundColor = "#2D7A5E";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                        onMouseDown={(e) => {
                          if (!updating && !fetching) {
                            e.currentTarget.style.transform = "translateY(0)";
                          }
                        }}>
                        {updating ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="me-2"
                              style={{
                                display: "inline-block",
                                verticalAlign: "middle",
                              }}
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M22 11.08V12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C15.18 2 17.98 3.39 19.88 5.53"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M22 4L12 14.01L9 11.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Update Profile
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UpdateProfilePage = () => {
  return (
    <div
      className="contestPage"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
      <div className="row g-0">
        <div className="col-lg-3 col-sm-12"></div>

        <UserDashboardNavbar />
        <div className="mt-5 px-3 px-lg-4">
          <UserUpdateProfile />
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
