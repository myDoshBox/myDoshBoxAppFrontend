import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useVerifyPaymentMutation } from "../../../../redux/slices/paymentSlices/paymentAPISlice";
import { toast } from "react-toastify";
import { Spinner, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { UserDashboardNavbar } from "../../../../components/NavbarComponents/TopNavbars";

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyPayment, { isLoading }] = useVerifyPaymentMutation();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [transactionDetails, setTransactionDetails] = useState(null);

  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail =
    userInfo?.user?.email ||
    userInfo?.email ||
    userInfo?.organization_email ||
    userInfo?.userInfo?.email;

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    // Extract transaction_id from the reference (it's the UUID part before the timestamp)
    const transaction_id = reference?.split("-").slice(0, 5).join("-");

    console.log("Payment Verification Data:", {
      reference,
      trxref,
      transaction_id,
      userEmail,
    });

    if (!reference && !trxref) {
      toast.error("Invalid payment reference");
      setVerificationStatus("failed");
      return;
    }

    const verifyPaymentAsync = async () => {
      try {
        const paymentRef = reference || trxref;

        toast.info("Verifying your payment...", { autoClose: 2000 });

        const response = await verifyPayment({
          transaction_id: transaction_id,
          buyer_email: userEmail,
          reference: paymentRef,
        }).unwrap();

        console.log("Verification Response:", response);

        if (response.status === "success") {
          setVerificationStatus("success");
          setTransactionDetails(response.data || response);
          toast.success("Payment verified successfully!");

          // Redirect after 3 seconds
          setTimeout(() => {
            navigate("/userdashboard/transaction-history");
          }, 3000);
        } else {
          setVerificationStatus("failed");
          toast.error(
            response.message || "Payment verification failed. Please try again."
          );
        }
      } catch (error) {
        setVerificationStatus("failed");
        console.error("Payment verification error:", error);
        toast.error(
          error?.data?.message ||
            "Payment verification failed. Please contact support if amount was debited."
        );
      }
    };

    // Add a small delay before verification to ensure backend is ready
    setTimeout(() => {
      verifyPaymentAsync();
    }, 1000);
  }, [searchParams, verifyPayment, navigate, userEmail]);

  const handleRetry = () => {
    setVerificationStatus("verifying");
    window.location.reload();
  };

  const handleGoToTransactions = () => {
    navigate("/userdashboard/transaction-history");
  };

  const handleContactSupport = () => {
    navigate("/userdashboard/support");
  };

  return (
    <div
      className="container-fluid px-0"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />
          <div className="px-3 px-lg-4 py-2">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
                <div
                  className="card border-0 shadow-sm"
                  style={{ borderRadius: "12px" }}>
                  <div className="card-body p-5">
                    {/* VERIFYING STATE */}
                    {verificationStatus === "verifying" && (
                      <div className="text-center">
                        <div className="mb-4">
                          <Spinner
                            animation="border"
                            style={{
                              width: "4rem",
                              height: "4rem",
                              color: "#006747EB",
                            }}
                          />
                        </div>
                        <h3
                          className="mb-3"
                          style={{ color: "#006747EB", fontWeight: "700" }}>
                          Verifying Your Payment
                        </h3>
                        <p className="text-muted mb-4">
                          Please wait while we confirm your payment with
                          Paystack...
                        </p>
                        <div
                          className="alert alert-info"
                          style={{
                            backgroundColor: "#E7F5F1",
                            border: "none",
                            color: "#006747EB",
                          }}>
                          <small>
                            <i className="bi bi-info-circle me-2"></i>
                            Do not close this page or press the back button
                          </small>
                        </div>
                      </div>
                    )}

                    {/* SUCCESS STATE */}
                    {verificationStatus === "success" && (
                      <div className="text-center">
                        <div
                          className="mb-4"
                          style={{
                            fontSize: "80px",
                            color: "#006747EB",
                            animation: "scaleIn 0.5s ease-in-out",
                          }}>
                          <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <h3
                          className="mb-3"
                          style={{ color: "#006747EB", fontWeight: "700" }}>
                          Payment Successful!
                        </h3>
                        <p className="text-muted mb-4">
                          Your payment has been verified and processed
                          successfully.
                        </p>

                        {transactionDetails && (
                          <div
                            className="mb-4 p-4"
                            style={{
                              backgroundColor: "#F9F9FB",
                              borderRadius: "8px",
                              border: "1px solid #E5E7EB",
                            }}>
                            <div className="row text-start">
                              <div className="col-6 mb-3">
                                <small className="text-muted d-block mb-1">
                                  Transaction ID
                                </small>
                                <span
                                  className="fw-semibold"
                                  style={{ fontSize: "0.9rem" }}>
                                  {transactionDetails.transaction_id}
                                </span>
                              </div>
                              <div className="col-6 mb-3">
                                <small className="text-muted d-block mb-1">
                                  Amount Paid
                                </small>
                                <span
                                  className="fw-bold"
                                  style={{
                                    fontSize: "1.1rem",
                                    color: "#006747EB",
                                  }}>
                                  ₦
                                  {transactionDetails.transaction_total?.toLocaleString()}
                                </span>
                              </div>
                              <div className="col-12">
                                <small className="text-muted d-block mb-1">
                                  Status
                                </small>
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: "#D1FAE5",
                                    color: "#065F46",
                                    padding: "6px 12px",
                                    fontSize: "0.85rem",
                                  }}>
                                  {transactionDetails.transaction_status ||
                                    "Payment Verified"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div
                          className="alert"
                          style={{
                            backgroundColor: "#D1FAE5",
                            border: "none",
                            color: "#065F46",
                          }}>
                          <small>
                            <i className="bi bi-info-circle me-2"></i>
                            The vendor has been notified. You'll be redirected
                            to your transactions shortly...
                          </small>
                        </div>

                        <Button
                          onClick={handleGoToTransactions}
                          className="border-0 mt-3 px-5 py-2"
                          style={{
                            backgroundColor: "#006747EB",
                            borderRadius: "8px",
                            fontWeight: "600",
                          }}>
                          View All Transactions
                        </Button>
                      </div>
                    )}

                    {/* FAILED STATE */}
                    {verificationStatus === "failed" && (
                      <div className="text-center">
                        <div
                          className="mb-4"
                          style={{
                            fontSize: "80px",
                            color: "#DC2626",
                            animation: "shake 0.5s ease-in-out",
                          }}>
                          <i className="bi bi-x-circle-fill"></i>
                        </div>
                        <h3
                          className="mb-3"
                          style={{ color: "#DC2626", fontWeight: "700" }}>
                          Payment Verification Failed
                        </h3>
                        <p className="text-muted mb-4">
                          We couldn't verify your payment at this time.
                        </p>

                        <div
                          className="alert alert-warning mb-4"
                          style={{
                            backgroundColor: "#FEF3C7",
                            border: "none",
                            color: "#92400E",
                          }}>
                          <p className="mb-2">
                            <strong>What to do next:</strong>
                          </p>
                          <ul
                            className="text-start mb-0"
                            style={{ fontSize: "0.9rem" }}>
                            <li>Check if your account was debited</li>
                            <li>
                              If debited, contact support with your transaction
                              reference
                            </li>
                            <li>If not debited, you can retry the payment</li>
                          </ul>
                        </div>

                        <div
                          className="p-3 mb-4"
                          style={{
                            backgroundColor: "#F9F9FB",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                          }}>
                          <small className="text-muted d-block mb-1">
                            Payment Reference
                          </small>
                          <code
                            style={{
                              fontSize: "0.85rem",
                              color: "#374151",
                              backgroundColor: "transparent",
                            }}>
                            {searchParams.get("reference")}
                          </code>
                        </div>

                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          <Button
                            variant="outline-secondary"
                            onClick={handleRetry}
                            className="px-4 py-2"
                            style={{ borderRadius: "8px" }}>
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Retry Verification
                          </Button>
                          <Button
                            onClick={handleContactSupport}
                            className="border-0 px-4 py-2"
                            style={{
                              backgroundColor: "#006747EB",
                              borderRadius: "8px",
                            }}>
                            <i className="bi bi-headset me-2"></i>
                            Contact Support
                          </Button>
                          <Button
                            variant="outline-primary"
                            onClick={handleGoToTransactions}
                            className="px-4 py-2"
                            style={{ borderRadius: "8px" }}>
                            Go to Transactions
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        .spinner-border {
          border-width: 4px;
        }
      `}</style>
    </div>
  );
};

export default VerifyPayment;
