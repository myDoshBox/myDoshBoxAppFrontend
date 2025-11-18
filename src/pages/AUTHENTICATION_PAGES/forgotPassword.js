import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../images/doshlogolight.png";
import {
  useForgotPasswordIndividualMutation,
  useForgotPasswordOrganizationMutation,
} from "../../redux/slices/userSlices/allUsersAPISlice";

const ForgotPassword = () => {
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
                <h1 className="fw-bold mb-3">Forgot your password?</h1>
                <p className="lead text-white">
                  No worries! We'll send you reset instructions to your email.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - FORGOT PASSWORD FORM */}
            <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center bg-white p-4 p-md-5">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("individual");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  // RTK Query mutations
  const [forgotPasswordIndividual, { isLoading: isLoadingIndividual }] =
    useForgotPasswordIndividualMutation();
  const [forgotPasswordOrganization, { isLoading: isLoadingOrganization }] =
    useForgotPasswordOrganizationMutation();

  const loading = isLoadingIndividual || isLoadingOrganization;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      let result;

      // Call appropriate mutation based on account type
      switch (accountType) {
        case "individual":
          result = await forgotPasswordIndividual(email).unwrap();
          break;
        case "organization":
          result = await forgotPasswordOrganization(email).unwrap();
          break;
        default:
          result = await forgotPasswordIndividual(email).unwrap();
      }

      if (result.status === "success") {
        toast.success(
          result.message || "Password reset link sent to your email!"
        );
        setEmailSent(true);

        // Optionally redirect to login after a delay
        setTimeout(() => {
          navigate("/signin");
        }, 5000);
      } else {
        toast.error(
          result.message || "Failed to send reset link. Please try again."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);

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
    }
  };

  if (emailSent) {
    return (
      <div className="container-fluid" style={{ maxWidth: "500px" }}>
        <div className="text-center">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              fill="#198754"
              className="bi bi-envelope-check"
              viewBox="0 0 16 16">
              <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
              <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z" />
            </svg>
          </div>
          <h3 className="fw-bold mb-3">Check your email</h3>
          <p className="text-muted mb-4">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
            The link expires in 10 minutes. If you don't see the email, check
            your spam folder.
          </p>
          <div className="d-flex flex-column gap-2">
            <button
              onClick={() => setEmailSent(false)}
              className="btn btn-outline-success">
              Try another email
            </button>
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
        <h3 className="fw-bold text-center mb-2">Reset your password</h3>
        <p className="text-center text-muted" style={{ fontSize: "14px" }}>
          Enter your email address and we'll send you a link to reset your
          password.
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

        {/* Email Input */}
        <div className="form-outline mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control border rounded p-2 w-100"
            placeholder={
              accountType === "organization"
                ? "Organization email"
                : "Enter your email"
            }
            disabled={loading}
          />
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
              Sending reset link...
            </>
          ) : (
            "Send reset link"
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

export default ForgotPassword;
