import React, { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Form, Card, Alert, Spinner, Badge } from "react-bootstrap";
import { UserDashboardNavbar } from "../../components/NavbarComponents/TopNavbars";
import { toast } from "react-toastify";
import { useInitiateDisputeMutation } from "../../redux/slices/disputeSlices/disputeAPISlice";

// ============================================
// DISPUTE REASONS BY STAGE
// ============================================

const DISPUTE_REASONS = {
  pre_payment: [
    {
      value: "Seller Demanding Payment Outside Platform",
      label: "Seller Demanding Payment Outside Platform",
      description:
        "Seller is asking you to pay via a channel not supported by MyDoshBox",
    },
    {
      value: "Transaction Terms Changed Without Agreement",
      label: "Transaction Terms Changed Without Agreement",
      description:
        "Seller modified product details, price, or terms after initiation",
    },
    {
      value: "Suspicious Seller Activity",
      label: "Suspicious Seller Activity",
      description: "Seller behaviour appears fraudulent or suspicious",
    },
    {
      value: "Product No Longer Available",
      label: "Product No Longer Available",
      description:
        "Seller claims item is out of stock after transaction was created",
    },
    {
      value: "Price Discrepancy",
      label: "Price Discrepancy",
      description: "Quoted price does not match the agreed transaction amount",
    },
    {
      value: "Seller Not Responsive",
      label: "Seller Not Responsive",
      description: "Seller is unreachable or not confirming the transaction",
    },
    {
      value: "Other (Pre-Payment)",
      label: "Other",
      description: "Any other issue before payment was made",
    },
  ],

  post_payment: [
    {
      value: "Product Not Shipped",
      label: "Product Not Shipped",
      description: "Payment was made but seller has not shipped the item",
    },
    {
      value: "Shipping Delayed Beyond Agreed Timeframe",
      label: "Shipping Delayed Beyond Agreed Timeframe",
      description: "Delivery is taking significantly longer than agreed",
    },
    {
      value: "Wrong Tracking Information Provided",
      label: "Wrong Tracking Information Provided",
      description: "Seller provided invalid or mismatched tracking details",
    },
    {
      value: "Seller Refusing to Ship",
      label: "Seller Refusing to Ship",
      description: "Seller is withholding shipment after receiving payment",
    },
    {
      value: "Product Not Received",
      label: "Product Not Received",
      description: "Tracking shows delivered but item was never received",
    },
    {
      value: "Wrong Product Delivered",
      label: "Wrong Product Delivered",
      description:
        "A different product was delivered instead of what was ordered",
    },
    {
      value: "Damaged Product",
      label: "Damaged Product",
      description: "Product arrived broken, defective, or damaged in transit",
    },
    {
      value: "Incomplete Order",
      label: "Incomplete Order",
      description: "Only part of the order was delivered",
    },
    {
      value: "Product Not as Described",
      label: "Product Not as Described",
      description: "Item received does not match the listing description",
    },
    {
      value: "Quality Issues",
      label: "Quality Issues",
      description: "Product quality is significantly below what was advertised",
    },
    {
      value: "Counterfeit or Fake Product",
      label: "Counterfeit / Fake Product",
      description: "Item received appears to be counterfeit or not genuine",
    },
    {
      value: "Seller Not Responsive After Payment",
      label: "Seller Not Responsive After Payment",
      description: "Seller has gone silent after payment was confirmed",
    },
    {
      value: "Other (Post-Payment)",
      label: "Other",
      description: "Any other issue that occurred after payment was made",
    },
  ],

  post_delivery: [
    {
      value: "Product Stopped Working After Delivery",
      label: "Product Stopped Working After Delivery",
      description:
        "Item malfunctioned or failed shortly after confirmed delivery",
    },
    {
      value: "Hidden Defects Discovered",
      label: "Hidden Defects Discovered",
      description: "Defects not visible at delivery were discovered later",
    },
    {
      value: "Product Not as Described After Inspection",
      label: "Product Not as Described After Inspection",
      description:
        "Closer inspection revealed the item differs from the listing",
    },
    {
      value: "Missing Accessories or Components",
      label: "Missing Accessories or Components",
      description: "Listed accessories or parts were not included",
    },
    {
      value: "Quality Below Agreed Standard",
      label: "Quality Below Agreed Standard",
      description: "Product does not meet the quality level agreed upon",
    },
    {
      value: "Seller Requesting Extra Payment After Delivery",
      label: "Seller Requesting Extra Payment After Delivery",
      description:
        "Seller is demanding additional funds after delivery was confirmed",
    },
    {
      value: "Other (Post-Delivery)",
      label: "Other",
      description: "Any other issue discovered after delivery was confirmed",
    },
  ],
};

// ============================================
// STAGE DETECTION
// ============================================

const getDisputeStage = (transaction) => {
  if (!transaction) return null;
  if (!transaction.verified_payment_status) return "pre_payment";
  if (!transaction.buyer_confirm_status) return "post_payment";
  return "post_delivery";
};

const STAGE_META = {
  pre_payment: {
    label: "Pre-Payment",
    color: "#854F0B",
    bg: "#FAEEDA",
    border: "#F59E0B",
    icon: "bi-clock",
    description:
      "Payment has not been made yet. Issues relate to transaction setup or seller behaviour.",
  },
  post_payment: {
    label: "Post-Payment",
    color: "#0C447C",
    bg: "#E6F1FB",
    border: "#378ADD",
    icon: "bi-credit-card-fill",
    description:
      "Payment confirmed but delivery not yet acknowledged. Issues relate to shipping or product receipt.",
  },
  post_delivery: {
    label: "Post-Delivery",
    color: "#065F46",
    bg: "#ECFDF5",
    border: "#10B981",
    icon: "bi-box-seam",
    description:
      "Delivery confirmed. Issues relate to product condition, quality, or post-delivery seller behaviour.",
  },
};

// ============================================
// MAIN PAGE
// ============================================

const InitiateDisputePage = () => {
  const { transaction_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const transaction = location.state?.transaction;

  const { userInfo } = useSelector((state) => state.usersauth);
  const currentUserEmail =
    userInfo?.user?.email || userInfo?.email || userInfo?.organization_email;

  const [initiateDispute, { isLoading }] = useInitiateDisputeMutation();

  const [formData, setFormData] = useState({
    reason_for_dispute: "",
    dispute_description: "",
  });

  // Derive stage from transaction state
  const disputeStage = useMemo(
    () => getDisputeStage(transaction),
    [transaction],
  );
  const stageMeta = disputeStage ? STAGE_META[disputeStage] : null;
  const reasons = disputeStage ? DISPUTE_REASONS[disputeStage] : [];

  const isBuyer = currentUserEmail === transaction?.buyer_email;
  const isSeller = currentUserEmail === transaction?.vendor_email;
  const userRole = isBuyer ? "Buyer" : isSeller ? "Seller" : "Unknown";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset reason if stage somehow changes
  const handleReasonChange = (e) => {
    setFormData((prev) => ({ ...prev, reason_for_dispute: e.target.value }));
  };

  const selectedReason = reasons.find(
    (r) => r.value === formData.reason_for_dispute,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reason_for_dispute) {
      toast.error("Please select a reason for dispute");
      return;
    }

    if (
      !formData.dispute_description ||
      formData.dispute_description.trim().length < 20
    ) {
      toast.error(
        "Please provide a detailed description (minimum 20 characters)",
      );
      return;
    }

    try {
      const disputedProducts =
        transaction?.products?.map((product) => ({
          name: product.name,
          image: product.image || "",
        })) || [];

      const response = await initiateDispute({
        user_email: currentUserEmail,
        buyer_email: transaction?.buyer_email,
        vendor_name: transaction?.vendor_name,
        vendor_email: transaction?.vendor_email,
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
        style={{ fontSize: "0.75rem", fontWeight: 500, padding: "4px 8px" }}
      >
        {config.text}
      </Badge>
    );
  };

  return (
    <div
      className="container-fluid px-0"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}
    >
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />

          <div className="mt-5 px-3 px-md-4 pb-5">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {/* Header */}
                <div className="mb-4">
                  <Button
                    variant="link"
                    className="text-decoration-none p-0 mb-3"
                    onClick={() => navigate(-1)}
                    style={{ color: "#006747EB", fontSize: "0.95rem" }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>Back to Transaction
                  </Button>
                  <h2 className="fw-bold" style={{ color: "#1a1a1a" }}>
                    <i
                      className="bi bi-flag me-3"
                      style={{ color: "#dc3545" }}
                    ></i>
                    Raise a Dispute
                  </h2>
                  <p className="text-muted mb-0">
                    Transaction ID:{" "}
                    <code style={{ color: "#006747EB" }}>{transaction_id}</code>
                  </p>
                  <p className="text-muted mb-0">
                    You are raising this dispute as: <strong>{userRole}</strong>
                  </p>
                </div>

                {/* ============================================
                    TRANSACTION SUMMARY CARD
                ============================================ */}
                {transaction && (
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h6
                        className="fw-bold mb-3"
                        style={{ color: "#006747EB", fontSize: "1rem" }}
                      >
                        <i className="bi bi-receipt me-2"></i>Transaction
                        Summary
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block mb-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Vendor Name
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {transaction?.vendor_name || "N/A"}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block mb-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Transaction Status
                          </small>
                          {getStatusBadge(transaction?.transaction_status)}
                        </div>
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block mb-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Transaction Total
                          </small>
                          <span
                            className="fw-semibold"
                            style={{ fontSize: "0.875rem", color: "#006747EB" }}
                          >
                            ₦{transaction?.transaction_total?.toLocaleString()}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block mb-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Purchase Date
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {new Date(
                              transaction?.createdAt,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block mb-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Buyer Email
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {transaction?.buyer_email}
                            {isBuyer && (
                              <Badge bg="primary" className="ms-2">
                                You
                              </Badge>
                            )}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block mb-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Vendor Email
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {transaction?.vendor_email}
                            {isSeller && (
                              <Badge bg="info" className="ms-2">
                                You
                              </Badge>
                            )}
                          </span>
                        </div>

                        {/* Payment & delivery status pills */}
                        <div className="col-12">
                          <small
                            className="text-muted d-block mb-2 fw-bold"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Transaction Checkpoints
                          </small>
                          <div className="d-flex flex-wrap gap-2">
                            <span
                              style={{
                                fontSize: "0.78rem",
                                fontWeight: 500,
                                padding: "4px 12px",
                                borderRadius: 99,
                                backgroundColor:
                                  transaction?.verified_payment_status
                                    ? "#ECFDF5"
                                    : "#FEF2F2",
                                color: transaction?.verified_payment_status
                                  ? "#065F46"
                                  : "#991B1B",
                                border: `1px solid ${transaction?.verified_payment_status ? "#6EE7B7" : "#FECACA"}`,
                              }}
                            >
                              <i
                                className={`bi ${transaction?.verified_payment_status ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-1`}
                              ></i>
                              Payment{" "}
                              {transaction?.verified_payment_status
                                ? "Verified"
                                : "Not Verified"}
                            </span>
                            <span
                              style={{
                                fontSize: "0.78rem",
                                fontWeight: 500,
                                padding: "4px 12px",
                                borderRadius: 99,
                                backgroundColor: transaction?.shipping_submitted
                                  ? "#ECFDF5"
                                  : "#FEF2F2",
                                color: transaction?.shipping_submitted
                                  ? "#065F46"
                                  : "#991B1B",
                                border: `1px solid ${transaction?.shipping_submitted ? "#6EE7B7" : "#FECACA"}`,
                              }}
                            >
                              <i
                                className={`bi ${transaction?.shipping_submitted ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-1`}
                              ></i>
                              {transaction?.shipping_submitted
                                ? "Shipped"
                                : "Not Shipped"}
                            </span>
                            <span
                              style={{
                                fontSize: "0.78rem",
                                fontWeight: 500,
                                padding: "4px 12px",
                                borderRadius: 99,
                                backgroundColor:
                                  transaction?.buyer_confirm_status
                                    ? "#ECFDF5"
                                    : "#FEF2F2",
                                color: transaction?.buyer_confirm_status
                                  ? "#065F46"
                                  : "#991B1B",
                                border: `1px solid ${transaction?.buyer_confirm_status ? "#6EE7B7" : "#FECACA"}`,
                              }}
                            >
                              <i
                                className={`bi ${transaction?.buyer_confirm_status ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-1`}
                              ></i>
                              Delivery{" "}
                              {transaction?.buyer_confirm_status
                                ? "Confirmed"
                                : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* ============================================
                    DISPUTE FORM CARD
                ============================================ */}
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="mb-4">
                      <h5
                        className="fw-bold"
                        style={{ color: "#1a1a1a", fontSize: "1.1rem" }}
                      >
                        Dispute Details
                      </h5>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.875rem" }}
                      >
                        Select the reason that best describes your issue.
                        Reasons shown are specific to your current transaction
                        stage ({stageMeta?.label}).
                      </p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                      {/* Reason for Dispute */}
                      <div className="mb-1">
                        <Form.Label
                          className="fw-semibold"
                          style={{ fontSize: "0.95rem" }}
                        >
                          <i
                            className="bi bi-exclamation-circle me-2"
                            style={{ color: "#dc3545" }}
                          ></i>
                          Reason for Dispute
                          <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Select
                          name="reason_for_dispute"
                          value={formData.reason_for_dispute}
                          onChange={handleReasonChange}
                          required
                          disabled={isLoading || !disputeStage}
                          style={{
                            fontSize: "0.95rem",
                            padding: "12px 16px",
                            borderColor: "#dee2e6",
                          }}
                        >
                          <option value="">
                            {disputeStage
                              ? `-- Select a ${stageMeta?.label} reason (${reasons.length} available) --`
                              : "-- Loading transaction details... --"}
                          </option>
                          {reasons.map((reason) => (
                            <option key={reason.value} value={reason.value}>
                              {reason.label}
                            </option>
                          ))}
                        </Form.Select>
                      </div>

                      {/* Reason description hint */}
                      {selectedReason && (
                        <div
                          className="mb-4 mt-2 px-3 py-2 d-flex align-items-center gap-2"
                          style={{
                            backgroundColor: "#F0FDF4",
                            border: "1px solid #BBF7D0",
                            borderRadius: 8,
                          }}
                        >
                          <i
                            className="bi bi-info-circle-fill"
                            style={{ color: "#16A34A", flexShrink: 0 }}
                          ></i>
                          <small
                            style={{ color: "#15803D", fontSize: "0.85rem" }}
                          >
                            {selectedReason.description}
                          </small>
                        </div>
                      )}

                      {!selectedReason && (
                        <Form.Text className="text-muted d-block mb-4">
                          Select the primary reason that best matches your
                          situation
                        </Form.Text>
                      )}

                      {/* Detailed Description */}
                      <div className="mb-4">
                        <Form.Label
                          className="fw-semibold"
                          style={{ fontSize: "0.95rem" }}
                        >
                          <i
                            className="bi bi-file-text me-2"
                            style={{ color: "#006747EB" }}
                          ></i>
                          Detailed Description
                          <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="dispute_description"
                          value={formData.dispute_description}
                          onChange={handleChange}
                          placeholder={
                            disputeStage === "pre_payment"
                              ? "Describe what happened before payment:\n- What did the seller do or say?\n- When did you notice the issue?\n- Any suspicious activity or communication?\n- What outcome are you expecting?"
                              : disputeStage === "post_payment"
                                ? "Describe what happened after payment:\n- When was payment made?\n- Did you receive tracking info?\n- What was the expected vs actual delivery date?\n- Describe the product issue in detail."
                                : "Describe what happened after delivery:\n- When did you notice the issue?\n- How does the product differ from what was listed?\n- Have you contacted the seller?\n- What resolution are you expecting?"
                          }
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
                            }
                          >
                            {formData.dispute_description.length} characters
                          </small>
                        </div>
                      </div>

                      {/* Important Notice */}
                      <Alert
                        variant="warning"
                        className="border-0"
                        style={{ backgroundColor: "#fff3cd" }}
                      >
                        <div className="d-flex align-items-start">
                          <i
                            className="bi bi-info-circle me-2 mt-1"
                            style={{ color: "#856404", fontSize: "1.2rem" }}
                          ></i>
                          <div>
                            <strong
                              className="d-block mb-2"
                              style={{ fontSize: "0.875rem", color: "#856404" }}
                            >
                              Important Notice
                            </strong>
                            <ul
                              className="mb-0 ps-3"
                              style={{ fontSize: "0.875rem", color: "#856404" }}
                            >
                              <li className="mb-1">
                                Disputes are reviewed within 24–48 business
                                hours
                              </li>
                              <li className="mb-1">
                                Both parties will be notified via email
                              </li>
                              <li className="mb-1">
                                False disputes may result in account suspension
                              </li>
                              <li className="mb-1">
                                Try resolving with the other party before
                                escalating
                              </li>
                              <li>
                                <strong>
                                  You are raising this as: {userRole} (
                                  {stageMeta?.label} dispute)
                                </strong>
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
                          style={{ fontSize: "0.95rem" }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading || !disputeStage}
                          className="flex-grow-1 border-0"
                          style={{
                            backgroundColor: "#dc3545",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            padding: "12px",
                          }}
                        >
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
                              Submit {stageMeta?.label} Dispute as {userRole}
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
