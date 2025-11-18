// import { useState, useEffect } from "react";
// import logo from "../../images/doshlogolight.png";

// import { Link, useNavigate } from "react-router-dom";

// const ResetPassword = () => {
//   return (
//     <>
//       <div className="contestPage container-fluid">
//         <div className="row">
//           <div className="col-lg-6 col-sm-12">
//             <Side />
//           </div>
//           <div className="col-lg-6 col-sm-12 container `">
//             <PasswordResetForm />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ResetPassword;

// const PasswordResetForm = () => {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [passwordToggle, setpasswordToggle] = useState(false);
//   const [passwordToggle1, setpasswordToggle1] = useState(false);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//     } else {
//       // Send request to server to update password
//       setError(null);
//     }
//   };

//   const handleNewPasswordChange = (event) => {
//     setNewPassword(event.target.value);
//   };

//   const handleConfirmPasswordChange = (event) => {
//     setConfirmPassword(event.target.value);
//   };

//   const handleShowHide = (e) => {
//     setpasswordToggle(!passwordToggle);
//     e.preventDefault();
//   };
//   const handleShowHide2 = (e) => {
//     setpasswordToggle1(!passwordToggle1);
//     e.preventDefault();
//   };
//   return (
//     <div className="pt-5 container mt-lg-5">
//       <div>
//         <h3 className="titleStyle text-center">Change Password</h3>
//         <p className="text-center">
//           Welcome back to MyDoshBox! Please enter your Password
//         </p>
//       </div>
//       <form className="container" onSubmit={handleSubmit}>
//         <div className="form-outline d-flex">
//           <input
//             type={passwordToggle ? "text" : "password"}
//             className="border border-end-0 rounded-start p-2 w-100 labelStyle mt-2 mb-1"
//             placeholder="new password"
//             id="exampleInputPassword1"
//             value={newPassword}
//             onChange={handleNewPasswordChange}
//           />
//           <button
//             className="border rounded-end border-start-0 px-2  bg-transparent mb-1"
//             onClick={handleShowHide}
//           >
//             {passwordToggle ? <HidePassWordIcon /> : <ShowPassWordIcon />}
//           </button>
//         </div>
//         <div className="form-outline d-flex">
//           <input
//             className="border border-end-0 rounded-start p-2 w-100 labelStyle mt-2 mb-1 "
//             placeholder="confirm Password"
//             type={passwordToggle1 ? "text" : "password"}
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={handleConfirmPasswordChange}
//           />
//           <button
//             className="border rounded-end border-start-0 px-2 bg-transparent mt-2"
//             onClick={handleShowHide2}
//           >
//             {passwordToggle1 ? <HidePassWordIcon /> : <ShowPassWordIcon />}
//           </button>
//         </div>
//         <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
//         <div className="text-center">
//           <button
//             type="submit"
//             className="ll-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white "
//           >
//             Reset Password
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export const Side = () => {
//   return (
//     <div>
//       <div className="signUp-bg text-white">
//         <Link to="/">
//           <img src={logo} alt="" className="p-4" />
//         </Link>
//         <div className="p-md-5 p-3">
//           <h1 className="text-white">Start your journey with us.</h1>
//           <p className="text-white">
//             Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ShowPassWordIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="20"
//       fill="gray"
//       className="bi bi-eye-slash-fill"
//       viewBox="0 0 16 16"
//     >
//       <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
//       <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
//     </svg>
//   );
// };
// const HidePassWordIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="20"
//       fill="gray"
//       className="bi bi-eye-fill"
//       viewBox="0 0 16 16"
//     >
//       <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
//       <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
//     </svg>
//   );
// };

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../images/doshlogolight.png";
import {
  useResetPasswordIndividualMutation,
  useResetPasswordOrganizationMutation,
} from "../../redux/slices/userSlices/allUsersAPISlice";

const ResetPassword = () => {
  return (
    <>
      <div className="min-vh-100 d-flex align-items-center bg-light overflow-hidden">
        <div className="container-fluid p-0">
          <div className="row g-0 min-vh-100">
            {/* LEFT SIDE - INFO SECTION */}
            <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-start bg-success text-white p-4 p-md-5">
              <Link to="/" className="mb-4">
                <img
                  src={logo}
                  alt="Doshbox Logo"
                  className="img-fluid"
                  style={{ maxWidth: "150px" }}
                />
              </Link>
              <div className="w-100">
                <h1 className="fw-bold mb-3">Create a new password</h1>
                <p className="lead text-white">
                  Your new password must be different from previously used
                  passwords.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - RESET PASSWORD FORM */}
            <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center bg-white p-4 p-md-5">
              <PasswordResetForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PasswordResetForm = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [accountType, setAccountType] = useState("individual");
  const [errors, setErrors] = useState({});
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [passwordToggle1, setPasswordToggle1] = useState(false);
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();

  // RTK Query mutations
  const [resetPasswordIndividual, { isLoading: isLoadingIndividual }] =
    useResetPasswordIndividualMutation();
  const [resetPasswordOrganization, { isLoading: isLoadingOrganization }] =
    useResetPasswordOrganizationMutation();

  const loading = isLoadingIndividual || isLoadingOrganization;

  useEffect(() => {
    // Get token from URL query parameters
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setTokenValid(false);
      toast.error("Invalid or missing reset token");
    }

    // Optional: Detect account type from URL if passed
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl && ["individual", "organization"].includes(typeFromUrl)) {
      setAccountType(typeFromUrl);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (
      !/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
        formData.password
      )
    ) {
      errors.password =
        "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, and one number or special character";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if token is valid
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    // Validate form
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    try {
      let result;

      // Call appropriate mutation based on account type
      const payload = {
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      switch (accountType) {
        case "individual":
          result = await resetPasswordIndividual(payload).unwrap();
          break;
        case "organization":
          result = await resetPasswordOrganization(payload).unwrap();
          break;
        default:
          result = await resetPasswordIndividual(payload).unwrap();
      }

      if (result.status === "success") {
        toast.success(result.message || "Password reset successfully!");

        // Clear form
        setFormData({ password: "", confirmPassword: "" });

        // Redirect to login after short delay
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        const errorMessage =
          result.message || "Password reset failed. Please try again.";
        toast.error(errorMessage);

        // If token is invalid or expired, mark it
        if (
          errorMessage.toLowerCase().includes("token") ||
          errorMessage.toLowerCase().includes("expired") ||
          errorMessage.toLowerCase().includes("invalid")
        ) {
          setTokenValid(false);
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";

      if (errorMessage.toLowerCase().includes("network")) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error(errorMessage);
      }

      // Check if token is invalid
      if (
        errorMessage.toLowerCase().includes("token") ||
        errorMessage.toLowerCase().includes("expired") ||
        errorMessage.toLowerCase().includes("invalid")
      ) {
        setTokenValid(false);
      }
    }
  };

  const handleShowHide = (e) => {
    e.preventDefault();
    setPasswordToggle(!passwordToggle);
  };

  const handleShowHide2 = (e) => {
    e.preventDefault();
    setPasswordToggle1(!passwordToggle1);
  };

  // Show error message if token is invalid
  if (!tokenValid) {
    return (
      <div className="container-fluid" style={{ maxWidth: "500px" }}>
        <div className="text-center">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              fill="#dc3545"
              className="bi bi-x-circle"
              viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
          <h3 className="fw-bold mb-3">Invalid or Expired Link</h3>
          <p className="text-muted mb-4">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <div className="d-flex flex-column gap-2">
            <Link to="/ForgotPassword" className="btn btn-success">
              Request New Link
            </Link>
            <Link
              to="/signin"
              className="btn btn-link text-success text-decoration-none">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ maxWidth: "500px" }}>
      <div className="mb-4">
        <h3 className="fw-bold text-center mb-2">Set new password</h3>
        <p className="text-center text-muted" style={{ fontSize: "14px" }}>
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Account Type Selection */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Account Type</label>
          <div className="d-flex gap-2">
            <button
              type="button"
              className={`btn flex-fill ${
                accountType === "individual"
                  ? "btn-success"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setAccountType("individual")}
              disabled={loading}>
              Individual
            </button>
            <button
              type="button"
              className={`btn flex-fill ${
                accountType === "organization"
                  ? "btn-success"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setAccountType("organization")}
              disabled={loading}>
              Organization
            </button>
          </div>
        </div>

        {/* New Password Input */}
        <div className="form-outline mb-3">
          <label htmlFor="password" className="form-label fw-semibold">
            New Password
          </label>
          <div className="d-flex">
            <input
              type={passwordToggle ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`border border-end-0 rounded-start p-2 w-100 ${
                errors.password ? "border-danger" : ""
              }`}
              placeholder="Enter new password"
              disabled={loading}
            />
            <button
              type="button"
              className="border rounded-end border-start-0 px-2 bg-transparent"
              onClick={handleShowHide}
              disabled={loading}>
              {passwordToggle ? <HidePasswordIcon /> : <ShowPasswordIcon />}
            </button>
          </div>
          {errors.password && (
            <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
              {errors.password}
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="form-outline mb-3">
          <label htmlFor="confirmPassword" className="form-label fw-semibold">
            Confirm Password
          </label>
          <div className="d-flex">
            <input
              type={passwordToggle1 ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`border border-end-0 rounded-start p-2 w-100 ${
                errors.confirmPassword ? "border-danger" : ""
              }`}
              placeholder="Confirm new password"
              disabled={loading}
            />
            <button
              type="button"
              className="border rounded-end border-start-0 px-2 bg-transparent"
              onClick={handleShowHide2}
              disabled={loading}>
              {passwordToggle1 ? <HidePasswordIcon /> : <ShowPasswordIcon />}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
              {errors.confirmPassword}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-success w-100 mt-3 d-flex align-items-center justify-content-center"
          disabled={loading}
          style={{ minHeight: "45px" }}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"></span>
              Resetting password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>

        {/* Back to Sign In */}
        <div className="text-center mt-4">
          <Link
            to="/signin"
            className="text-success text-decoration-none fw-semibold"
            style={{ fontSize: "14px" }}>
            ← Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

const ShowPasswordIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      fill="gray"
      className="bi bi-eye-slash-fill"
      viewBox="0 0 16 16">
      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
    </svg>
  );
};

const HidePasswordIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      fill="gray"
      className="bi bi-eye-fill"
      viewBox="0 0 16 16">
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    </svg>
  );
};

export default ResetPassword;
