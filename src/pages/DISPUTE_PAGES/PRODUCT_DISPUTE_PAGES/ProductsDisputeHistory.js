import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate } from "react-router-dom";
import { Button, Badge, Card, Alert } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useBuyerConfirmsProductMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useFetchDisputeDetailsQuery } from "../../../redux/slices/disputeSlices/disputeAPISlice";
import { useSelector } from "react-redux";

const ProductsDisputeHistory = ({ customFilter, showHeaderActions = true }) => {
  return (
    <div
      className="container-fluid px-0"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />
          <div className="px-3 px-lg-4 py-2">
            <RecentDisputeTable
              customFilter={customFilter}
              showHeaderActions={showHeaderActions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// STATUS BADGE HELPER FUNCTIONS - MATCHING PRODUCT HISTORY
// ========================================

const getStatusBadge = (status) => {
  const statusConfig = {
    processing: {
      variant: "secondary",
      bg: "#6c757d",
      text: "Processing",
    },
    resolving: {
      variant: "info",
      bg: "#0dcaf0",
      text: "Resolving",
    },
    resolved: {
      variant: "success",
      bg: "#198754",
      text: "Resolved",
    },
    cancelled: {
      variant: "danger",
      bg: "#dc3545",
      text: "Cancelled",
    },
    escalated_to_mediator: {
      variant: "danger",
      bg: "#dc3545",
      text: "Escalated to Mediator",
    },
    In_Dispute: {
      variant: "warning",
      bg: "#ffc107",
      text: "In Dispute",
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
    completed: {
      variant: "success",
      bg: "#198754",
      text: "Completed",
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
      }}>
      {config.text}
    </Badge>
  );
};

const getResolutionMethodBadge = (method) => {
  const methodConfig = {
    direct_negotiation: { variant: "primary", text: "Direct Negotiation" },
    mediator_involved: { variant: "info", text: "Mediator Involved" },
    automated_resolution: { variant: "success", text: "Automated Resolution" },
    dispute_parties: { variant: "warning", text: "Parties Negotiation" },
  };

  const config = methodConfig[method] || { variant: "secondary", text: method };

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

// Predefined filters for different dispute status pages
export const DISPUTE_FILTERS = {
  ALL: {
    status: "all",
    title: "All Dispute Details",
    filterFunction: (disputes) => disputes,
    emptyMessage: "You don't have any active disputes",
    emptyDescription: "Start by raising a dispute for any transaction issues",
  },
  IN_PROGRESS: {
    status: "inProgress",
    title: "Disputes In Progress",
    filterFunction: (disputes) => {
      return disputes.filter(
        (dispute) =>
          dispute.dispute_status === "processing" ||
          dispute.dispute_status === "resolving" ||
          dispute.dispute_status === "In_Dispute" ||
          dispute.dispute_status === "escalated_to_mediator"
      );
    },
    emptyMessage: "You don't have any disputes in progress",
    emptyDescription: "All your disputes are either resolved or cancelled",
  },
  RESOLVED: {
    status: "resolved",
    title: "Resolved Disputes",
    filterFunction: (disputes) => {
      return disputes.filter(
        (dispute) =>
          dispute.dispute_status === "resolved" ||
          dispute.dispute_status === "completed"
      );
    },
    emptyMessage: "No resolved disputes found",
    emptyDescription:
      "Disputes that have been successfully resolved will appear here",
  },
  CANCELLED: {
    status: "cancelled",
    title: "Cancelled Disputes",
    filterFunction: (disputes) => {
      return disputes.filter(
        (dispute) => dispute.dispute_status === "cancelled"
      );
    },
    emptyMessage: "No cancelled disputes found",
    emptyDescription: "Disputes that were cancelled will appear here",
  },
};

export const RecentDisputeTable = ({
  customFilter = DISPUTE_FILTERS.ALL,
  showHeaderActions = true,
}) => {
  const { userInfo } = useSelector((state) => state.usersauth);

  const userEmail =
    userInfo?.email || userInfo?.user?.email || userInfo?.organization_email;

  console.log("📧 User Email for dispute fetch:", userEmail);

  const {
    data: disputeResponse,
    error,
    isLoading,
    refetch,
  } = useFetchDisputeDetailsQuery(userEmail, {
    refetchOnMountOrArgChange: true,
    skip: !userEmail,
  });

  const allDisputes = disputeResponse?.data?.disputes || [];
  const pagination = disputeResponse?.data?.pagination;

  // Apply custom filter to disputes
  const filteredDisputes = customFilter.filterFunction(allDisputes);

  const dropdownBtnValues = [
    { label: "All Data", value_1: "Last 7 days", value_2: "Over $1000" },
    { label: "2021", value_1: "2022", value_2: "2023" },
  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(pagination?.totalPages || 0);

  const navigate = useNavigate();
  const [buyerconfirmProduct] = useBuyerConfirmsProductMutation();

  // Update totalPages when pagination changes
  useEffect(() => {
    const filteredTotalPages = Math.ceil(
      filteredDisputes.length / itemsPerPage
    );
    setTotalPages(filteredTotalPages);
    // Reset to page 1 when filter changes
    setCurrentPage(1);
  }, [filteredDisputes.length, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNavigateToDispute = (transactionId) => {
    navigate(`/userdashboard/disputes/dispute-details/${transactionId}`);
  };

  const handleResolveDispute = (transactionId) => {
    navigate(`/userdashboard/disputes/resolve-dispute/${transactionId}`);
  };

  const handleInvolveMediator = async (transactionId, e) => {
    if (e) e.preventDefault();
    try {
      const res = await buyerconfirmProduct(transactionId).unwrap();
      toast.success(res?.message);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const getSlicedData = () => {
    if (!filteredDisputes || filteredDisputes.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDisputes.slice(startIndex, endIndex);
  };

  // Loading State - Matching product history style
  if (isLoading) {
    return (
      <div className="bg-white rounded-1 p-4 text-center">
        <div
          className="spinner-border"
          style={{ color: "#006747EB", width: "3rem", height: "3rem" }}
          role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted" style={{ fontSize: "0.95rem" }}>
          Loading disputes...
        </p>
      </div>
    );
  }

  // Error State - Matching product history style
  if (error && error.status !== 404) {
    return (
      <div className="bg-white rounded-1 p-4">
        <div className="text-center py-5">
          <i
            className="bi bi-exclamation-triangle text-danger"
            style={{ fontSize: "3rem" }}></i>
          <p
            className="mt-3 text-danger fw-semibold"
            style={{ fontSize: "1rem" }}>
            Failed to load disputes
          </p>
          <p className="text-muted mb-3" style={{ fontSize: "0.875rem" }}>
            {error?.data?.message ||
              "Please check your connection and try again"}
          </p>
          <Button
            variant="outline-success"
            onClick={() => refetch()}
            style={{ fontSize: "0.875rem" }}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-1 p-3 w-100">
      {/* Header Section - Matching product history style */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fs-5 m-0 fw-bold" style={{ color: "#1a1a1a" }}>
            {customFilter.title}
          </h3>
        </div>

        {showHeaderActions && (
          <div className="d-flex flex-wrap gap-2 align-items-center">
            {dropdownBtnValues.map((item, index) => (
              <Dropdown key={index}>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  size="sm"
                  className="border-1 rounded-1"
                  style={{ fontSize: "0.875rem" }}>
                  {item.label}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item style={{ fontSize: "0.875rem" }}>
                    {item.value_1}
                  </Dropdown.Item>
                  <Dropdown.Item style={{ fontSize: "0.875rem" }}>
                    {item.value_2}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ))}

            <Button
              variant="outline-success"
              size="sm"
              className="rounded-1"
              style={{
                fontSize: "0.875rem",
                padding: "8px 16px",
                borderColor: "#006747EB",
                color: "#006747EB",
              }}>
              <i className="bi bi-download me-1"></i>
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Disputes Table */}
      <div className="table-responsive" style={{ overflowX: "auto" }}>
        {/* Desktop Table - Matching product history styling */}
        <table className="table table-hover align-middle d-none d-md-table">
          <thead
            style={{
              backgroundColor: "#f8f9fa",
              borderBottom: "2px solid #dee2e6",
            }}>
            <tr>
              <th style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                Product
              </th>
              <th
                style={{ fontSize: "0.875rem", fontWeight: "600" }}
                className="text-center">
                Resolution Method
              </th>
              <th
                style={{ fontSize: "0.875rem", fontWeight: "600" }}
                className="text-center">
                Dispute Status
              </th>
              <th
                style={{ fontSize: "0.875rem", fontWeight: "600" }}
                className="text-center">
                Date
              </th>
              <th
                style={{ fontSize: "0.875rem", fontWeight: "600" }}
                className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {getSlicedData().length > 0 ? (
              getSlicedData().map((dispute) => (
                <RecentDisputeTableData
                  key={dispute._id || dispute.id}
                  {...dispute}
                  userEmail={userEmail}
                  onViewDetails={() =>
                    handleNavigateToDispute(dispute.transaction_id)
                  }
                  onResolveDispute={() =>
                    handleResolveDispute(dispute.transaction_id)
                  }
                  onInvolveMediator={(e) =>
                    handleInvolveMediator(dispute.transaction_id, e)
                  }
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <EmptyDisputeState
                    message={customFilter.emptyMessage}
                    description={customFilter.emptyDescription}
                    showRaiseButton={showHeaderActions}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile Cards - Matching product history mobile styling */}
        <div className="d-md-none">
          {getSlicedData().length > 0 ? (
            getSlicedData().map((dispute) => (
              <DisputeMobileCard
                key={dispute._id || dispute.id}
                {...dispute}
                userEmail={userEmail}
                onViewDetails={() =>
                  handleNavigateToDispute(dispute.transaction_id)
                }
                onResolveDispute={() =>
                  handleResolveDispute(dispute.transaction_id)
                }
                onInvolveMediator={(e) =>
                  handleInvolveMediator(dispute.transaction_id, e)
                }
              />
            ))
          ) : (
            <EmptyDisputeState
              message={customFilter.emptyMessage}
              description={customFilter.emptyDescription}
              showRaiseButton={showHeaderActions}
            />
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredDisputes.length > 0 && (
        <div className="mt-4">
          <PaginationBar
            data={filteredDisputes}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            setTotalPages={setTotalPages}
          />
        </div>
      )}
    </div>
  );
};

// ========================================
// EMPTY STATE COMPONENT
// ========================================

const EmptyDisputeState = ({
  message,
  description,
  showRaiseButton = true,
}) => (
  <div className="text-center py-5">
    <div
      className="mb-4"
      style={{
        width: "120px",
        height: "120px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <i
        className="bi bi-inbox"
        style={{ fontSize: "3.5rem", color: "#006747EB" }}></i>
    </div>
    <h5 className="fw-bold mb-2" style={{ color: "#1a1a1a" }}>
      {message}
    </h5>
    <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
      {description}
    </p>
    {showRaiseButton && (
      <Link
        to="/userdashboard/disputes/initiate-dispute"
        className="text-decoration-none">
        <Button
          size="lg"
          className="border-0"
          style={{
            backgroundColor: "#006747EB",
            fontSize: "1rem",
            fontWeight: "600",
            padding: "12px 32px",
          }}>
          <i className="bi bi-flag me-2"></i>
          Raise Your First Dispute
        </Button>
      </Link>
    )}
  </div>
);

// ========================================
// DESKTOP TABLE ROW COMPONENT - MATCHING PRODUCT HISTORY STYLING
// ========================================

export const RecentDisputeTableData = (props) => {
  const {
    product_name,
    dispute_resolution_method,
    dispute_status,
    dispute_raised_by_email,
    createdAt,
    transaction_id,
    userEmail,
    onViewDetails,
    onResolveDispute,
    onInvolveMediator,
  } = props;

  const canResolve =
    userEmail === dispute_raised_by_email && dispute_status === "resolving";

  return (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
      <td className="py-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="flex-shrink-0 d-flex align-items-center justify-content-center rounded"
            style={{
              width: "55px",
              height: "55px",
              backgroundColor: "#e9ecef",
              color: "#6c757d",
            }}>
            <i className="bi bi-box-seam" style={{ fontSize: "1.2rem" }}></i>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="fw-semibold" style={{ fontSize: "0.875rem" }}>
              {product_name || "N/A"}
            </div>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              ID: {transaction_id?.slice(-8)}
            </small>
          </div>
        </div>
      </td>
      <td className="py-3 text-center">
        {getResolutionMethodBadge(dispute_resolution_method)}
      </td>
      <td className="py-3 text-center">{getStatusBadge(dispute_status)}</td>
      <td className="py-3 text-center" style={{ fontSize: "0.875rem" }}>
        {createdAt
          ? new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A"}
      </td>
      <td className="py-3 text-center">
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={onViewDetails}
            style={{
              fontSize: "0.75rem",
              padding: "6px 12px",
            }}>
            <i className="bi bi-eye me-1"></i>
            View Details
          </Button>
          {canResolve && (
            <>
              <Button
                variant="outline-success"
                size="sm"
                onClick={onResolveDispute}
                style={{
                  fontSize: "0.75rem",
                  padding: "6px 12px",
                }}>
                <i className="bi bi-check-circle me-1"></i>
                Resolve
              </Button>
              <Button
                variant="outline-warning"
                size="sm"
                onClick={onInvolveMediator}
                style={{
                  fontSize: "0.75rem",
                  padding: "6px 12px",
                }}>
                <i className="bi bi-person-plus me-1"></i>
                Mediator
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// ========================================
// MOBILE CARD COMPONENT - MATCHING PRODUCT HISTORY MOBILE STYLING
// ========================================

const DisputeMobileCard = (props) => {
  const {
    product_name,
    dispute_resolution_method,
    dispute_status,
    dispute_raised_by_email,
    createdAt,
    transaction_id,
    userEmail,
    onViewDetails,
    onResolveDispute,
    onInvolveMediator,
  } = props;

  const canResolve =
    userEmail === dispute_raised_by_email && dispute_status === "resolving";

  return (
    <div
      className="border rounded p-3 mb-3"
      style={{ backgroundColor: "#fafafa" }}>
      {/* Header Row */}
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="d-flex align-items-center gap-2">
          <div
            className="flex-shrink-0 d-flex align-items-center justify-content-center rounded"
            style={{
              width: "45px",
              height: "45px",
              backgroundColor: "#e9ecef",
              color: "#6c757d",
            }}>
            <i className="bi bi-box-seam"></i>
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              className="fw-semibold text-truncate"
              style={{ fontSize: "0.875rem" }}>
              {product_name || "N/A"}
            </div>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              ID: {transaction_id?.slice(-8)}
            </small>
          </div>
        </div>
        {getStatusBadge(dispute_status)}
      </div>

      {/* Details Row */}
      <div className="row g-2 mb-3">
        <div className="col-6">
          <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
            Method
          </small>
          <span style={{ fontSize: "0.8rem" }}>
            {getResolutionMethodBadge(dispute_resolution_method)}
          </span>
        </div>
        <div className="col-6">
          <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
            Date
          </small>
          <span style={{ fontSize: "0.8rem" }}>
            {createdAt
              ? new Date(createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Actions Row */}
      <div className="d-flex gap-2">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={onViewDetails}
          className="flex-fill"
          style={{
            fontSize: "0.75rem",
            padding: "4px 8px",
          }}>
          <i className="bi bi-eye me-1"></i>
          View Details
        </Button>
        {canResolve && (
          <>
            <Button
              variant="outline-success"
              size="sm"
              onClick={onResolveDispute}
              style={{
                fontSize: "0.75rem",
                padding: "4px 8px",
              }}>
              <i className="bi bi-check-circle me-1"></i>
              Resolve
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              onClick={onInvolveMediator}
              style={{
                fontSize: "0.75rem",
                padding: "4px 8px",
              }}>
              <i className="bi bi-person-plus me-1"></i>
              Mediator
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsDisputeHistory;
