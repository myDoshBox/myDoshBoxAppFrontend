import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import logo from "../../images/doshlogolight.png";

const LinkVerificationMsg = () => {
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state or localStorage
  useEffect(() => {
    const userEmail =
      location.state?.email || localStorage.getItem("pendingVerificationEmail");
    if (userEmail) {
      setEmail(userEmail);
      localStorage.setItem("pendingVerificationEmail", userEmail);
    }
  }, [location]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOpenEmail = () => {
    // Detect email provider from email address
    const emailDomain = email.split("@")[1]?.toLowerCase();

    const emailProviders = {
      "gmail.com": "https://mail.google.com",
      "yahoo.com": "https://mail.yahoo.com",
      "outlook.com": "https://outlook.live.com",
      "hotmail.com": "https://outlook.live.com",
      "icloud.com": "https://www.icloud.com/mail",
    };

    const emailUrl = emailProviders[emailDomain] || "https://mail.google.com";
    window.open(emailUrl, "_blank");
  };

  const handleResendLink = async () => {
    if (!email) {
      toast.error("Email address not found. Please sign up again.");
      return;
    }

    setIsResending(true);

    try {
      // TODO: Replace with your actual resend verification API endpoint
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (data.status === "success" || data.status === "true") {
        toast.success("Verification email sent! Please check your inbox.");
        setResendTimer(60); // 60 second cooldown
      } else {
        toast.error(data.message || "Failed to resend verification email");
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error(
        "Failed to resend verification email. Please try again later.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    localStorage.removeItem("pendingVerificationEmail");
    navigate("/signin");
  };

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0 w-100 vh-100">
        {/* LEFT SIDE - INFO SECTION */}
        <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-start p-4 p-md-5 bg-success text-white min-vh-50 min-vh-md-100">
          <Link to="/" className="mb-3">
            <img
              src={logo}
              alt="MyDoshBox Logo"
              className="img-fluid"
              style={{ maxWidth: "140px" }}
            />
          </Link>
          <div>
            <h2 className="fw-bold">Start your journey with us.</h2>
            <p className="mt-3 text-white">
              Secure, smart, and simplified transactions powered by MyDoshBox.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - VERIFICATION MESSAGE */}
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4 bg-white min-vh-50 min-vh-md-100">
          <VerificationContent
            email={email}
            isResending={isResending}
            resendTimer={resendTimer}
            onOpenEmail={handleOpenEmail}
            onResendLink={handleResendLink}
            onBackToLogin={handleBackToLogin}
          />
        </div>
      </div>
    </div>
  );
};

const VerificationContent = ({
  email,
  isResending,
  resendTimer,
  onOpenEmail,
  onResendLink,
  onBackToLogin,
}) => {
  return (
    <div className="w-100 text-center" style={{ maxWidth: "500px" }}>
      {/* Success Icon */}
      <div className="mb-4">
        <EmailSentIcon />
      </div>

      {/* Title */}
      <h3 className="fw-bold mb-3">Check Your Email</h3>

      {/* Description */}
      <p className="text-muted mb-4">
        We've sent a verification link to{" "}
        {email ? (
          <strong className="text-success">{email}</strong>
        ) : (
          "your email address"
        )}
        . Click the link in the email to verify your account and complete your
        registration.
      </p>

      {/* Instructions */}
      <div className="alert alert-info mb-4" role="alert">
        <div className="d-flex align-items-start text-start">
          <InfoIcon />
          <div className="ms-2">
            <strong className="d-block mb-1">Next Steps:</strong>
            <ol className="mb-0 ps-3" style={{ fontSize: "0.9rem" }}>
              <li>Open your email inbox</li>
              <li>Look for an email from MyDoshBox</li>
              <li>Click the verification link</li>
              <li>Your account will be activated!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-grid gap-2 mb-3">
        <Button
          variant="success"
          size="lg"
          onClick={onOpenEmail}
          className="d-flex align-items-center justify-content-center gap-2"
        >
          <EnvelopeIcon />
          Open Email App
        </Button>

        <Button
          variant="outline-success"
          size="lg"
          onClick={onBackToLogin}
          className="d-flex align-items-center justify-content-center gap-2"
        >
          <ArrowLeftIcon />
          Back to Sign In
        </Button>
      </div>

      {/* Resend Link Section */}
      <div className="mt-4 pt-4 border-top">
        <p className="text-muted mb-3">Didn't receive the email?</p>

        {resendTimer > 0 ? (
          <p className="text-muted">
            Resend available in <strong>{resendTimer}s</strong>
          </p>
        ) : (
          <Button
            variant="link"
            className="text-success fw-semibold text-decoration-none p-0"
            onClick={onResendLink}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// ============================================
// SVG ICONS
// ============================================

const EmailSentIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <circle cx="50" cy="50" r="50" fill="#10B981" fillOpacity="0.1" />
    <circle cx="50" cy="50" r="40" fill="#10B981" fillOpacity="0.2" />
    <path
      d="M70 35H30C27.2386 35 25 37.2386 25 40V60C25 62.7614 27.2386 65 30 65H70C72.7614 65 75 62.7614 75 60V40C75 37.2386 72.7614 35 70 35Z"
      stroke="#10B981"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="white"
    />
    <path
      d="M75 40L50 52.5L25 40"
      stroke="#10B981"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="70" cy="30" r="8" fill="#10B981" />
    <path
      d="M68 30L70 32L73 28"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="flex-shrink-0"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
    />
  </svg>
);

export default LinkVerificationMsg;
