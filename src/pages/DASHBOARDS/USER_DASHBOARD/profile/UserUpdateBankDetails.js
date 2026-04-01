import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDashboardNavbar } from "../../../../components/NavbarComponents/TopNavbars";
import {
  useGetBankDetailsQuery,
  useUpdateBankDetailsMutation,
} from "../../../../redux/slices/profileSlice/profileAPISlice";
import {
  Alert,
  AlertDescription,
} from "../../../../components/NotificationComponent/Alert";

export const UpdateBankDetails = () => {
  const navigate = useNavigate();

  const {
    data: bankDetailsData,
    isLoading: fetching,
    error: fetchError,
    refetch,
  } = useGetBankDetailsQuery();

  const [updateBankDetails, { isLoading: updating }] =
    useUpdateBankDetailsMutation();

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

  // Alert states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Fetch Nigerian banks from Paystack
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
          const activeBanks = data.data
            .filter((bank) => bank.active)
            .sort((a, b) => a.name.localeCompare(b.name));
          setBanks(activeBanks);
        } else {
          setError("Failed to load banks list. Please try again.");
          setShowErrorAlert(true);
        }
      } catch (err) {
        setError("Failed to load banks list. Please try again.");
        setShowErrorAlert(true);
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);

  // Pre-fill form with existing bank details
  useEffect(() => {
    if (bankDetailsData?.data?.bank_details) {
      const bd = bankDetailsData.data.bank_details;
      setFormData({
        account_number: bd.account_number || "",
        bank_name: bd.bank_name || "",
        account_name: bd.account_name || "",
        bank_code: bd.bank_code || "",
      });
      setSearchBank(bd.bank_name || "");
    }
  }, [bankDetailsData]);

  // Handle fetch errors (ignore 404 — means no bank details yet)
  useEffect(() => {
    if (fetchError && fetchError?.status !== 404) {
      setError(fetchError?.data?.message || "Error loading bank details");
      setShowErrorAlert(true);
    }
  }, [fetchError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "account_number") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else if (name === "account_name") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
    setSuccess("");
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
  };

  const handleBankSearch = (e) => {
    setSearchBank(e.target.value);
    setShowBankDropdown(true);
    setError("");
    setSuccess("");
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
  };

  const handleBankSelect = (bank) => {
    setFormData((prev) => ({
      ...prev,
      bank_name: bank.name,
      bank_code: bank.code,
    }));
    setSearchBank(bank.name);
    setShowBankDropdown(false);
  };

  const handleClearBank = () => {
    setFormData((prev) => ({ ...prev, bank_name: "", bank_code: "" }));
    setSearchBank("");
  };

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchBank.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showBankDropdown && !e.target.closest(".bank-search-container")) {
        setShowBankDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBankDropdown]);

  const validateForm = () => {
    if (!formData.account_number) {
      setError("Account number is required");
      setShowErrorAlert(true);
      return false;
    }
    if (!formData.bank_name) {
      setError("Bank name is required");
      setShowErrorAlert(true);
      return false;
    }
    if (!formData.account_name) {
      setError("Account name is required");
      setShowErrorAlert(true);
      return false;
    }
    if (formData.account_number.length < 10) {
      setError("Account number must be at least 10 digits");
      setShowErrorAlert(true);
      return false;
    }
    if (!/^\d+$/.test(formData.account_number)) {
      setError("Account number must contain only digits");
      setShowErrorAlert(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setSuccess("");
    setShowErrorAlert(false);
    setShowSuccessAlert(false);

    try {
      const result = await updateBankDetails(formData).unwrap();

      if (result.status === "success") {
        refetch();
        const successMessage =
          result.message || "Bank details updated successfully!";
        setSuccess(successMessage);
        setShowSuccessAlert(true);

        // Navigate after 2 seconds
        setTimeout(() => {
          navigate("/userdashboard/settings");
        }, 2000);
      }
    } catch (err) {
      const msg =
        err?.data?.message || "Error updating bank details. Please try again.";
      setError(msg);
      setShowErrorAlert(true);
      // Scroll error into view
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-12">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "12px" }}
          >
            <div className="card-body p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 70,
                    height: 70,
                    backgroundColor: "#E8F5E9",
                    borderRadius: "50%",
                  }}
                >
                  <svg width="35" height="35" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="2"
                      y="6"
                      width="20"
                      height="12"
                      rx="2"
                      stroke="#2D7A5E"
                      strokeWidth="2"
                    />
                    <path d="M2 10H22" stroke="#2D7A5E" strokeWidth="2" />
                    <path
                      d="M6 14H10"
                      stroke="#2D7A5E"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3
                  className="mb-2"
                  style={{
                    color: "#1E3A2F",
                    fontWeight: 600,
                    fontSize: "1.75rem",
                  }}
                >
                  Update Bank Details
                </h3>
                <p className="text-muted mb-0">
                  Provide your bank account information for secure transactions
                </p>
              </div>

              {/* Custom Alert Components */}
              {showErrorAlert && (
                <Alert
                  variant="destructive"
                  show={showErrorAlert}
                  onClose={() => {
                    setShowErrorAlert(false);
                    setError("");
                  }}
                  autoClose={true}
                  autoCloseTime={5000}
                >
                  <AlertDescription>
                    <strong>Error!</strong> {error}
                  </AlertDescription>
                </Alert>
              )}

              {showSuccessAlert && (
                <Alert
                  variant="success"
                  show={showSuccessAlert}
                  onClose={() => {
                    setShowSuccessAlert(false);
                    setSuccess("");
                  }}
                  autoClose={true}
                  autoCloseTime={3000}
                >
                  <AlertDescription>
                    <strong>Success!</strong> {success}
                  </AlertDescription>
                </Alert>
              )}

              {fetching ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    Loading bank details...
                  </p>
                </div>
              ) : (
                <>
                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    {/* Bank Name */}
                    <div className="mb-4 bank-search-container">
                      <label
                        htmlFor="bank_name"
                        className="form-label"
                        style={{
                          color: "#1E3A2F",
                          fontWeight: 500,
                          fontSize: "0.95rem",
                        }}
                      >
                        Bank Name <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            id="bank_name"
                            value={searchBank}
                            onChange={handleBankSearch}
                            onFocus={() => setShowBankDropdown(true)}
                            placeholder="Search or select your bank..."
                            required
                            disabled={loadingBanks}
                            style={{
                              borderColor: "#D1D5DB",
                              borderRadius: "8px",
                              padding: "12px 16px",
                              fontSize: "1rem",
                            }}
                          />
                          {formData.bank_name && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={handleClearBank}
                              style={{
                                borderColor: "#D1D5DB",
                                borderLeft: "none",
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {loadingBanks && (
                          <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                            <div
                              className="spinner-border spinner-border-sm text-success"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </div>
                        )}

                        {showBankDropdown && searchBank && !loadingBanks && (
                          <div
                            className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg"
                            style={{
                              maxHeight: 250,
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
                                  style={{
                                    cursor: "pointer",
                                    borderBottom: "1px solid #F3F4F6",
                                    padding: "12px 16px",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "#F9FAFB")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                      "white")
                                  }
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span
                                      style={{
                                        fontSize: "0.95rem",
                                        fontWeight: 500,
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
                      <small className="text-muted">
                        {loadingBanks
                          ? "Loading banks..."
                          : `Search from ${banks.length} Nigerian banks`}
                        {formData.bank_name && (
                          <span className="ms-2 text-success">
                            ✓ Selected: {formData.bank_name}
                          </span>
                        )}
                      </small>
                    </div>

                    {/* Account Number */}
                    <div className="mb-4">
                      <label
                        htmlFor="account_number"
                        className="form-label"
                        style={{
                          color: "#1E3A2F",
                          fontWeight: 500,
                          fontSize: "0.95rem",
                        }}
                      >
                        Account Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="account_number"
                        name="account_number"
                        value={formData.account_number}
                        onChange={handleChange}
                        placeholder="Enter your bank account number"
                        required
                        maxLength={15}
                        style={{
                          borderColor: "#D1D5DB",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          fontSize: "1rem",
                          fontFamily: "monospace",
                          letterSpacing: "1px",
                        }}
                      />
                      <small className="text-muted">
                        Minimum 10 digits (numbers only)
                      </small>
                    </div>

                    {/* Account Name */}
                    <div className="mb-4">
                      <label
                        htmlFor="account_name"
                        className="form-label"
                        style={{
                          color: "#1E3A2F",
                          fontWeight: 500,
                          fontSize: "0.95rem",
                        }}
                      >
                        Account Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="account_name"
                        name="account_name"
                        value={formData.account_name}
                        onChange={handleChange}
                        placeholder="Enter account holder's name"
                        required
                        style={{
                          borderColor: "#D1D5DB",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          fontSize: "1rem",
                        }}
                      />
                      <small className="text-muted">
                        Name as it appears on your bank account
                      </small>
                    </div>

                    {/* Bank Code (read-only) */}
                    {formData.bank_code && (
                      <div className="mb-4">
                        <label
                          className="form-label"
                          style={{
                            color: "#1E3A2F",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                          }}
                        >
                          Bank Code
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.bank_code}
                          readOnly
                          disabled
                          style={{
                            borderColor: "#D1D5DB",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            fontSize: "1rem",
                            fontFamily: "monospace",
                            backgroundColor: "#F9FAFB",
                          }}
                        />
                        <small className="text-muted">
                          Automatically populated when you select a bank
                        </small>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="d-flex gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/userdashboard/settings")}
                        disabled={updating}
                        style={{
                          borderRadius: "8px",
                          padding: "10px 20px",
                          fontWeight: 500,
                          fontSize: "0.9rem",
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn"
                        disabled={updating || fetching || !formData.bank_name}
                        style={{
                          backgroundColor: formData.bank_name
                            ? "#2D7A5E"
                            : "#9CA3AF",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 24px",
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          opacity: formData.bank_name ? 1 : 0.6,
                          minWidth: 120,
                        }}
                      >
                        {updating ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            />
                            Saving...
                          </>
                        ) : (
                          "Save changes"
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

export const UpdateBankDetailsPage = () => {
  return (
    <div
      className="contestPage"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}
    >
      <div className="row g-0">
        <div className="col-lg-3 col-sm-12"></div>
        <UserDashboardNavbar />
        <div className="mt-5 px-3 px-lg-4">
          <UpdateBankDetails />
        </div>
      </div>
    </div>
  );
};

export default UpdateBankDetailsPage;
