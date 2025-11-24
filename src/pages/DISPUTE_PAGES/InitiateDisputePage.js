import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Form, Card, Alert, Spinner, Badge } from "react-bootstrap";
import { UserDashboardNavbar } from "../../components/NavbarComponents/TopNavbars";
import { toast } from "react-toastify";
import { useInitiateDisputeMutation } from "../../redux/slices/disputeSlices/disputeAPISlice";

const InitiateDisputePage = () => {
  const { transaction_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const transaction = location.state?.transaction;
  const userEmail = transaction.buyer_email;
  const vendorEmail = transaction.vendor_email;
  console.log(transaction, "transaction");
  console.log(transaction.buyer_email, "transaction.buyer_email");
  console.log(transaction.vendor_email, "transaction.vendor_email");

  const [initiateDispute, { isLoading }] = useInitiateDisputeMutation();

  const [formData, setFormData] = useState({
    reason_for_dispute: "",
    dispute_description: "",
  });

  const disputeReasons = [
    { value: "Product Not Received", label: "Product Not Received" },
    { value: "Wrong Product Delivered", label: "Wrong Product Delivered" },
    { value: "Damaged Product", label: "Damaged Product" },
    { value: "Incomplete Order", label: "Incomplete Order" },
    { value: "Product Not as Described", label: "Product Not as Described" },
    { value: "Quality Issues", label: "Quality Issues" },
    { value: "Seller Not Responsive", label: "Seller Not Responsive" },
    { value: "Payment Issues", label: "Payment Issues" },
    { value: "Other", label: "Other" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.reason_for_dispute) {
      toast.error("Please select a reason for dispute");
      return;
    }

    if (
      !formData.dispute_description ||
      formData.dispute_description.trim().length < 20
    ) {
      toast.error(
        "Please provide a detailed description (minimum 20 characters)"
      );
      return;
    }

    try {
      // Format disputed products from transaction
      const disputedProducts =
        transaction?.products?.map((product) => ({
          name: product.name,
          image: product.image || "",
        })) || [];

      const response = await initiateDispute({
        user_email: userEmail,
        buyer_email: userEmail, // Backend requires both user_email and buyer_email
        vendor_name: transaction?.vendor_name,
        vendor_email: vendorEmail,
        vendor_phone_number: transaction?.vendor_phone_number,
        disputed_products: disputedProducts,
        transaction_id,
        reason_for_dispute: formData.reason_for_dispute,
        dispute_description: formData.dispute_description.trim(),
      }).unwrap();

      if (response.status === "success") {
        toast.success("Dispute raised successfully!");
        setTimeout(() => {
          navigate("/userdashboard/transaction-history");
        }, 2000);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to raise dispute");
      console.error("Error:", err);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { variant: "secondary", text: "Processing" },
      awaiting_payment: { variant: "warning", text: "Awaiting Payment" },
      payment_verified: { variant: "info", text: "Payment Verified" },
      awaiting_shipping: { variant: "warning", text: "Awaiting Shipping" },
      in_transit: { variant: "primary", text: "In Transit" },
      completed: { variant: "success", text: "Completed" },
      cancelled: { variant: "danger", text: "Cancelled" },
      inDispute: { variant: "danger", text: "In Dispute" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      text: status || "Unknown",
    };

    return (
      <Badge
        bg={config.variant}
        style={{
          fontSize: "0.75rem",
          fontWeight: "500",
          padding: "4px 8px",
        }}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="contestPage" style={{ backgroundColor: "#F9F9FB" }}>
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>
        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />

          <div className="mt-5 px-3 px-md-4">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {/* Header */}
                <div className="mb-4">
                  <Button
                    variant="link"
                    className="text-decoration-none p-0 mb-3"
                    onClick={() => navigate(-1)}
                    style={{ color: "#006747EB", fontSize: "0.95rem" }}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Transaction
                  </Button>
                  <h2 className="fw-bold" style={{ color: "#1a1a1a" }}>
                    <i
                      className="bi bi-flag me-3"
                      style={{ color: "#dc3545" }}></i>
                    Raise a Dispute
                  </h2>
                  <p className="text-muted mb-0">
                    Transaction ID:{" "}
                    <code style={{ color: "#006747EB" }}>{transaction_id}</code>
                  </p>
                </div>

                {/* Transaction Summary Card */}
                {transaction && (
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h6
                        className="fw-bold mb-3"
                        style={{ color: "#006747EB", fontSize: "1rem" }}>
                        <i className="bi bi-receipt me-2"></i>
                        Transaction Summary
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block mb-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}>
                            Vendor Name
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {transaction?.vendor_name || "N/A"}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block mb-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}>
                            Transaction Status
                          </small>
                          {getStatusBadge(transaction?.transaction_status)}
                        </div>
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block mb-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}>
                            Transaction Total
                          </small>
                          <span
                            className="fw-semibold"
                            style={{
                              fontSize: "0.875rem",
                              color: "#006747EB",
                            }}>
                            ₦{transaction?.transaction_total?.toLocaleString()}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block mb-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}>
                            Purchase Date
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {new Date(
                              transaction?.createdAt
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Dispute Form Card */}
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="mb-4">
                      <h5
                        className="fw-bold"
                        style={{ color: "#1a1a1a", fontSize: "1.1rem" }}>
                        Dispute Details
                      </h5>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.875rem" }}>
                        Please provide detailed information about your dispute.
                        Our team will review and respond within 24-48 hours.
                      </p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                      {/* Reason for Dispute */}
                      <div className="mb-4">
                        <Form.Label
                          className="fw-semibold"
                          style={{ fontSize: "0.95rem" }}>
                          <i
                            className="bi bi-exclamation-circle me-2"
                            style={{ color: "#dc3545" }}></i>
                          Reason for Dispute
                          <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Select
                          name="reason_for_dispute"
                          value={formData.reason_for_dispute}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                          style={{
                            fontSize: "0.95rem",
                            padding: "12px 16px",
                            borderColor: "#dee2e6",
                          }}>
                          <option value="">-- Select a reason --</option>
                          {disputeReasons.map((reason) => (
                            <option key={reason.value} value={reason.value}>
                              {reason.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                          Select the primary reason for raising this dispute
                        </Form.Text>
                      </div>

                      {/* Detailed Description */}
                      <div className="mb-4">
                        <Form.Label
                          className="fw-semibold"
                          style={{ fontSize: "0.95rem" }}>
                          <i
                            className="bi bi-file-text me-2"
                            style={{ color: "#006747EB" }}></i>
                          Detailed Description
                          <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="dispute_description"
                          value={formData.dispute_description}
                          onChange={handleChange}
                          placeholder="Please describe the issue in detail. Include any relevant information such as:&#10;- What went wrong?&#10;- When did you notice the issue?&#10;- Any communication with the vendor?&#10;- Steps you've taken to resolve this&#10;&#10;Be as specific as possible to help us understand your situation better."
                          required
                          disabled={isLoading}
                          style={{
                            fontSize: "0.95rem",
                            padding: "12px 16px",
                            minHeight: "150px",
                          }}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <Form.Text className="text-muted">
                            Minimum 20 characters required
                          </Form.Text>
                          <small
                            className={
                              formData.dispute_description.length < 20
                                ? "text-danger"
                                : "text-success"
                            }>
                            {formData.dispute_description.length} characters
                          </small>
                        </div>
                      </div>

                      {/* Important Notice Alert */}
                      <Alert
                        variant="warning"
                        className="border-0"
                        style={{ backgroundColor: "#fff3cd" }}>
                        <div className="d-flex align-items-start">
                          <i
                            className="bi bi-info-circle me-2 mt-1"
                            style={{
                              color: "#856404",
                              fontSize: "1.2rem",
                            }}></i>
                          <div>
                            <strong
                              className="d-block mb-2"
                              style={{
                                fontSize: "0.875rem",
                                color: "#856404",
                              }}>
                              Important Notice
                            </strong>
                            <ul
                              className="mb-0 ps-3"
                              style={{
                                fontSize: "0.875rem",
                                color: "#856404",
                              }}>
                              <li className="mb-1">
                                Disputes are reviewed within 24-48 business
                                hours
                              </li>
                              <li className="mb-1">
                                Both parties will be notified via email
                              </li>
                              <li className="mb-1">
                                False disputes may result in account suspension
                              </li>
                              <li>
                                Try resolving with the vendor before escalating
                              </li>
                            </ul>
                          </div>
                        </div>
                      </Alert>

                      {/* Submit Buttons */}
                      <div className="d-flex gap-3 mt-4">
                        <Button
                          type="button"
                          variant="outline-secondary"
                          onClick={() => navigate(-1)}
                          disabled={isLoading}
                          className="px-4"
                          style={{ fontSize: "0.95rem" }}>
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-grow-1 border-0"
                          style={{
                            backgroundColor: "#dc3545",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            padding: "12px",
                          }}>
                          {isLoading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Submitting Dispute...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-flag-fill me-2"></i>
                              Submit Dispute
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiateDisputePage;
