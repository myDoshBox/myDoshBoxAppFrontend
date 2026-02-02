import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useVerifyUserMutation } from "../../redux/slices/userSlices/allUsersAPISlice";
import logo from "../../images/doshlogolight.png";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const getQueryParameter = (param) => {
    const params = new URLSearchParams(location.search);
    return params.get(param);
  };

  const token = getQueryParameter("token");

  const verifyEmail = async () => {
    if (!token) {
      toast.error("Token is missing.");
      setVerificationComplete(true);
      setVerificationSuccess(false);
      return;
    }

    try {
      // ✅ Pass token directly (not as object)
      const res = await verifyUser(token).unwrap();

      // ✅ Check for success status properly
      if (res?.status === "success") {
        toast.success(res?.message || "Email verified successfully!");
        setVerificationComplete(true);
        setVerificationSuccess(true);

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } else {
        // Handle non-success responses
        toast.error(res?.message || "Verification failed");
        setVerificationComplete(true);
        setVerificationSuccess(false);
      }
    } catch (err) {
      console.error("Verification error:", err);

      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Verification failed. The link may be invalid or expired.";

      toast.error(errorMessage);
      setVerificationComplete(true);
      setVerificationSuccess(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setVerificationComplete(true);
      setVerificationSuccess(false);
      toast.error("No verification token found in URL");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="contestPage container-fluid">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="row">
        <div className="col-lg-6 col-sm-12">
          <Side />
        </div>
        <div className="col-lg-6 col-sm-12 container">
          <div className="pt-5 container mt-lg-5">
            <h3 className="titleStyle text-center">Email Verification</h3>

            <div className="text-center mt-5">
              {isLoading && !verificationComplete && (
                <div>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Verifying your email...</p>
                </div>
              )}

              {verificationComplete && verificationSuccess && (
                <div className="alert alert-success" role="alert">
                  <h4 className="alert-heading">✓ Success!</h4>
                  <p>Your email has been successfully verified.</p>
                  <hr />
                  <p className="mb-3">Redirecting to login page...</p>
                  <Link to="/signin" className="btn btn-success">
                    Sign In Now
                  </Link>
                </div>
              )}

              {verificationComplete && !verificationSuccess && (
                <div className="alert alert-danger" role="alert">
                  <h4 className="alert-heading">✗ Verification Failed</h4>
                  <p>
                    Unable to verify your email. The link may be invalid or
                    expired.
                  </p>
                  <hr />
                  <div className="d-flex gap-2 justify-content-center">
                    <Link to="/signin" className="btn btn-primary">
                      Go to Sign In
                    </Link>
                    <Link to="/signup" className="btn btn-outline-primary">
                      Sign Up Again
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

const Side = () => {
  return (
    <div className="">
      <div className="signUp-bg text-white">
        <Link to="/">
          <img src={logo} alt="" className="p-4" />
        </Link>
        <div className="p-md-5 p-3">
          <h1 className="text-white">Start your journey with us.</h1>
          <p className="text-white">
            Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et
          </p>
        </div>
      </div>
    </div>
  );
};
