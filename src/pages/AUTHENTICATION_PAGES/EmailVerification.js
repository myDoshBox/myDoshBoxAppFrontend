import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import logo from "../../images/doshlogolight.png";
import {
  useVerifyEmailAndBankMutation,
  useVerifyBankAccountOnlyMutation,
} from "../../redux/slices/userSlices/allUsersAPISlice";

// ============================================
// SVG ICONS (Defined as components)
// ============================================

const WelcomeIcon = () => (
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
    <circle cx="50" cy="35" r="12" fill="#10B981" />
    <path
      d="M30 70C30 60 38 52 50 52C62 52 70 60 70 70"
      stroke="#10B981"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M65 45L70 50L80 35"
      stroke="#10B981"
      strokeWidth="3"
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

const WarningIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="flex-shrink-0"
  >
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  </svg>
);

const VerifyEmailWithBankDetails = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error("Invalid verification link");
      navigate("/signin");
    }
  }, [searchParams, navigate]);

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0 w-100 vh-100">
        {/* LEFT SIDE */}
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
            <h2 className="fw-bold">Complete Your Registration</h2>
            <p className="mt-3 text-white">
              Add your bank details to complete your account setup and start
              transacting securely on MyDoshBox.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4 bg-white min-vh-50 min-vh-md-100">
          {token ? (
            <BankDetailsForm token={token} />
          ) : (
            <div className="text-center">
              <p className="text-muted">Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// BANK DETAILS FORM (REQUIRED - NO SKIP OPTION)
// ============================================

const BankDetailsForm = ({ token }) => {
  const [formData, setFormData] = useState({
    account_number: "",
    bank_name: "",
    account_name: "",
    bank_code: "",
  });

  const [searchBank, setSearchBank] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // RTK Query hooks
  const [verifyEmailAndBank, { isLoading: verifyingEmail }] =
    useVerifyEmailAndBankMutation();
  const [verifyBankAccountOnly, { isLoading: verifyingAccount }] =
    useVerifyBankAccountOnlyMutation();

  /**
   * Fetch banks from Paystack API on component mount
   */
  useEffect(() => {
    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const response = await fetch(
          "https://api.paystack.co/bank?country=nigeria",
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (data.status && data.data) {
          // Filter only active banks and sort alphabetically
          const activeBanks = data.data
            .filter((bank) => bank.active)
            .sort((a, b) => a.name.localeCompare(b.name));
          setBanks(activeBanks);
          console.log("Loaded banks:", activeBanks.length);
        } else {
          console.error("Failed to fetch banks:", data.message);
          toast.error("Failed to load banks list. Please refresh the page.");
        }
      } catch (err) {
        console.error("Error fetching banks:", err);
        toast.error("Failed to load banks list. Please refresh the page.");
      } finally {
        setLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showBankDropdown && !event.target.closest(".bank-search-container")) {
        setShowBankDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBankDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For account number, only allow digits
    if (name === "account_number") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else if (name === "account_name") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBankSearch = (e) => {
    const value = e.target.value;
    setSearchBank(value);
    setShowBankDropdown(true);

    // Clear bank-related errors
    if (errors.bank_name) {
      setErrors({ ...errors, bank_name: "" });
    }
  };

  const handleBankSelect = (bank) => {
    console.log("Selected bank:", bank);
    setFormData((prev) => ({
      ...prev,
      bank_name: bank.name,
      bank_code: bank.code,
    }));
    setSearchBank(bank.name);
    setShowBankDropdown(false);
  };

  const handleClearBank = () => {
    setFormData((prev) => ({
      ...prev,
      bank_name: "",
      bank_code: "",
    }));
    setSearchBank("");
  };

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchBank.toLowerCase()),
  );

  // Verify account number using RTK Query
  const verifyAccountNumber = async () => {
    if (!formData.account_number || !formData.bank_code) {
      toast.error("Please enter account number and select bank first");
      return;
    }

    if (formData.account_number.length !== 10) {
      toast.error("Account number must be 10 digits");
      return;
    }

    try {
      const result = await verifyBankAccountOnly({
        account_number: formData.account_number,
        bank_code: formData.bank_code,
      }).unwrap();

      if (result.status === "success" && result.data?.account_name) {
        setFormData((prev) => ({
          ...prev,
          account_name: result.data.account_name,
        }));
        toast.success(`Account verified: ${result.data.account_name}`);
      } else {
        toast.error(result.message || "Failed to verify account");
      }
    } catch (error) {
      console.error("Account verification error:", error);
      toast.error(
        error?.data?.message ||
          "Failed to verify account. Please enter account name manually.",
      );
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.account_number) {
      newErrors.account_number = "Account number is required";
    } else if (!/^\d{10}$/.test(formData.account_number)) {
      newErrors.account_number = "Account number must be 10 digits";
    }

    if (!formData.bank_name) {
      newErrors.bank_name = "Please select your bank";
    }

    if (!formData.account_name) {
      newErrors.account_name = "Account name is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      // ✅ Use RTK Query mutation to verify email AND save bank details
      const result = await verifyEmailAndBank({
        token: token,
        bankDetails: {
          account_number: formData.account_number,
          bank_name: formData.bank_name,
          account_name: formData.account_name,
          bank_code: formData.bank_code,
        },
      }).unwrap();

      if (result.status === "success") {
        toast.success("Email verified and account created successfully!");
        setTimeout(() => {
          navigate("/signin", {
            state: {
              message: "Your account is ready! Please sign in to continue.",
              email: result.data?.email,
            },
          });
        }, 2000);
      } else {
        toast.error(result.message || "Failed to complete verification");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        error?.data?.message ||
          "Failed to complete verification. Please try again.",
      );
    }
  };

  return (
    <div className="w-100" style={{ maxWidth: "500px" }}>
      {/* Header */}
      <div className="text-center mb-4">
        <WelcomeIcon />
        <h3 className="fw-bold mt-3 mb-2">Complete Your Profile</h3>
        <p className="text-muted">
          Add your bank details to verify your email and activate your account
        </p>
      </div>

      {/* Important Notice */}
      <div className="alert alert-warning mb-4" role="alert">
        <div className="d-flex align-items-start">
          <WarningIcon />
          <div className="ms-2">
            <strong className="d-block mb-1">Bank Details Required</strong>
            <small>
              You must provide valid bank details to complete registration. This
              is required to receive payments when you buy or sell items on
              MyDoshBox.
            </small>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Account Number */}
        <div className="mb-3">
          <label htmlFor="account_number" className="form-label fw-semibold">
            Account Number <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <input
              type="text"
              name="account_number"
              id="account_number"
              value={formData.account_number}
              onChange={handleChange}
              className={`form-control placeholder:text-gray-300  ${errors.account_number ? "is-invalid" : ""}`}
              placeholder="Enter your bank account number"
              maxLength="10"
              disabled={verifyingEmail}
            />
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={verifyAccountNumber}
              disabled={
                verifyingAccount ||
                verifyingEmail ||
                formData.account_number.length !== 10 ||
                !formData.bank_code
              }
            >
              {verifyingAccount ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                ></span>
              ) : (
                "Verify"
              )}
            </button>
          </div>
          {errors.account_number && (
            <div className="invalid-feedback d-block">
              {errors.account_number}
            </div>
          )}
          <small className="text-muted">
            Enter your 10-digit account number
          </small>
        </div>

        {/* Bank Name Field with Search */}
        <div className="mb-3 bank-search-container">
          <label htmlFor="bank_name" className="form-label fw-semibold">
            Bank Name <span className="text-danger">*</span>
          </label>
          <div className="position-relative">
            <div className="input-group">
              <input
                type="text"
                className={`form-control  ${errors.bank_name ? "is-invalid" : ""}`}
                id="bank_name"
                value={searchBank}
                onChange={handleBankSearch}
                onFocus={() => setShowBankDropdown(true)}
                placeholder={
                  loadingBanks
                    ? "Loading banks..."
                    : "Search or select your bank..."
                }
                required
                disabled={verifyingEmail || loadingBanks}
                style={{
                  borderColor: errors.bank_name ? "#dc3545" : "#D1D5DB",
                }}
              />
              {formData.bank_name && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleClearBank}
                  disabled={verifyingEmail}
                >
                  ×
                </button>
              )}
            </div>

            {/* Loading Indicator */}
            {loadingBanks && (
              <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                <div
                  className="spinner-border spinner-border-sm text-success"
                  role="status"
                >
                  <span className="visually-hidden">Loading banks...</span>
                </div>
              </div>
            )}

            {/* Bank Dropdown */}
            {showBankDropdown && searchBank && !loadingBanks && (
              <div
                className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg"
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                  zIndex: 1000,
                  borderColor: "#D1D5DB",
                  top: "100%",
                }}
              >
                {filteredBanks.length > 0 ? (
                  filteredBanks.map((bank) => (
                    <div
                      key={bank.id}
                      onClick={() => handleBankSelect(bank)}
                      className="p-3 cursor-pointer"
                      style={{
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        borderBottom: "1px solid #F3F4F6",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#F9FAFB";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: "500",
                          }}
                        >
                          {bank.name}
                        </span>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: "#E8F5E9",
                            color: "#2D7A5E",
                            fontSize: "0.75rem",
                          }}
                        >
                          {bank.code}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-muted">
                    No banks found matching "{searchBank}"
                  </div>
                )}
              </div>
            )}
          </div>
          {errors.bank_name && (
            <div className="invalid-feedback d-block">{errors.bank_name}</div>
          )}
          <small className="text-muted">
            {loadingBanks
              ? "Loading banks from Paystack..."
              : `Search from ${banks.length} Nigerian banks`}
            {formData.bank_name && (
              <span className="ms-2 text-success">
                ✓ Selected: {formData.bank_name}
              </span>
            )}
          </small>
        </div>

        {/* Account Name */}
        <div className="mb-3">
          <label htmlFor="account_name" className="form-label fw-semibold">
            Account Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="account_name"
            id="account_name"
            value={formData.account_name}
            onChange={handleChange}
            className={`form-control  ${errors.account_name ? "is-invalid" : ""}`}
            placeholder="John Doe"
            disabled={verifyingEmail}
          />
          {errors.account_name && (
            <div className="invalid-feedback">{errors.account_name}</div>
          )}
          <small className="text-muted">
            Click "Verify" above to auto-fill this field
          </small>
        </div>

        {/* Submit Button */}
        <div className="d-grid mb-3">
          <Button
            type="submit"
            variant="success"
            size="lg"
            disabled={verifyingEmail || loadingBanks || !formData.bank_name}
          >
            {verifyingEmail ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Completing Registration...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </div>

        {/* Note */}
        <p
          className="text-center text-muted mb-0"
          style={{ fontSize: "0.875rem" }}
        >
          By completing registration, you agree to our{" "}
          <Link to="/terms" className="text-success">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-success">
            Privacy Policy
          </Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyEmailWithBankDetails;
