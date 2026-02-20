import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { disputeAPISlice } from "../../../redux/slices/disputeSlices/disputeAPISlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import {
  Card,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Accordion,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import {
  useFetchDisputeByTransactionIdQuery,
  useProposeResolutionMutation,
  useRespondToResolutionMutation,
  useRequestMediatorMutation,
  useCancelDisputeMutation,
} from "../../../redux/slices/disputeSlices/disputeAPISlice";

// ========================================
// HELPER FUNCTIONS
// ========================================

const getDisputeStatusBadge = (status) => {
  const statusConfig = {
    processing: { variant: "warning", text: "Processing" },
    resolving: { variant: "info", text: "Resolving" },
    resolved: { variant: "success", text: "Resolved" },
    cancelled: { variant: "secondary", text: "Cancelled" },
    escalated_to_mediator: { variant: "danger", text: "Escalated to Mediator" },
    In_Dispute: { variant: "warning", text: "In Dispute" },
  };

  const config = statusConfig[status] || { variant: "secondary", text: status };

  return (
    <Badge
      bg={config.variant}
      className="w-100 w-sm-auto fs-6 px-2 px-sm-3 py-2"
    >
      {config.text}
    </Badge>
  );
};

const getStageBadge = (stage) => {
  const stageConfig = {
    pre_payment: { variant: "info", text: "Pre-Payment", icon: "bi-clock" },
    post_payment: {
      variant: "warning",
      text: "Post-Payment",
      icon: "bi-credit-card-fill",
    },
    post_delivery: {
      variant: "primary",
      text: "Post-Delivery",
      icon: "bi-box-seam",
    },
  };

  const config = stageConfig[stage] || {
    variant: "secondary",
    text: stage,
    icon: "bi-question-circle",
  };

  return (
    <Badge
      bg={config.variant}
      className="w-100 w-sm-auto fs-6 px-2 px-sm-3 py-2"
    >
      <i className={`${config.icon} me-1 me-sm-2`}></i>
      {config.text}
    </Badge>
  );
};

const getProposalStatusBadge = (status) => {
  const statusConfig = {
    pending: { variant: "warning", text: "Pending Response" },
    accepted: { variant: "success", text: "Accepted" },
    rejected: { variant: "danger", text: "Rejected" },
  };

  const config = statusConfig[status] || { variant: "secondary", text: status };

  return (
    <Badge bg={config.variant} className="ms-0 ms-sm-2 mt-1 mt-sm-0">
      {config.text}
    </Badge>
  );
};

// ========================================
// PROPOSAL DETECTION HELPER FUNCTIONS
// ========================================

const getPendingProposalForCurrentUser = (dispute, userEmail) => {
  if (!dispute?.resolution_proposals?.length || !userEmail) return null;

  const pendingProposals = dispute.resolution_proposals.filter(
    (proposal) => proposal.status === "pending",
  );

  if (pendingProposals.length === 0) return null;

  const latestPendingProposal = pendingProposals.reduce((latest, current) => {
    return new Date(current.proposal_date) > new Date(latest.proposal_date)
      ? current
      : latest;
  });

  const isFromOtherParty =
    latestPendingProposal.proposed_by_email.toLowerCase() !==
    userEmail.toLowerCase();

  return isFromOtherParty ? latestPendingProposal : null;
};

const getCurrentUserPendingProposal = (dispute, userEmail) => {
  if (!dispute?.resolution_proposals?.length || !userEmail) return null;

  const userPendingProposals = dispute.resolution_proposals.filter(
    (proposal) =>
      proposal.status === "pending" &&
      proposal.proposed_by_email.toLowerCase() === userEmail.toLowerCase(),
  );

  return userPendingProposals.length > 0 ? userPendingProposals[0] : null;
};

const DisputeComponents = () => {
  const { transaction_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.usersauth);

  const clearDisputeCache = () => {
    dispatch(
      disputeAPISlice.util.invalidateTags([
        "Escrow Dispute",
        { type: "Dispute Details", id: transaction_id },
      ]),
    );
  };

  useEffect(() => {
    clearDisputeCache();
  }, [transaction_id]);

  const getUserEmail = () => {
    const possibleEmails = [
      userInfo?.user?.email,
      userInfo?.email,
      userInfo?.organization_email,
      userInfo?.contact_email,
      userInfo?.userInfo?.email,
      userInfo?.userInfo?.organization_email,
    ];

    const email = possibleEmails.find(
      (e) => e && typeof e === "string" && e.trim(),
    );
    return email ? email.toLowerCase().trim() : null;
  };

  const userEmail = getUserEmail();

  const {
    data: disputeResponse,
    isLoading,
    error,
    refetch,
  } = useFetchDisputeByTransactionIdQuery(transaction_id, {
    skip: !userEmail,
  });

  const dispute = disputeResponse?.data?.dispute;

  // ✅ FIX 1: Use dispute.dispute_status as the canonical status source
  const currentDisputeStatus = dispute?.dispute_status;
  const isDisputeFinalized =
    currentDisputeStatus === "resolved" || currentDisputeStatus === "cancelled";

  const statusInfo = disputeResponse?.data?.status_info || {
    // ✅ FIX 2: Always fall back to dispute.dispute_status for the status badge
    dispute_status: currentDisputeStatus,
    is_mediator_involved:
      dispute?.dispute_status === "escalated_to_mediator" ||
      dispute?.mediator !== null,
    rejection_count: dispute?.rejection_count || 0,
    max_rejections: dispute?.max_rejections || 3,
    rejections_remaining:
      (dispute?.max_rejections || 3) - (dispute?.rejection_count || 0),
  };

  // ✅ FIX 3: Ensure statusInfo always has dispute_status
  if (!statusInfo.dispute_status) {
    statusInfo.dispute_status = currentDisputeStatus;
  }

  const backendPendingProposal =
    disputeResponse?.data?.pending_proposal_for_user;
  const backendCurrentUserProposal =
    disputeResponse?.data?.current_user_pending_proposal;

  const pendingProposalForCurrentUser =
    backendPendingProposal ||
    getPendingProposalForCurrentUser(dispute, userEmail);
  const currentUserPendingProposal =
    backendCurrentUserProposal ||
    getCurrentUserPendingProposal(dispute, userEmail);

  // ✅ FIX 4: isMediatorInvolved must be false when dispute is finalized
  const isMediatorInvolved =
    !isDisputeFinalized &&
    (statusInfo?.is_mediator_involved ||
      dispute?.dispute_status === "escalated_to_mediator" ||
      dispute?.mediator !== null ||
      false);

  const canPropose =
    !isDisputeFinalized &&
    (disputeResponse?.data?.can_propose ??
      (!pendingProposalForCurrentUser &&
        !currentUserPendingProposal &&
        !isMediatorInvolved));

  const canRespond =
    !isDisputeFinalized &&
    (disputeResponse?.data?.can_respond ??
      (!!pendingProposalForCurrentUser && !isMediatorInvolved));

  const canRequestMediator =
    !isDisputeFinalized &&
    (disputeResponse?.data?.can_request_mediator ?? true);

  const canCancelDispute =
    !isDisputeFinalized && (disputeResponse?.data?.can_cancel_dispute ?? true);

  const userRole = disputeResponse?.data?.user_role;
  const isBuyer = disputeResponse?.data?.is_buyer;
  const isSeller = disputeResponse?.data?.is_seller;

  const [proposeResolution] = useProposeResolutionMutation();
  const [respondToResolution] = useRespondToResolutionMutation();
  const [requestMediator] = useRequestMediatorMutation();
  const [cancelDispute] = useCancelDisputeMutation();

  const [showProposeModal, setShowProposeModal] = useState(false);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [showMediatorModal, setShowMediatorModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [proposalDescription, setProposalDescription] = useState("");
  const [responseDescription, setResponseDescription] = useState("");
  const [respondAction, setRespondAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========================================
  // HANDLERS
  // ========================================

  const handleProposeResolution = async () => {
    if (!proposalDescription.trim()) {
      toast.error("Please provide a resolution description");
      return;
    }

    setIsSubmitting(true);
    try {
      await proposeResolution({
        transaction_id,
        proposal_description: proposalDescription.trim(),
      }).unwrap();

      toast.success("Resolution proposed successfully! Waiting for response.");
      setShowProposeModal(false);
      setProposalDescription("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to propose resolution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRespondToResolution = async () => {
    if (!responseDescription.trim()) {
      toast.error("Please explain your decision");
      return;
    }

    if (!respondAction) {
      toast.error("Please select accept or reject");
      return;
    }

    setIsSubmitting(true);
    try {
      await respondToResolution({
        transaction_id,
        action: respondAction,
        response_description: responseDescription.trim(),
      }).unwrap();

      toast.success(
        respondAction === "accept"
          ? "Resolution accepted! Dispute resolved."
          : "Resolution rejected. You can propose a new resolution.",
      );
      setShowRespondModal(false);
      setResponseDescription("");
      setRespondAction("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to respond to resolution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestMediator = async () => {
    setIsSubmitting(true);
    try {
      await requestMediator(transaction_id).unwrap();
      toast.success(
        "Mediator requested successfully. A mediator will be assigned soon.",
      );
      setShowMediatorModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to request mediator");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelDispute = async () => {
    setIsSubmitting(true);
    try {
      await cancelDispute(transaction_id).unwrap();
      toast.success("Dispute cancelled successfully. Transaction can proceed.");
      setShowCancelModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel dispute");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // LOADING & ERROR STATES
  // ========================================

  if (isLoading) {
    return (
      <div className="container-fluid px-3 px-sm-4 px-md-5 mt-5">
        <div className="text-center py-5">
          <Spinner
            animation="border"
            style={{ color: "#006747EB", width: "3rem", height: "3rem" }}
          />
          <p className="mt-3 text-muted">Loading dispute details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-3 px-sm-4 px-md-5 mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dispute</Alert.Heading>
          <p>{error?.data?.message || "Failed to load dispute details"}</p>
          <Button
            variant="outline-danger"
            onClick={() => refetch()}
            className="w-100 w-sm-auto"
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="container-fluid px-3 px-sm-4 px-md-5 mt-5">
        <Alert variant="warning">
          <Alert.Heading>Dispute Not Found</Alert.Heading>
          <p>No dispute found for this transaction.</p>
          <Button
            variant="outline-warning"
            onClick={() => navigate(-1)}
            className="w-100 w-sm-auto"
          >
            Go Back
          </Button>
        </Alert>
      </div>
    );
  }

  const getRoleDisplayName = () => {
    if (!userRole) return "Unknown";
    return userRole.charAt(0).toUpperCase() + userRole.slice(1);
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="container-fluid px-3 px-sm-4 px-md-5 py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div className="w-100 w-sm-auto">
          <Button
            variant="link"
            className="text-decoration-none p-0 mb-2"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>Back to Transactions
          </Button>
          <h2 className="fw-bold mb-0" style={{ color: "#1a1a1a" }}>
            Dispute Details
          </h2>
        </div>
        <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 w-100 w-sm-auto">
          <div className="d-flex flex-column w-100 w-sm-auto">
            <span className="small text-muted mb-1">Dispute Status</span>
            {/* ✅ FIX 5: Fall back to dispute.dispute_status when statusInfo.dispute_status is missing */}
            {getDisputeStatusBadge(
              statusInfo.dispute_status || dispute.dispute_status,
            )}
          </div>
          <div className="d-flex flex-column w-100 w-sm-auto">
            <span className="small text-muted mb-1">Dispute Stage</span>
            {getStageBadge(dispute.dispute_stage)}
          </div>
        </div>
      </div>

      {/* ✅ FIX 6: Show Resolved banner FIRST when dispute is resolved */}
      {currentDisputeStatus === "resolved" && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading className="fs-6">
            <i className="bi bi-check-circle-fill me-2"></i>
            Dispute Resolved
          </Alert.Heading>

          {/* Resolved by mediator */}
          {dispute.mediator && dispute.resolution_summary && (
            <p className="mb-2">
              This dispute was resolved by the assigned mediator.{" "}
              {dispute.dispute_fault && (
                <>
                  Fault determined:{" "}
                  <strong className="text-capitalize">
                    {dispute.dispute_fault}
                  </strong>
                  .
                </>
              )}
            </p>
          )}

          {/* Resolved by parties */}
          {!dispute.mediator && (
            <p className="mb-2">
              This dispute was resolved by mutual agreement between the parties.
            </p>
          )}

          {/* Resolution description */}
          {dispute.resolution_description && (
            <div className="mt-2 p-2 bg-white bg-opacity-50 rounded border">
              <small className="text-muted d-block mb-1 fw-semibold">
                Resolution Details
              </small>
              <span>{dispute.resolution_description}</span>
            </div>
          )}

          {/* Resolved at */}
          {dispute.resolved_at && (
            <p className="mt-2 mb-0 small text-muted">
              <i className="bi bi-clock me-1"></i>
              Resolved on:{" "}
              {new Date(dispute.resolved_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </Alert>
      )}

      {/* ✅ FIX 7: Only show "Escalated to Mediator" alert when NOT resolved/cancelled */}
      {isMediatorInvolved && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading className="fs-6">
            <i className="bi bi-shield-check me-2"></i>
            Dispute Escalated to Mediator
          </Alert.Heading>
          <p className="mb-2">
            {isBuyer ? (
              <>
                As the <strong>buyer</strong>, this dispute has been escalated
                to a mediator. Please wait for the mediator's response and
                instructions.
              </>
            ) : (
              <>
                As the <strong>seller</strong>, this dispute has been escalated
                to a mediator. Please wait for the mediator's response and
                instructions.
              </>
            )}
            {dispute.mediator_requested_by && (
              <span className="d-block d-sm-inline mt-1 mt-sm-0 ms-0 ms-sm-1">
                Requested by: <strong>{dispute.mediator_requested_by}</strong>
              </span>
            )}
          </p>
          {dispute.mediator && (
            <div className="mt-2">
              <span className="font-bold">
                Assigned Mediator:{" "}
                {`${dispute.mediator.first_name || ""} ${dispute.mediator.last_name || ""}`.trim()}
                {dispute.mediator.mediator_email &&
                  ` (${dispute.mediator.mediator_email})`}
              </span>
            </div>
          )}
        </Alert>
      )}

      {/* Alert for Pending Action */}
      {canRespond && pendingProposalForCurrentUser && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading className="fs-6">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Action Required ({getRoleDisplayName()})
          </Alert.Heading>
          <p className="mb-2">
            {isBuyer ? (
              <>
                The <strong>seller</strong> has proposed a resolution. As the
                buyer, please review and respond.
              </>
            ) : (
              <>
                The <strong>buyer</strong> has proposed a resolution. As the
                seller, please review and respond.
              </>
            )}
          </p>
          <Button
            variant="warning"
            size="sm"
            onClick={() => setShowRespondModal(true)}
            className="w-100 w-sm-auto"
          >
            <i className="bi bi-eye me-2"></i>Review Proposal
          </Button>
        </Alert>
      )}

      {/* Alert for Current User's Pending Proposal */}
      {currentUserPendingProposal && !pendingProposalForCurrentUser && (
        <Alert variant="info" className="mb-4">
          <Alert.Heading className="fs-6">
            <i className="bi bi-clock me-2"></i>
            Waiting for Response ({getRoleDisplayName()})
          </Alert.Heading>
          <p className="mb-0">
            {isBuyer ? (
              <>
                Your resolution proposal is pending. Waiting for the{" "}
                <strong>seller</strong> to respond.
              </>
            ) : (
              <>
                Your resolution proposal is pending. Waiting for the{" "}
                <strong>buyer</strong> to respond.
              </>
            )}
          </p>
        </Alert>
      )}

      {/* Main Content */}
      <div className="row g-4">
        {/* Left Column - Dispute Info */}
        <div className="col-12 col-lg-8">
          {/* Dispute Overview */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 fw-bold" style={{ color: "#006747EB" }}>
                <i className="bi bi-flag me-2"></i>Dispute Overview
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <small className="text-muted d-block">Transaction ID</small>
                  <code className="d-block text-break">
                    {dispute.transaction_id}
                  </code>
                </div>
                <div className="col-12 col-md-6">
                  <small className="text-muted d-block">Product</small>
                  <strong>{dispute.product_name}</strong>
                </div>
                <div className="col-12 col-md-6">
                  <small className="text-muted d-block">Raised By</small>
                  <Badge
                    bg={
                      dispute.dispute_raised_by === "buyer" ? "primary" : "info"
                    }
                    className="d-inline-block"
                  >
                    {dispute.dispute_raised_by === "buyer" ? "Buyer" : "Seller"}
                    {dispute.dispute_raised_by === userRole && " (You)"}
                  </Badge>
                </div>
                <div className="col-12 col-md-6">
                  <small className="text-muted d-block">Date Raised</small>
                  <span>
                    {new Date(dispute.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="col-12">
                  <small className="text-muted d-block mb-1">
                    Reason for Dispute
                  </small>
                  <strong className="d-block text-break">
                    {dispute.reason_for_dispute}
                  </strong>
                </div>
                <div className="col-12">
                  <small className="text-muted d-block mb-1">Description</small>
                  <p className="mb-0 text-break">
                    {dispute.dispute_description}
                  </p>
                </div>

                {/* ✅ FIX 8: Show fault and resolution summary inside overview when resolved */}
                {currentDisputeStatus === "resolved" &&
                  dispute.dispute_fault && (
                    <div className="col-12 col-md-6">
                      <small className="text-muted d-block mb-1">
                        Determined Fault
                      </small>
                      <Badge
                        bg={
                          dispute.dispute_fault === "seller"
                            ? "danger"
                            : "warning"
                        }
                        className="text-capitalize"
                      >
                        {dispute.dispute_fault}
                      </Badge>
                    </div>
                  )}

                {currentDisputeStatus === "resolved" &&
                  dispute.resolution_summary && (
                    <div className="col-12">
                      <small className="text-muted d-block mb-1">
                        Resolution Summary
                      </small>
                      <p className="mb-0 text-muted fst-italic text-break">
                        {dispute.resolution_summary}
                      </p>
                    </div>
                  )}
              </div>
            </Card.Body>
          </Card>

          {/* Resolution History */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 fw-bold" style={{ color: "#006747EB" }}>
                <i className="bi bi-clock-history me-2"></i>Resolution History
                <Badge bg="secondary" className="ms-2">
                  {dispute.resolution_proposals?.length || 0}
                </Badge>
              </h5>
            </Card.Header>
            <Card.Body>
              {!dispute.resolution_proposals ||
              dispute.resolution_proposals.length === 0 ? (
                <div className="text-center py-4">
                  <i
                    className="bi bi-inbox text-muted"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <p className="text-muted mt-2">
                    {currentDisputeStatus === "resolved"
                      ? "This dispute was resolved by the mediator without resolution proposals."
                      : "No resolution proposals yet"}
                  </p>
                  {canPropose && !isDisputeFinalized && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => setShowProposeModal(true)}
                      className="w-100 w-sm-auto"
                    >
                      Be the first to propose a resolution
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <Accordion defaultActiveKey="0">
                    {dispute.resolution_proposals.map((proposal, index) => {
                      const isUserProposal =
                        proposal.proposed_by_email.toLowerCase() ===
                        userEmail?.toLowerCase();

                      return (
                        <Accordion.Item
                          eventKey={String(index)}
                          key={proposal._id || index}
                        >
                          <Accordion.Header>
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center w-100">
                              <span className="fw-semibold mb-1 mb-sm-0">
                                Proposal #{index + 1} -{" "}
                                {proposal.proposed_by === "buyer"
                                  ? "Buyer"
                                  : "Seller"}
                                {isUserProposal && (
                                  <Badge
                                    bg="success"
                                    className="ms-0 ms-sm-2 mt-1 mt-sm-0 d-inline-block"
                                  >
                                    Your Proposal
                                  </Badge>
                                )}
                              </span>
                              {getProposalStatusBadge(proposal.status)}
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="mb-3">
                              <small className="text-muted d-block">
                                Proposed By
                              </small>
                              <strong className="text-break">
                                {proposal.proposed_by_email}
                              </strong>
                              {isUserProposal && (
                                <Badge
                                  bg="primary"
                                  className="ms-2 d-inline-block"
                                >
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="mb-3">
                              <small className="text-muted d-block">
                                Proposal Date
                              </small>
                              <span>
                                {new Date(
                                  proposal.proposal_date,
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="mb-3">
                              <small className="text-muted d-block">
                                Proposal Description
                              </small>
                              <p className="mb-0 border rounded p-2 bg-light text-break">
                                {proposal.proposal_description}
                              </p>
                            </div>
                            {proposal.status !== "pending" &&
                              proposal.responded_by && (
                                <>
                                  <hr />
                                  <div className="mb-3">
                                    <small className="text-muted d-block">
                                      Response By
                                    </small>
                                    <strong className="text-break">
                                      {proposal.responded_by}
                                    </strong>
                                    {proposal.responded_by.toLowerCase() ===
                                      userEmail?.toLowerCase() && (
                                      <Badge
                                        bg="info"
                                        className="ms-2 d-inline-block"
                                      >
                                        You
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="mb-3">
                                    <small className="text-muted d-block">
                                      Response Date
                                    </small>
                                    <span>
                                      {new Date(
                                        proposal.response_date,
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                  {proposal.response_description && (
                                    <div className="mb-3">
                                      <small className="text-muted d-block">
                                        Response
                                      </small>
                                      <p className="mb-0 border rounded p-2 bg-light text-break">
                                        {proposal.response_description}
                                      </p>
                                    </div>
                                  )}
                                </>
                              )}
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>

                  {statusInfo?.rejection_count > 0 && !isDisputeFinalized && (
                    <Alert variant="warning" className="mt-3 mb-0">
                      <small className="d-block text-break">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        <strong>{statusInfo.rejection_count}</strong> of{" "}
                        <strong>{statusInfo.max_rejections}</strong> rejections
                        used.
                        {statusInfo.rejection_count >= statusInfo.max_rejections
                          ? " Dispute has been auto-escalated to mediator."
                          : ` ${statusInfo.rejections_remaining} remaining before auto-escalation.`}
                      </small>
                    </Alert>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Right Column - Actions & Info */}
        <div className="col-12 col-lg-4">
          {/* Action Buttons */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">Actions ({getRoleDisplayName()})</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {/* ✅ FIX 9: All action buttons are naturally hidden when isDisputeFinalized,
                    because canPropose/canRespond/canRequestMediator/canCancelDispute are all false */}

                {canPropose && !isMediatorInvolved && (
                  <Button
                    variant="success"
                    onClick={() => setShowProposeModal(true)}
                    className="w-100"
                  >
                    <i className="bi bi-lightbulb me-2"></i>
                    Propose Resolution
                  </Button>
                )}

                {canRespond &&
                  pendingProposalForCurrentUser &&
                  !isMediatorInvolved && (
                    <Button
                      variant="warning"
                      onClick={() => setShowRespondModal(true)}
                      className="w-100"
                    >
                      <i className="bi bi-reply me-2"></i>Respond to Proposal
                    </Button>
                  )}

                {canRequestMediator && !isMediatorInvolved && (
                  <Button
                    variant="danger"
                    onClick={() => setShowMediatorModal(true)}
                    className="w-100"
                  >
                    <i className="bi bi-person-badge me-2"></i>Request Mediator
                  </Button>
                )}

                {canCancelDispute && !isMediatorInvolved && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowCancelModal(true)}
                    className="w-100"
                  >
                    <i className="bi bi-x-circle me-2"></i>Cancel Dispute
                  </Button>
                )}

                {/* ✅ FIX 10: Show clean "Resolved" state in actions panel */}
                {isDisputeFinalized && (
                  <Alert
                    variant={
                      currentDisputeStatus === "resolved"
                        ? "success"
                        : "secondary"
                    }
                    className="mb-0 p-2"
                  >
                    <small className="d-block">
                      <i
                        className={`bi ${
                          currentDisputeStatus === "resolved"
                            ? "bi-check-circle-fill"
                            : "bi-x-circle"
                        } me-1`}
                      ></i>
                      This dispute has been{" "}
                      <strong>{currentDisputeStatus}</strong>. No further
                      actions are available.
                    </small>
                  </Alert>
                )}

                {!canPropose &&
                  !canRespond &&
                  !isMediatorInvolved &&
                  !isDisputeFinalized && (
                    <Alert variant="info" className="mb-0 p-2">
                      <small className="d-block text-break">
                        {currentUserPendingProposal ? (
                          <>
                            <i className="bi bi-clock me-1"></i>Waiting for
                            other party's response
                          </>
                        ) : pendingProposalForCurrentUser ? (
                          <>
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            Please respond to pending proposal first
                          </>
                        ) : (
                          <>
                            <i className="bi bi-info-circle me-1"></i>No actions
                            available at this time
                          </>
                        )}
                      </small>
                    </Alert>
                  )}

                {isMediatorInvolved && (
                  <Alert variant="info" className="mb-0 p-2">
                    <small className="d-block">
                      <i className="bi bi-info-circle me-1"></i>
                      Mediator is handling this dispute. Actions are restricted.
                    </small>
                  </Alert>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Parties Info */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">Parties Involved</h6>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                  <div className="w-100">
                    <small className="text-muted d-block">Buyer</small>
                    <strong className="text-break">
                      {dispute.buyer_email}
                    </strong>
                    {isBuyer && (
                      <Badge
                        bg="primary"
                        className="ms-0 ms-sm-2 mt-1 mt-sm-0 d-inline-block"
                      >
                        You
                      </Badge>
                    )}
                    {/* ✅ FIX 11: Show fault badge next to responsible party */}
                    {currentDisputeStatus === "resolved" &&
                      dispute.dispute_fault === "buyer" && (
                        <Badge bg="danger" className="ms-2 d-inline-block">
                          At Fault
                        </Badge>
                      )}
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                  <div className="w-100">
                    <small className="text-muted d-block">Seller</small>
                    <strong className="text-break">
                      {dispute.vendor_name}
                    </strong>
                    <br />
                    <small className="text-muted text-break">
                      {dispute.vendor_email}
                    </small>
                    {isSeller && (
                      <Badge
                        bg="info"
                        className="ms-0 ms-sm-2 mt-1 mt-sm-0 d-inline-block"
                      >
                        You
                      </Badge>
                    )}
                    {currentDisputeStatus === "resolved" &&
                      dispute.dispute_fault === "seller" && (
                        <Badge bg="danger" className="ms-2 d-inline-block">
                          At Fault
                        </Badge>
                      )}
                  </div>
                </div>
              </ListGroup.Item>
              {/* ✅ FIX 12: Show mediator in Parties even when resolved (informational) */}
              {dispute.mediator && (
                <ListGroup.Item>
                  <div>
                    <small className="text-muted d-block">Mediator</small>
                    <strong className="text-break">
                      {`${dispute.mediator.first_name || ""} ${dispute.mediator.last_name || ""}`.trim() ||
                        dispute.mediator.mediator_email}
                    </strong>
                    <Badge
                      bg={isDisputeFinalized ? "secondary" : "danger"}
                      className="ms-2 d-inline-block"
                    >
                      {isDisputeFinalized ? "Resolved" : "Active"}
                    </Badge>
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>

          {/* Transaction State */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">Transaction State</h6>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <small className="text-muted">Payment Status</small>
                <br />
                <Badge
                  bg={
                    dispute.transaction_state_snapshot?.verified_payment_status
                      ? "success"
                      : "warning"
                  }
                  className="d-inline-block mt-1"
                >
                  {dispute.transaction_state_snapshot?.verified_payment_status
                    ? "Paid"
                    : "Not Paid"}
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item>
                <small className="text-muted">Shipping Status</small>
                <br />
                <Badge
                  bg={
                    dispute.transaction_state_snapshot?.shipping_submitted
                      ? "success"
                      : "warning"
                  }
                  className="d-inline-block mt-1"
                >
                  {dispute.transaction_state_snapshot?.shipping_submitted
                    ? "Shipped"
                    : "Not Shipped"}
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item>
                <small className="text-muted">Delivery Confirmation</small>
                <br />
                <Badge
                  bg={
                    dispute.transaction_state_snapshot?.buyer_confirm_status
                      ? "success"
                      : "warning"
                  }
                  className="d-inline-block mt-1"
                >
                  {dispute.transaction_state_snapshot?.buyer_confirm_status
                    ? "Confirmed"
                    : "Pending"}
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </div>
      </div>

      {/* ========================================
            MODALS
        ======================================== */}

      {/* Propose Resolution Modal */}
      <Modal
        show={showProposeModal}
        onHide={() => setShowProposeModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Propose Resolution</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Resolution Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                placeholder="Describe your proposed resolution in detail..."
              />
              <Form.Text className="text-muted">
                Explain clearly how you propose to resolve this dispute.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowProposeModal(false)}
            className="w-50 w-sm-auto"
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleProposeResolution}
            disabled={isSubmitting || !proposalDescription.trim()}
            className="w-50 w-sm-auto"
          >
            {isSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit Proposal"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Respond to Resolution Modal */}
      <Modal
        show={showRespondModal}
        onHide={() => setShowRespondModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Respond to Proposal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingProposalForCurrentUser && (
            <>
              <Alert variant="info">
                <strong>
                  Proposal from {pendingProposalForCurrentUser.proposed_by}:
                </strong>
                <p className="mb-0 mt-2 text-break">
                  {pendingProposalForCurrentUser.proposal_description}
                </p>
              </Alert>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Your Decision *</Form.Label>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <Button
                      variant={
                        respondAction === "accept"
                          ? "success"
                          : "outline-success"
                      }
                      onClick={() => setRespondAction("accept")}
                      className="w-100 w-sm-50"
                    >
                      <i className="bi bi-check-circle me-2"></i>Accept
                      Resolution
                    </Button>
                    <Button
                      variant={
                        respondAction === "reject" ? "danger" : "outline-danger"
                      }
                      onClick={() => setRespondAction("reject")}
                      className="w-100 w-sm-50"
                    >
                      <i className="bi bi-x-circle me-2"></i>Reject Resolution
                    </Button>
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Explain Your Decision *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={responseDescription}
                    onChange={(e) => setResponseDescription(e.target.value)}
                    placeholder={
                      respondAction === "accept"
                        ? "Explain why you're accepting this proposal..."
                        : "Explain why you're rejecting this proposal..."
                    }
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRespondModal(false)}
            className="w-50 w-sm-auto"
          >
            Cancel
          </Button>
          <Button
            variant={respondAction === "accept" ? "success" : "danger"}
            onClick={handleRespondToResolution}
            disabled={
              isSubmitting || !respondAction || !responseDescription.trim()
            }
            className="w-50 w-sm-auto"
          >
            {isSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit Response"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Request Mediator Modal */}
      <Modal
        show={showMediatorModal}
        onHide={() => setShowMediatorModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <Alert.Heading className="fs-6">Are you sure?</Alert.Heading>
            <p>
              Requesting a mediator will escalate this dispute to a neutral
              third party. Both parties will need to work with the mediator to
              resolve the issue.
            </p>
            <p className="mb-0">
              <strong>Note:</strong> Once a mediator is involved, you won't be
              able to propose resolutions or cancel the dispute directly.
            </p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowMediatorModal(false)}
            className="w-50 w-sm-auto"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleRequestMediator}
            disabled={isSubmitting}
            className="w-50 w-sm-auto"
          >
            {isSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Confirm Request"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cancel Dispute Modal */}
      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Dispute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <Alert.Heading className="fs-6">Cancel This Dispute?</Alert.Heading>
            <p>
              Cancelling will close the dispute and allow the transaction to
              proceed normally. This action cannot be undone.
            </p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCancelModal(false)}
            className="w-50 w-sm-auto"
          >
            No, Keep Dispute
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelDispute}
            disabled={isSubmitting}
            className="w-50 w-sm-auto"
          >
            {isSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Yes, Cancel Dispute"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const DisputeDetailsPage = () => {
  return (
    <div className="w-100 min-vh-100" style={{ backgroundColor: "#F9F9FB" }}>
      <UserDashboardNavbar />
      <DisputeComponents />
    </div>
  );
};

export default DisputeDetailsPage;
