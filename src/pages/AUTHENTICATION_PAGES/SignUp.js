import { Container, Row, Col, Tab } from "react-bootstrap";
import {
  SignUpIndividual,
  SignUpOrganization,
} from "../../components/FormComponents.js/AuthenticationForms";
import { Link, useSearchParams } from "react-router-dom";
import logo from "../../images/doshlogolight.png";

const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const isVendorInvite = searchParams.get("ref") === "vendor";
  const vendorEmail = searchParams.get("email") || "";
  const transactionId = searchParams.get("transaction_id") || "";

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
            {isVendorInvite ? (
              <>
                <h2 className="fw-bold">Complete Your Registration</h2>
                <p className="mt-3 text-white">
                  You've been invited to join MyDoshBox as a vendor. Create your
                  account to confirm and fulfill this order.
                </p>
                {transactionId && (
                  <div className="mt-2 p-2 bg-white bg-opacity-10 rounded">
                    <small className="text-white-50">Transaction ID:</small>
                    <p className="mb-0 text-white fw-mono">{transactionId}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="fw-bold">Start your journey with us.</h2>
                <p className="mt-3 text-white">
                  Secure, smart, and simplified transactions powered by
                  MyDoshBox.
                </p>
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - SIGN UP FORM */}
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4 bg-white min-vh-50 min-vh-md-100">
          <SignUpForm
            isVendorInvite={isVendorInvite}
            vendorEmail={vendorEmail}
            transactionId={transactionId}
          />
        </div>
      </div>
    </div>
  );
};

const SignUpForm = ({
  isVendorInvite = false,
  vendorEmail = "",
  transactionId = "",
}) => {
  return (
    <div className="w-100" style={{ maxWidth: "600px" }}>
      {isVendorInvite ? (
        <>
          <div className="text-center mb-3">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#E8F5E9",
                borderRadius: "50%",
              }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="#2D7A5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                  stroke="#2D7A5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M22 11L19 14L22 17"
                  stroke="#2D7A5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="fw-bold mb-2">Welcome Vendor!</h3>
            <p className="text-muted">
              Complete your registration to accept this order
            </p>
          </div>

          {transactionId && (
            <div className="alert alert-info mb-4" role="alert">
              <div className="d-flex align-items-start">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="me-2 flex-shrink-0 mt-1"
                >
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
                <div>
                  <strong className="d-block mb-1">Order Waiting</strong>
                  <small>
                    A buyer is waiting for you to confirm an order. After
                    registration, you'll be redirected to complete the
                    transaction.
                  </small>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <h3 className="text-center fw-bold mb-3">Create Your Account</h3>
          <p className="text-center text-muted mb-4">
            It's quick and easy to get started with MyDoshBox.
          </p>
        </>
      )}

      <Tab.Container defaultActiveKey="individual">
        <Tab.Content>
          <Tab.Pane eventKey="individual">
            <SignUpIndividual
              isVendorInvite={isVendorInvite}
              prefillEmail={vendorEmail}
              transactionId={transactionId}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <div className="text-center mt-4">
        <span className="text-muted">Already have an account? </span>
        <Link
          to={
            isVendorInvite
              ? `/signin?redirect=order&transaction_id=${transactionId}`
              : "/signin"
          }
          className="text-success fw-semibold text-decoration-none"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
