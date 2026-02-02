import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDashboardNavbar } from "../../../../components/NavbarComponents/TopNavbars";
import {
  useGetBankDetailsQuery,
  useUpdateBankDetailsMutation,
} from "../../../../redux/slices/profileSlice/profileAPISlice";

export const UpdateBankDetails = () => {
  const navigate = useNavigate();

  // RTK Query hooks
  const {
    data: bankDetailsData,
    isLoading: fetching,
    error: fetchError,
    refetch,
  } = useGetBankDetailsQuery();

  const [updateBankDetails, { isLoading: updating, error: updateError }] =
    useUpdateBankDetailsMutation();

  // Form data state
  const [formData, setFormData] = useState({
    account_number: "",
    bank_name: "",
    account_name: "",
    bank_code: "",
  });

  // Bank search state
  const [searchBank, setSearchBank] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  // UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
          }
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
          setError("Failed to load banks list. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching banks:", err);
        setError("Failed to load banks list. Please try again.");
      } finally {
        setLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    if (bankDetailsData?.data?.bank_details) {
      const bankDetails = bankDetailsData.data.bank_details;
      console.log("Loaded bank details:", bankDetails);
      setFormData({
        account_number: bankDetails.account_number || "",
        bank_name: bankDetails.bank_name || "",
        account_name: bankDetails.account_name || "",
        bank_code: bankDetails.bank_code || "",
      });
      setSearchBank(bankDetails.bank_name || "");
    }
  }, [bankDetailsData]);

  /**
   * Handle errors from RTK Query
   */
  useEffect(() => {
    if (fetchError) {
      const errorMsg =
        fetchError?.data?.message || "Error loading bank details";
      // Don't show error for 404 (no bank details yet)
      if (fetchError?.status !== 404) {
        setError(errorMsg);
      }
    }

    if (updateError) {
      setError(updateError?.data?.message || "Error updating bank details");
    }
  }, [fetchError, updateError]);

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

    setError("");
    setSuccess("");
  };

  const handleBankSearch = (e) => {
    const value = e.target.value;
    setSearchBank(value);
    setShowBankDropdown(true);
    setError("");
    setSuccess("");
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

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchBank.toLowerCase())
  );

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

  const validateForm = () => {
    // Check required fields
    if (!formData.account_number) {
      setError("Account number is required");
      return false;
    }

    if (!formData.bank_name) {
      setError("Bank name is required");
      return false;
    }

    if (!formData.account_name) {
      setError("Account name is required");
      return false;
    }

    // Validate account number length
    if (formData.account_number.length < 10) {
      setError("Account number must be at least 10 digits");
      return false;
    }

    // Validate account number is numeric
    if (!/^\d+$/.test(formData.account_number)) {
      setError("Account number must contain only digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      console.log("Submitting bank details:", formData);
      const result = await updateBankDetails(formData).unwrap();

      if (result.status === "success") {
        setSuccess(result.message || "Bank details updated successfully!");

        refetch();

        setTimeout(() => {
          navigate("/userdashboard/settings");
        }, 2000);
      }
    } catch (err) {
      const errorMsg =
        err?.data?.message || "Error updating bank details. Please try again.";
      setError(errorMsg);
      console.error("Bank details update error:", err);
    }
  };

  const handleCancel = () => {
    navigate("/userdashboard/settings");
  };

  const handleRefresh = () => {
    refetch();
    setError("");
  };

  /**
   * Clear bank selection
   */
  const handleClearBank = () => {
    setFormData((prev) => ({
      ...prev,
      bank_name: "",
      bank_code: "",
    }));
    setSearchBank("");
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-12">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "12px" }}>
            <div className="card-body p-4 p-md-5">
              {/* Page Header */}
              <div className="text-center mb-4">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "70px",
                    height: "70px",
                    backgroundColor: "#E8F5E9",
                    borderRadius: "50%",
                  }}>
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
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
                    fontWeight: "600",
                    fontSize: "1.75rem",
                  }}>
                  Update Bank Details
                </h3>
                <p className="text-muted mb-0">
                  Provide your bank account information for secure transactions
                </p>
              </div>

              {/* Loading State for Initial Data Fetch */}
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

                  {/* Bank Details Form */}
                  <form onSubmit={handleSubmit}>
                    {/* Bank Name Field with Search */}
                    <div className="mb-4 bank-search-container">
                      <label
                        htmlFor="bank_name"
                        className="form-label"
                        style={{
                          color: "#1E3A2F",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                        }}>
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
                              }}>
                              ×
                            </button>
                          )}
                        </div>

                        {/* Loading Indicator */}
                        {loadingBanks && (
                          <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                            <div
                              className="spinner-border spinner-border-sm text-success"
                              role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
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
                            }}>
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
                                    e.currentTarget.style.backgroundColor =
                                      "#F9FAFB";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "white";
                                  }}>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span
                                      style={{
                                        fontSize: "0.95rem",
                                        fontWeight: "500",
                                      }}>
                                      {bank.name}
                                    </span>
                                    <span
                                      className="badge"
                                      style={{
                                        backgroundColor: "#E8F5E9",
                                        color: "#2D7A5E",
                                        fontSize: "0.75rem",
                                      }}>
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

                    {/* Account Number Field */}
                    <div className="mb-4">
                      <label
                        htmlFor="account_number"
                        className="form-label"
                        style={{
                          color: "#1E3A2F",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                        }}>
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

                    {/* Account Name Field */}
                    <div className="mb-4">
                      <label
                        htmlFor="account_name"
                        className="form-label"
                        style={{
                          color: "#1E3A2F",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                        }}>
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

                    {/* Bank Code Display (Read-only) */}
                    {formData.bank_code && (
                      <div className="mb-4">
                        <label
                          className="form-label"
                          style={{
                            color: "#1E3A2F",
                            fontWeight: "500",
                            fontSize: "0.95rem",
                          }}>
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

                    {/* Action Buttons */}
                    <div className="d-flex gap-3 mt-4 align-items-center justify-content-between">
                      {/* Right side - Main Action Buttons */}
                      <div className="d-flex gap-2">
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
                          disabled={updating || fetching || !formData.bank_name}
                          style={{
                            backgroundColor: formData.bank_name
                              ? "#2D7A5E"
                              : "#9CA3AF",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 24px",
                            fontWeight: "500",
                            fontSize: "0.9rem",
                            transition: "all 0.2s ease",
                            opacity: formData.bank_name ? 1 : 0.6,
                          }}
                          onMouseEnter={(e) => {
                            if (formData.bank_name && !updating && !fetching) {
                              e.currentTarget.style.backgroundColor = "#235F4A";
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 8px rgba(45, 122, 94, 0.3)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (formData.bank_name && !updating && !fetching) {
                              e.currentTarget.style.backgroundColor = "#2D7A5E";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }
                          }}
                          onMouseDown={(e) => {
                            if (formData.bank_name && !updating && !fetching) {
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
                              Update
                            </>
                          )}
                        </button>
                      </div>
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
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
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
