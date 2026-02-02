import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetProfileQuery } from "../../redux/slices/profileSlice/profileAPISlice";
import { setProfileInfo } from "../../redux/slices/profileSlice/profileAuthslice";

export const MiniProfileCardSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user info from Redux store
  const { userInfo } = useSelector((state) => state.usersauth);

  // Get profile info from Redux store
  const { profileInfo } = useSelector((state) => state.profileAuth);

  // RTK Query hook for fetching profile
  const { data: profileData, isLoading, error, refetch } = useGetProfileQuery();

  // Update Redux store when data is fetched
  useEffect(() => {
    if (profileData?.data?.profile) {
      dispatch(setProfileInfo(profileData.data.profile));
    }
  }, [profileData, dispatch]);

  /**
   * Navigate to profile update page
   */
  const handleEditProfile = () => {
    navigate("/userdashboard/updateprofile");
  };

  // Refresh profile data
  const handleRefresh = () => {
    refetch();
  };

  // Use profileInfo from Redux store or fallback to empty values
  const profile = profileInfo || {
    name: "",
    email: "",
    phone_number: "",
    deals_completed: 0,
    rating: 0,
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div
        className="card shadow-sm border-0 text-center p-5"
        style={{ borderRadius: "12px" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3 mb-0">Loading profile...</p>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div
        className="card shadow-sm border-0 p-4"
        style={{ borderRadius: "12px" }}>
        <div className="alert alert-danger mb-3" role="alert">
          {error?.data?.message || "Failed to load profile"}
          <div className="mt-2">
            <button
              className="btn btn-sm btn-outline-danger me-2"
              onClick={handleRefresh}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card shadow-sm border-0"
      style={{ borderRadius: "12px", overflow: "hidden" }}>
      <div className="card-body p-4">
        {/* Avatar Section */}
        <div className="text-center mb-4">
          <div
            className="mx-auto rounded-circle d-flex align-items-center justify-content-center position-relative"
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#E8F5E9",
              border: "4px solid #2D7A5E",
            }}>
            {profile.image ? (
              <img
                src={profile.image}
                alt={`${profile.name}'s avatar`}
                className="rounded-circle"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              // Default user icon SVG
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" fill="#2D7A5E" />
                <path
                  d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21"
                  stroke="#2D7A5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        </div>
        {/* Profile Information Section */}
        <div className="text-center mb-4">
          {/* User Name */}
          <h4
            className="mb-2"
            style={{
              color: "#1E3A2F",
              fontWeight: "600",
              fontSize: "1.5rem",
            }}>
            {profile.name || "No Name"}
          </h4>

          {/* Username (if available) */}
          {profile.username && (
            <p className="text-muted small mb-3">@{profile.username}</p>
          )}

          {/* Email with Icon */}
          <div className="d-flex align-items-center justify-content-center mb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="me-2 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 8L10.89 13.26C11.57 13.72 12.43 13.72 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-muted"
              style={{
                fontSize: "0.9rem",
                wordBreak: "break-word",
              }}>
              {profile.email || "No Email"}
            </span>
          </div>

          {/* Phone Number with Icon */}
          <div className="d-flex align-items-center justify-content-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="me-2 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-muted" style={{ fontSize: "0.9rem" }}>
              {profile.phone_number || "No Phone"}
            </span>
          </div>
        </div>
        {/* Divider */}
        <hr className="my-3" style={{ borderColor: "#E5E7EB" }} />
        {/* Statistics Section */}
        <div className="row text-center g-3">
          {/* Deals Completed */}
          <div className="col-6">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="me-2"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                  stroke="#2D7A5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 7V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V7"
                  stroke="#2D7A5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  color: "#2D7A5E",
                }}>
                {profile.deals_completed}
              </span>
            </div>
            <p
              className="text-muted small mb-0"
              style={{ fontSize: "0.85rem" }}>
              deals completed
            </p>
          </div>

          {/* Rating Display */}
          <div className="col-6">
            <div className="d-flex align-items-center justify-content-center mb-2">
              {/* Star Rating Icons */}
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={star <= Math.round(profile.rating) ? "#FFA500" : "none"}
                  xmlns="http://www.w3.org/2000/svg"
                  className="me-1">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    stroke="#FFA500"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
            </div>
            <p
              className="text-muted small mb-0"
              style={{ fontSize: "0.85rem" }}>
              {profile.rating.toFixed(1)} rating
            </p>
          </div>
        </div>
        {/* Divider */}
        <hr className="my-3" style={{ borderColor: "#E5E7EB" }} />
      </div>
    </div>
  );
};
