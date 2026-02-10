import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Badge, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import {
  useFetchAllShippingDetailsQuery,
  useBuyerConfirmsProductMutation,
} from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useSelector } from "react-redux";

// ========================================
// HELPER FUNCTIONS
// ========================================

const getStatusBadge = (status) => {
  const statusConfig = {
    processing: {
      variant: "secondary",
      bg: "#6c757d",
      text: "Processing",
    },
    awaiting_payment: {
      variant: "warning",
      bg: "#ffc107",
      text: "Awaiting Payment",
    },
    payment_verified: {
      variant: "info",
      bg: "#0dcaf0",
      text: "Payment Verified",
    },
    awaiting_shipping: {
      variant: "warning",
      bg: "#ffc107",
      text: "Awaiting Shipping",
    },
    in_transit: {
      variant: "primary",
      bg: "#0d6efd",
      text: "In Transit",
    },
    completed: {
      variant: "success",
      bg: "#198754",
      text: "Completed",
    },
    cancelled: {
      variant: "danger",
      bg: "#dc3545",
      text: "Cancelled",
    },
    inDispute: {
      variant: "danger",
      bg: "#dc3545",
      text: "In Dispute",
    },
  };

  const config = statusConfig[status] || {
    variant: "secondary",
    bg: "#6c757d",
    text: status || "Unknown",
  };

  return (
    <Badge
      bg={config.variant}
      style={{
        fontSize: "0.75rem",
        fontWeight: "500",
        padding: "4px 8px",
      }}
    >
      {config.text}
    </Badge>
  );
};

// ========================================
// MAIN COMPONENT
// ========================================

const ShippingDetailsPage = () => {
  const { shippingId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail =
    userInfo?.user?.email ||
    userInfo?.email ||
    userInfo?.organization_email ||
    userInfo?.userInfo?.email;

  const {
    data: shippingDetails,
    error,
    isLoading,
    refetch,
  } = useFetchAllShippingDetailsQuery(userEmail, {
    refetchOnMountOrArgChange: true,
  });

  const [buyerConfirmProduct] = useBuyerConfirmsProductMutation();
  const [isConfirming, setIsConfirming] = useState(false);

  // Find the specific shipping detail
  const selectedShipping = shippingDetails?.transactions?.find(
    (shipping) => shipping._id === shippingId,
  );
  console.log(selectedShipping, "selectedShipping");

  const handleConfirmProduct = async () => {
    if (!selectedShipping) return;

    try {
      setIsConfirming(true);
      toast.info("Confirming product receipt...", { autoClose: 2000 });

      await buyerConfirmProduct(
        selectedShipping?.product?.transaction_id,
      ).unwrap();

      toast.success("Product confirmed successfully!");
      navigate(
        "/userdashboard/transaction-history/confirm-escrow-product-transaction/settled-transactions-history",
      );
    } catch (error) {
      toast.error(error?.data?.message || "Failed to confirm product");
    } finally {
      setIsConfirming(false);
    }
  };

  const shouldShowVerifyButton = () => {
    return (
      selectedShipping &&
      userEmail === selectedShipping?.buyer_email &&
      userEmail !== selectedShipping?.product?.vendor_email &&
      selectedShipping?.product?.transaction_status === "in_transit"
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

          <div className="px-3 px-lg-4 py-4">
            {/* Back Button */}
            <div className="mb-4">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate(-1)}
                style={{ fontSize: "0.875rem" }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Shipping History
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-5">
                <Spinner
                  animation="border"
                  style={{ color: "#006747EB", width: "3rem", height: "3rem" }}
                />
                <p className="mt-3 text-muted">Loading shipping details...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Failed to load shipping details. Please try again.
              </div>
            )}

            {/* Not Found State */}
            {!isLoading && !error && !selectedShipping && (
              <div className="text-center py-5">
                <i
                  className="bi bi-box-seam"
                  style={{ fontSize: "3rem", color: "#6c757d" }}
                ></i>
                <p className="mt-3 text-muted">Shipping details not found</p>
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    navigate(
                      "/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-history",
                    )
                  }
                >
                  Return to Shipping History
                </Button>
              </div>
            )}

            {/* Shipping Details Content */}
            {!isLoading && !error && selectedShipping && (
              <div className="bg-white rounded-1 p-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom">
                  <div>
                    <h3
                      className="fs-4 m-0 fw-bold mb-2"
                      style={{ color: "#1a1a1a" }}
                    >
                      <i
                        className="bi bi-box-seam me-2"
                        style={{ color: "#006747EB" }}
                      ></i>
                      Shipping Details
                    </h3>
                    <small className="text-muted">
                      Complete information about your shipment
                    </small>
                  </div>
                  {getStatusBadge(
                    selectedShipping?.product?.transaction_status,
                  )}
                </div>

                {shouldShowVerifyButton() && (
                  <div className="alert alert-info d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-info-circle me-2"></i>
                      <div>
                        <strong>Action Needed:</strong> Please confirm you have
                        received your product.
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction Info */}
                <div className="mb-4">
                  <h6
                    className="fw-bold mb-3 pb-2"
                    style={{
                      fontSize: "0.95rem",
                      color: "#006747EB",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    <i className="bi bi-receipt me-2"></i>
                    Transaction Information
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <small
                        className="text-muted d-block mb-1"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Transaction ID
                      </small>
                      <code
                        style={{
                          fontSize: "0.75rem",
                          color: "#006747EB",
                          backgroundColor: "#e7f5f1",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {selectedShipping?.product?.transaction_id}
                      </code>
                    </div>
                    <div className="col-md-6">
                      <small
                        className="text-muted d-block mb-1"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Transaction Status
                      </small>
                      {getStatusBadge(
                        selectedShipping?.product?.transaction_status,
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="mb-4">
                  <h6
                    className="fw-bold mb-3 pb-2"
                    style={{
                      fontSize: "0.95rem",
                      color: "#006747EB",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    <i className="bi bi-truck me-2"></i>
                    Shipping Information
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <div className="mb-2">
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Shipping Company
                          </small>
                          <span
                            className="fw-semibold"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {selectedShipping?.shipping_company}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Delivery Person
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {selectedShipping?.delivery_person_name}
                          </span>
                        </div>
                        <div>
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Contact Number
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {selectedShipping?.delivery_person_number}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <div className="mb-2">
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Delivery Date
                          </small>
                          <span
                            className="fw-semibold"
                            style={{ fontSize: "0.875rem" }}
                          >
                            {new Date(
                              selectedShipping?.delivery_date,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Pick Up Address
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {selectedShipping?.pick_up_address}
                          </span>
                        </div>
                        <div>
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Delivery Person Email
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {selectedShipping?.delivery_person_email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="mb-4">
                  <h6
                    className="fw-bold mb-3 pb-2"
                    style={{
                      fontSize: "0.95rem",
                      color: "#006747EB",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    <i className="bi bi-box-seam me-2"></i>
                    Product Details (
                    {selectedShipping?.product?.products?.length || 0})
                  </h6>
                  {selectedShipping?.product?.products?.length > 0 ? (
                    <div className="row g-3">
                      {selectedShipping.product.products.map(
                        (product, index) => (
                          <div key={product._id || index} className="col-12">
                            <div
                              className="d-flex gap-3 p-3 rounded"
                              style={{
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              {/* Product Image */}
                              {product.image && (
                                <div style={{ flexShrink: 0 }}>
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      border: "1px solid #dee2e6",
                                    }}
                                  />
                                </div>
                              )}

                              {/* Product Info */}
                              <div className="flex-grow-1">
                                <div className="mb-2">
                                  <span
                                    className="fw-semibold d-block"
                                    style={{
                                      fontSize: "0.95rem",
                                      color: "#1a1a1a",
                                    }}
                                  >
                                    {product.name}
                                  </span>
                                  <small
                                    className="text-muted"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    {product.description}
                                  </small>
                                </div>

                                <div className="d-flex flex-wrap gap-3 mt-2">
                                  <div>
                                    <small
                                      className="text-muted d-block"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      Quantity
                                    </small>
                                    <span
                                      className="fw-semibold"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      {product.quantity}
                                    </span>
                                  </div>
                                  <div>
                                    <small
                                      className="text-muted d-block"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      Unit Price
                                    </small>
                                    <span
                                      className="fw-semibold"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      ₦{product.price?.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <small
                                      className="text-muted d-block"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      Subtotal
                                    </small>
                                    <span
                                      className="fw-semibold text-success"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      ₦
                                      {(
                                        product.price * product.quantity
                                      )?.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}

                      {/* Transaction Total */}
                      <div className="col-12">
                        <div
                          className="d-flex justify-content-between align-items-center p-3 rounded"
                          style={{ backgroundColor: "#e7f5f1" }}
                        >
                          <span
                            className="fw-bold"
                            style={{ fontSize: "0.95rem" }}
                          >
                            Transaction Total:
                          </span>
                          <span
                            className="fw-bold"
                            style={{ fontSize: "1.1rem", color: "#006747EB" }}
                          >
                            ₦
                            {selectedShipping?.product?.transaction_total?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.875rem" }}
                    >
                      No product details available
                    </p>
                  )}
                </div>

                {/* Vendor Information */}
                <div className="mb-4">
                  <h6
                    className="fw-bold mb-3 pb-2"
                    style={{
                      fontSize: "0.95rem",
                      color: "#006747EB",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    <i className="bi bi-shop me-2"></i>
                    Vendor Information
                  </h6>
                  <div
                    className="p-3 rounded"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div className="row g-2">
                      <div className="col-md-6">
                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Vendor Name
                        </small>
                        <span
                          className="fw-semibold"
                          style={{ fontSize: "0.875rem" }}
                        >
                          {selectedShipping?.product?.vendor_name ||
                            selectedShipping?.vendor_name}
                        </span>
                      </div>
                      <div className="col-md-6">
                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Contact Email
                        </small>
                        <span style={{ fontSize: "0.875rem" }}>
                          {selectedShipping?.product?.vendor_email ||
                            selectedShipping?.vendor_email}
                        </span>
                      </div>
                      {(selectedShipping?.product?.vendor_phone_number ||
                        selectedShipping?.vendor_phone_number) && (
                        <div className="col-md-6">
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Phone Number
                          </small>
                          <span style={{ fontSize: "0.875rem" }}>
                            {selectedShipping?.product?.vendor_phone_number ||
                              selectedShipping?.vendor_phone_number}
                          </span>
                        </div>
                      )}
                      <div className="col-md-6">
                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Payment Status
                        </small>
                        {selectedShipping?.product?.verified_payment_status ? (
                          <Badge bg="success" style={{ fontSize: "0.75rem" }}>
                            <i className="bi bi-check-circle me-1"></i>
                            Paid
                          </Badge>
                        ) : (
                          <Badge bg="warning" style={{ fontSize: "0.75rem" }}>
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-4">
                  <h6
                    className="fw-bold mb-3 pb-2"
                    style={{
                      fontSize: "0.95rem",
                      color: "#006747EB",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    Timeline
                  </h6>
                  <div style={{ fontSize: "0.875rem" }}>
                    <div className="mb-2">
                      <strong>Purchase Date:</strong>{" "}
                      {new Date(
                        selectedShipping?.product?.createdAt,
                      ).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Bottom */}
                <div className="d-flex gap-2 flex-wrap border-top pt-4">
                  {shouldShowVerifyButton() && (
                    <Button
                      onClick={handleConfirmProduct}
                      disabled={isConfirming}
                      className="border-0"
                      style={{
                        backgroundColor: "#006747EB",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        padding: "10px 20px",
                      }}
                    >
                      {isConfirming ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Confirm Product Receipt
                        </>
                      )}
                    </Button>
                  )}
                  {shouldShowVerifyButton() && (
                    <Link
                      to={`/userdashboard/disputes/initiate-dispute/${selectedShipping?.product?.transaction_id}`}
                      state={{ transaction: selectedShipping?.product }}
                    >
                      <Button
                        variant="outline-danger"
                        style={{ fontSize: "0.875rem", padding: "10px 20px" }}
                      >
                        <i className="bi bi-flag me-2"></i> Raise Dispute
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetailsPage;
