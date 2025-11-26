// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
// import {
//   Card,
//   Badge,
//   Button,
//   Modal,
//   Form,
//   Alert,
//   Accordion,
//   ListGroup,
//   Spinner,
// } from "react-bootstrap";
// import {
//   useFetchDisputeByTransactionIdQuery,
//   useProposeResolutionMutation,
//   useRespondToResolutionMutation,
//   useRequestMediatorMutation,
//   useCancelDisputeMutation,
// } from "../../../redux/slices/disputeSlices/disputeAPISlice";

// // ========================================
// // HELPER FUNCTIONS
// // ========================================

// const getDisputeStatusBadge = (status) => {
//   const statusConfig = {
//     processing: { variant: "warning", text: "Processing" },
//     resolving: { variant: "info", text: "Resolving" },
//     resolved: { variant: "success", text: "Resolved" },
//     cancelled: { variant: "secondary", text: "Cancelled" },
//     escalated_to_mediator: { variant: "danger", text: "Escalated to Mediator" },
//   };

//   const config = statusConfig[status] || { variant: "secondary", text: status };

//   return (
//     <Badge bg={config.variant} className="fs-6 px-3 py-2">
//       {config.text}
//     </Badge>
//   );
// };

// const getStageBadge = (stage) => {
//   const stageConfig = {
//     pre_payment: { variant: "info", text: "Pre-Payment", icon: "bi-clock" },
//     post_payment: {
//       variant: "warning",
//       text: "Post-Payment",
//       icon: "bi-credit-card-fill",
//     },
//     post_delivery: {
//       variant: "primary",
//       text: "Post-Delivery",
//       icon: "bi-box-seam",
//     },
//   };

//   const config = stageConfig[stage] || {
//     variant: "secondary",
//     text: stage,
//     icon: "bi-question-circle",
//   };

//   return (
//     <Badge bg={config.variant} className="fs-6 px-3 py-2">
//       <i className={`${config.icon} me-2`}></i>
//       {config.text}
//     </Badge>
//   );
// };

// const getProposalStatusBadge = (status) => {
//   const statusConfig = {
//     pending: { variant: "warning", text: "Pending Response" },
//     accepted: { variant: "success", text: "Accepted" },
//     rejected: { variant: "danger", text: "Rejected" },
//   };

//   const config = statusConfig[status] || { variant: "secondary", text: status };

//   return <Badge bg={config.variant}>{config.text}</Badge>;
// };

// // ========================================
// // MAIN COMPONENT
// // ========================================

// const DisputeComponents = () => {
//   const { transaction_id } = useParams();
//   const navigate = useNavigate();
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const userEmail =
//     userInfo?.user?.email ||
//     userInfo?.email ||
//     userInfo?.organization_email ||
//     userInfo?.userInfo?.email; // Additional fallback

//   // Debug logging
//   console.log("🔍 DisputeDetailsPage Debug:");
//   console.log("Transaction ID:", transaction_id);
//   console.log("Full userInfo:", userInfo);
//   console.log("Extracted userEmail:", userEmail);
//   console.log("Token exists:", !!userInfo?.token);

//   const {
//     data: disputeData,
//     isLoading,
//     error,
//     refetch,
//   } = useFetchDisputeByTransactionIdQuery(transaction_id, {
//     // Add skip condition if no user is authenticated
//     skip: !userEmail || !userInfo?.token,
//   });

//   console.log("📊 Query State:", {
//     isLoading,
//     error: error?.data || error,
//     hasData: !!disputeData,
//   });

//   const [proposeResolution] = useProposeResolutionMutation();
//   const [respondToResolution] = useRespondToResolutionMutation();
//   const [requestMediator] = useRequestMediatorMutation();
//   const [cancelDispute] = useCancelDisputeMutation();

//   // State
//   const [showProposeModal, setShowProposeModal] = useState(false);
//   const [showRespondModal, setShowRespondModal] = useState(false);
//   const [showMediatorModal, setShowMediatorModal] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [proposalDescription, setProposalDescription] = useState("");
//   const [responseDescription, setResponseDescription] = useState("");
//   const [respondAction, setRespondAction] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const dispute = disputeData?.data?.dispute;
//   const canPropose = disputeData?.data?.can_propose;
//   const canRespond = disputeData?.data?.can_respond;
//   const canRequestMediator = disputeData?.data?.can_request_mediator;

//   // User role
//   const isBuyer = userEmail === dispute?.buyer_email;
//   const isSeller = userEmail === dispute?.vendor_email;

//   // ========================================
//   // HANDLERS
//   // ========================================

//   const handleProposeResolution = async () => {
//     if (!proposalDescription.trim()) {
//       toast.error("Please provide a resolution description");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await proposeResolution({
//         transaction_id,
//         proposal_description: proposalDescription.trim(),
//       }).unwrap();

//       toast.success("Resolution proposed successfully! Waiting for response.");
//       setShowProposeModal(false);
//       setProposalDescription("");
//       refetch();
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to propose resolution");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleRespondToResolution = async () => {
//     if (!responseDescription.trim()) {
//       toast.error("Please explain your decision");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await respondToResolution({
//         transaction_id,
//         action: respondAction,
//         response_description: responseDescription.trim(),
//       }).unwrap();

//       toast.success(
//         respondAction === "accept"
//           ? "Resolution accepted! Dispute resolved."
//           : "Resolution rejected. You can propose a new resolution."
//       );
//       setShowRespondModal(false);
//       setResponseDescription("");
//       setRespondAction("");
//       refetch();
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to respond to resolution");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleRequestMediator = async () => {
//     setIsSubmitting(true);
//     try {
//       await requestMediator(transaction_id).unwrap();
//       toast.success(
//         "Mediator requested successfully. A mediator will be assigned soon."
//       );
//       setShowMediatorModal(false);
//       refetch();
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to request mediator");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancelDispute = async () => {
//     setIsSubmitting(true);
//     try {
//       await cancelDispute(transaction_id).unwrap();
//       toast.success("Dispute cancelled successfully. Transaction can proceed.");
//       setShowCancelModal(false);
//       refetch();
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to cancel dispute");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ========================================
//   // LOADING & ERROR STATES
//   // ========================================

//   if (isLoading) {
//     return (
//       <div className="container mt-5">
//         <div className="text-center py-5">
//           <Spinner
//             animation="border"
//             style={{ color: "#006747EB", width: "3rem", height: "3rem" }}
//           />
//           <p className="mt-3 text-muted">Loading dispute details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mt-5">
//         <Alert variant="danger">
//           <Alert.Heading>Error Loading Dispute</Alert.Heading>
//           <p>{error?.data?.message || "Failed to load dispute details"}</p>
//           <Button variant="outline-danger" onClick={() => refetch()}>
//             Retry
//           </Button>
//         </Alert>
//       </div>
//     );
//   }

//   if (!dispute) {
//     return (
//       <div className="container mt-5">
//         <Alert variant="warning">
//           <Alert.Heading>Dispute Not Found</Alert.Heading>
//           <p>No dispute found for this transaction.</p>
//           <Button variant="outline-warning" onClick={() => navigate(-1)}>
//             Go Back
//           </Button>
//         </Alert>
//       </div>
//     );
//   }

//   const pendingProposal = dispute.resolution_proposals?.find(
//     (p) => p.status === "pending"
//   );

//   // ========================================
//   // RENDER
//   // ========================================

//   return (
//     <div className="container mt-4 mb-5" style={{ maxWidth: "1200px" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <Button
//             variant="link"
//             className="text-decoration-none p-0 mb-2"
//             onClick={() => navigate(-1)}>
//             <i className="bi bi-arrow-left me-2"></i>Back to Transactions
//           </Button>
//           <h2 className="fw-bold mb-0" style={{ color: "#1a1a1a" }}>
//             Dispute Details
//           </h2>
//         </div>
//         <div className="d-flex gap-2 align-items-center">
//           {getDisputeStatusBadge(dispute.dispute_status)}
//           {getStageBadge(dispute.dispute_stage)}
//         </div>
//       </div>

//       {/* Alert for Pending Action */}
//       {canRespond && pendingProposal && (
//         <Alert variant="warning" className="mb-4">
//           <Alert.Heading className="fs-6">
//             <i className="bi bi-exclamation-triangle me-2"></i>
//             Action Required
//           </Alert.Heading>
//           <p className="mb-2">
//             {pendingProposal.proposed_by === "buyer"
//               ? "The buyer"
//               : "The seller"}{" "}
//             has proposed a resolution. Please review and respond.
//           </p>
//           <Button
//             variant="warning"
//             size="sm"
//             onClick={() => {
//               setShowRespondModal(true);
//               setRespondAction("accept");
//             }}>
//             Review Proposal
//           </Button>
//         </Alert>
//       )}

//       {/* Main Content */}
//       <div className="row g-4">
//         {/* Left Column - Dispute Info */}
//         <div className="col-lg-8">
//           {/* Dispute Overview */}
//           <Card className="mb-4 shadow-sm">
//             <Card.Header className="bg-light">
//               <h5 className="mb-0 fw-bold" style={{ color: "#006747EB" }}>
//                 <i className="bi bi-flag me-2"></i>Dispute Overview
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <small className="text-muted d-block">Transaction ID</small>
//                   <code className="d-block">{dispute.transaction_id}</code>
//                 </div>
//                 <div className="col-md-6">
//                   <small className="text-muted d-block">Product</small>
//                   <strong>{dispute.product_name}</strong>
//                 </div>
//                 <div className="col-md-6">
//                   <small className="text-muted d-block">Raised By</small>
//                   <Badge
//                     bg={
//                       dispute.dispute_raised_by === "buyer" ? "primary" : "info"
//                     }>
//                     {dispute.dispute_raised_by === "buyer" ? "Buyer" : "Seller"}
//                   </Badge>
//                 </div>
//                 <div className="col-md-6">
//                   <small className="text-muted d-block">Date Raised</small>
//                   <span>
//                     {new Date(dispute.createdAt).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </span>
//                 </div>
//                 <div className="col-12">
//                   <small className="text-muted d-block mb-1">
//                     Reason for Dispute
//                   </small>
//                   <strong>{dispute.reason_for_dispute}</strong>
//                 </div>
//                 <div className="col-12">
//                   <small className="text-muted d-block mb-1">Description</small>
//                   <p className="mb-0">{dispute.dispute_description}</p>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>

//           {/* Resolution History */}
//           <Card className="mb-4 shadow-sm">
//             <Card.Header className="bg-light">
//               <h5 className="mb-0 fw-bold" style={{ color: "#006747EB" }}>
//                 <i className="bi bi-clock-history me-2"></i>Resolution History
//                 <Badge bg="secondary" className="ms-2">
//                   {dispute.resolution_proposals?.length || 0}
//                 </Badge>
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               {!dispute.resolution_proposals ||
//               dispute.resolution_proposals.length === 0 ? (
//                 <div className="text-center py-4">
//                   <i
//                     className="bi bi-inbox text-muted"
//                     style={{ fontSize: "3rem" }}></i>
//                   <p className="text-muted mt-2">No resolution proposals yet</p>
//                 </div>
//               ) : (
//                 <Accordion defaultActiveKey="0">
//                   {dispute.resolution_proposals.map((proposal, index) => (
//                     <Accordion.Item eventKey={String(index)} key={index}>
//                       <Accordion.Header>
//                         <div className="d-flex justify-content-between align-items-center w-100 me-3">
//                           <span className="fw-semibold">
//                             Proposal #{index + 1} -{" "}
//                             {proposal.proposed_by === "buyer"
//                               ? "Buyer"
//                               : "Seller"}
//                           </span>
//                           {getProposalStatusBadge(proposal.status)}
//                         </div>
//                       </Accordion.Header>
//                       <Accordion.Body>
//                         <div className="mb-3">
//                           <small className="text-muted d-block">
//                             Proposed By
//                           </small>
//                           <strong>{proposal.proposed_by_email}</strong>
//                         </div>
//                         <div className="mb-3">
//                           <small className="text-muted d-block">
//                             Proposal Date
//                           </small>
//                           <span>
//                             {new Date(proposal.proposal_date).toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="mb-3">
//                           <small className="text-muted d-block">
//                             Proposal Description
//                           </small>
//                           <p className="mb-0 border rounded p-2 bg-light">
//                             {proposal.proposal_description}
//                           </p>
//                         </div>
//                         {proposal.status !== "pending" && (
//                           <>
//                             <hr />
//                             <div className="mb-3">
//                               <small className="text-muted d-block">
//                                 Response By
//                               </small>
//                               <strong>{proposal.responded_by}</strong>
//                             </div>
//                             <div className="mb-3">
//                               <small className="text-muted d-block">
//                                 Response Date
//                               </small>
//                               <span>
//                                 {new Date(
//                                   proposal.response_date
//                                 ).toLocaleString()}
//                               </span>
//                             </div>
//                             {proposal.response_description && (
//                               <div className="mb-3">
//                                 <small className="text-muted d-block">
//                                   Response
//                                 </small>
//                                 <p className="mb-0 border rounded p-2 bg-light">
//                                   {proposal.response_description}
//                                 </p>
//                               </div>
//                             )}
//                           </>
//                         )}
//                       </Accordion.Body>
//                     </Accordion.Item>
//                   ))}
//                 </Accordion>
//               )}

//               {/* Rejection Counter */}
//               {dispute.rejection_count > 0 &&
//                 dispute.dispute_status !== "resolved" && (
//                   <Alert variant="warning" className="mt-3 mb-0">
//                     <small>
//                       <i className="bi bi-exclamation-circle me-2"></i>
//                       <strong>{dispute.rejection_count}</strong> of{" "}
//                       <strong>{dispute.max_rejections}</strong> rejections used.
//                       {dispute.rejection_count >= dispute.max_rejections
//                         ? " Dispute has been auto-escalated to mediator."
//                         : ` ${
//                             dispute.max_rejections - dispute.rejection_count
//                           } remaining before auto-escalation.`}
//                     </small>
//                   </Alert>
//                 )}
//             </Card.Body>
//           </Card>
//         </div>

//         {/* Right Column - Actions & Info */}
//         <div className="col-lg-4">
//           {/* Action Buttons */}
//           <Card className="mb-4 shadow-sm">
//             <Card.Header className="bg-light">
//               <h6 className="mb-0 fw-bold">Actions</h6>
//             </Card.Header>
//             <Card.Body>
//               <div className="d-grid gap-2">
//                 {canPropose && (
//                   <Button
//                     variant="success"
//                     onClick={() => setShowProposeModal(true)}
//                     disabled={
//                       dispute.dispute_status === "resolved" ||
//                       dispute.dispute_status === "cancelled"
//                     }>
//                     <i className="bi bi-lightbulb me-2"></i>Propose Resolution
//                   </Button>
//                 )}

//                 {canRespond && pendingProposal && (
//                   <Button
//                     variant="warning"
//                     onClick={() => {
//                       setShowRespondModal(true);
//                       setRespondAction("accept");
//                     }}>
//                     <i className="bi bi-reply me-2"></i>Respond to Proposal
//                   </Button>
//                 )}

//                 {canRequestMediator && (
//                   <Button
//                     variant="danger"
//                     onClick={() => setShowMediatorModal(true)}>
//                     <i className="bi bi-person-badge me-2"></i>Request Mediator
//                   </Button>
//                 )}

//                 {dispute.dispute_status !== "resolved" &&
//                   dispute.dispute_status !== "cancelled" && (
//                     <Button
//                       variant="outline-secondary"
//                       onClick={() => setShowCancelModal(true)}>
//                       <i className="bi bi-x-circle me-2"></i>Cancel Dispute
//                     </Button>
//                   )}
//               </div>
//             </Card.Body>
//           </Card>

//           {/* Parties Info */}
//           <Card className="mb-4 shadow-sm">
//             <Card.Header className="bg-light">
//               <h6 className="mb-0 fw-bold">Parties Involved</h6>
//             </Card.Header>
//             <ListGroup variant="flush">
//               <ListGroup.Item>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <small className="text-muted d-block">Buyer</small>
//                     <strong>{dispute.buyer_email}</strong>
//                     {isBuyer && (
//                       <Badge bg="primary" className="ms-2">
//                         You
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <small className="text-muted d-block">Seller</small>
//                     <strong>{dispute.vendor_name}</strong>
//                     <br />
//                     <small>{dispute.vendor_email}</small>
//                     {isSeller && (
//                       <Badge bg="info" className="ms-2">
//                         You
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </ListGroup.Item>
//               {dispute.mediator && (
//                 <ListGroup.Item>
//                   <div>
//                     <small className="text-muted d-block">Mediator</small>
//                     <strong>Assigned</strong>
//                     <Badge bg="danger" className="ms-2">
//                       Active
//                     </Badge>
//                   </div>
//                 </ListGroup.Item>
//               )}
//             </ListGroup>
//           </Card>

//           {/* Transaction State */}
//           <Card className="shadow-sm">
//             <Card.Header className="bg-light">
//               <h6 className="mb-0 fw-bold">Transaction State</h6>
//             </Card.Header>
//             <ListGroup variant="flush">
//               <ListGroup.Item>
//                 <small className="text-muted">Payment Status</small>
//                 <br />
//                 <Badge
//                   bg={
//                     dispute.transaction_state_snapshot?.verified_payment_status
//                       ? "success"
//                       : "warning"
//                   }>
//                   {dispute.transaction_state_snapshot?.verified_payment_status
//                     ? "Paid"
//                     : "Not Paid"}
//                 </Badge>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <small className="text-muted">Shipping Status</small>
//                 <br />
//                 <Badge
//                   bg={
//                     dispute.transaction_state_snapshot?.shipping_submitted
//                       ? "success"
//                       : "warning"
//                   }>
//                   {dispute.transaction_state_snapshot?.shipping_submitted
//                     ? "Shipped"
//                     : "Not Shipped"}
//                 </Badge>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <small className="text-muted">Delivery Confirmation</small>
//                 <br />
//                 <Badge
//                   bg={
//                     dispute.transaction_state_snapshot?.buyer_confirm_status
//                       ? "success"
//                       : "warning"
//                   }>
//                   {dispute.transaction_state_snapshot?.buyer_confirm_status
//                     ? "Confirmed"
//                     : "Pending"}
//                 </Badge>
//               </ListGroup.Item>
//             </ListGroup>
//           </Card>
//         </div>
//       </div>

//       {/* ========================================
//           MODALS
//       ======================================== */}

//       {/* Propose Resolution Modal */}
//       <Modal
//         show={showProposeModal}
//         onHide={() => setShowProposeModal(false)}
//         centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Propose Resolution</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Resolution Description *</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={5}
//                 value={proposalDescription}
//                 onChange={(e) => setProposalDescription(e.target.value)}
//                 placeholder="Describe your proposed resolution in detail..."
//               />
//               <Form.Text className="text-muted">
//                 Explain clearly how you propose to resolve this dispute.
//               </Form.Text>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowProposeModal(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant="success"
//             onClick={handleProposeResolution}
//             disabled={isSubmitting || !proposalDescription.trim()}>
//             {isSubmitting ? (
//               <Spinner animation="border" size="sm" />
//             ) : (
//               "Submit Proposal"
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Respond to Resolution Modal */}
//       <Modal
//         show={showRespondModal}
//         onHide={() => setShowRespondModal(false)}
//         centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Respond to Proposal</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {pendingProposal && (
//             <>
//               <Alert variant="info">
//                 <strong>Proposal Description:</strong>
//                 <p className="mb-0 mt-2">
//                   {pendingProposal.proposal_description}
//                 </p>
//               </Alert>
//               <Form>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Your Decision *</Form.Label>
//                   <div className="d-grid gap-2">
//                     <Button
//                       variant={
//                         respondAction === "accept"
//                           ? "success"
//                           : "outline-success"
//                       }
//                       onClick={() => setRespondAction("accept")}>
//                       <i className="bi bi-check-circle me-2"></i>Accept
//                       Resolution
//                     </Button>
//                     <Button
//                       variant={
//                         respondAction === "reject" ? "danger" : "outline-danger"
//                       }
//                       onClick={() => setRespondAction("reject")}>
//                       <i className="bi bi-x-circle me-2"></i>Reject Resolution
//                     </Button>
//                   </div>
//                 </Form.Group>
//                 <Form.Group>
//                   <Form.Label>Explain Your Decision *</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={4}
//                     value={responseDescription}
//                     onChange={(e) => setResponseDescription(e.target.value)}
//                     placeholder={
//                       respondAction === "accept"
//                         ? "Explain why you're accepting this proposal..."
//                         : "Explain why you're rejecting this proposal..."
//                     }
//                   />
//                 </Form.Group>
//               </Form>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowRespondModal(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant={respondAction === "accept" ? "success" : "danger"}
//             onClick={handleRespondToResolution}
//             disabled={
//               isSubmitting || !respondAction || !responseDescription.trim()
//             }>
//             {isSubmitting ? (
//               <Spinner animation="border" size="sm" />
//             ) : (
//               "Submit Response"
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Request Mediator Modal */}
//       <Modal
//         show={showMediatorModal}
//         onHide={() => setShowMediatorModal(false)}
//         centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Request Mediator</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Alert variant="warning">
//             <Alert.Heading className="fs-6">Are you sure?</Alert.Heading>
//             <p>
//               Requesting a mediator will escalate this dispute to a neutral
//               third party. Both parties will need to work with the mediator to
//               resolve the issue.
//             </p>
//           </Alert>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowMediatorModal(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant="danger"
//             onClick={handleRequestMediator}
//             disabled={isSubmitting}>
//             {isSubmitting ? (
//               <Spinner animation="border" size="sm" />
//             ) : (
//               "Confirm Request"
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Cancel Dispute Modal */}
//       <Modal
//         show={showCancelModal}
//         onHide={() => setShowCancelModal(false)}
//         centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Cancel Dispute</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Alert variant="danger">
//             <Alert.Heading className="fs-6">Cancel This Dispute?</Alert.Heading>
//             <p>
//               Cancelling will close the dispute and allow the transaction to
//               proceed normally. This action cannot be undone.
//             </p>
//           </Alert>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
//             No, Keep Dispute
//           </Button>
//           <Button
//             variant="danger"
//             onClick={handleCancelDispute}
//             disabled={isSubmitting}>
//             {isSubmitting ? (
//               <Spinner animation="border" size="sm" />
//             ) : (
//               "Yes, Cancel Dispute"
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// const DisputeDetailsPage = () => {
//   return (
//     <div className="contestPage" style={{ "background-color": "#F9F9FB" }}>
//       <div className="row">
//         <div className="col-lg-3 col-sm-12"></div>

//         <div className="col-lg-9 col-sm-12">
//           <UserDashboardNavbar />
//           <div className="mt-5 center-card">
//             <DisputeComponents />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default DisputeDetailsPage;

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
    <Badge bg={config.variant} className="fs-6 px-3 py-2">
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
    <Badge bg={config.variant} className="fs-6 px-3 py-2">
      <i className={`${config.icon} me-2`}></i>
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

  return <Badge bg={config.variant}>{config.text}</Badge>;
};

// ========================================
// PROPOSAL DETECTION HELPER FUNCTIONS
// ========================================

const getPendingProposalForCurrentUser = (dispute, userEmail) => {
  if (!dispute?.resolution_proposals?.length || !userEmail) return null;

  // Find the most recent pending proposal that's NOT from the current user
  const pendingProposals = dispute.resolution_proposals.filter(
    (proposal) => proposal.status === "pending"
  );

  if (pendingProposals.length === 0) return null;

  // Get the most recent pending proposal
  const latestPendingProposal = pendingProposals.reduce((latest, current) => {
    return new Date(current.proposal_date) > new Date(latest.proposal_date)
      ? current
      : latest;
  });

  // Check if this proposal is from the OTHER party (not current user)
  const isFromOtherParty =
    latestPendingProposal.proposed_by_email.toLowerCase() !==
    userEmail.toLowerCase();

  return isFromOtherParty ? latestPendingProposal : null;
};

const getCurrentUserPendingProposal = (dispute, userEmail) => {
  if (!dispute?.resolution_proposals?.length || !userEmail) return null;

  // Find pending proposals from current user
  const userPendingProposals = dispute.resolution_proposals.filter(
    (proposal) =>
      proposal.status === "pending" &&
      proposal.proposed_by_email.toLowerCase() === userEmail.toLowerCase()
  );

  return userPendingProposals.length > 0 ? userPendingProposals[0] : null;
};

const DisputeComponents = () => {
  const { transaction_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.usersauth);

  // Add this function to clear cache
  const clearDisputeCache = () => {
    dispatch(
      disputeAPISlice.util.invalidateTags([
        "Escrow Dispute",
        { type: "Dispute Details", id: transaction_id },
      ])
    );
  };

  // Call this when component mounts or after deletion
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
      (e) => e && typeof e === "string" && e.trim()
    );
    return email ? email.toLowerCase().trim() : null;
  };

  const userEmail = getUserEmail();

  console.log("🔍 DisputeDetailsPage Debug:");
  console.log("Transaction ID:", transaction_id);
  console.log("Full userInfo:", userInfo);
  console.log("Extracted userEmail:", userEmail);

  const {
    data: disputeResponse,
    isLoading,
    error,
    refetch,
  } = useFetchDisputeByTransactionIdQuery(transaction_id, {
    skip: !userEmail,
  });

  const dispute = disputeResponse?.data?.dispute;

  // ✅ FIX: Calculate statusInfo with proper fallbacks
  const statusInfo = disputeResponse?.data?.status_info || {
    is_mediator_involved:
      dispute?.dispute_status === "escalated_to_mediator" ||
      dispute?.mediator !== null,
    rejection_count: dispute?.rejection_count || 0,
    max_rejections: dispute?.max_rejections || 3,
    rejections_remaining:
      (dispute?.max_rejections || 3) - (dispute?.rejection_count || 0),
  };

  // ✅ FIX: Calculate proposal info with proper fallbacks
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

  // ✅ FIX: Mediator involvement check with multiple fallbacks
  const isMediatorInvolved =
    statusInfo?.is_mediator_involved ||
    dispute?.dispute_status === "escalated_to_mediator" ||
    dispute?.mediator !== null ||
    false;

  // ✅ FIX: Use backend-provided flags with proper fallbacks
  const canPropose =
    disputeResponse?.data?.can_propose ??
    (!pendingProposalForCurrentUser &&
      !currentUserPendingProposal &&
      !isMediatorInvolved);

  const canRespond =
    disputeResponse?.data?.can_respond ??
    (!!pendingProposalForCurrentUser && !isMediatorInvolved);

  const canRequestMediator =
    disputeResponse?.data?.can_request_mediator ?? true;
  const canCancelDispute = disputeResponse?.data?.can_cancel_dispute ?? true;

  // ✅ FIX: Get user role from backend
  const userRole = disputeResponse?.data?.user_role; // "buyer" or "seller"
  const isBuyer = disputeResponse?.data?.is_buyer;
  const isSeller = disputeResponse?.data?.is_seller;

  console.log("📊 Query State:", {
    isLoading,
    error: error?.data || error,
    hasData: !!dispute,
    disputeData: dispute,
    userRole,
    isBuyer,
    isSeller,
    canPropose,
    canRespond,
    canRequestMediator,
    canCancelDispute,
    pendingProposalForCurrentUser,
    currentUserPendingProposal,
    statusInfo,
    isMediatorInvolved,
  });

  const [proposeResolution] = useProposeResolutionMutation();
  const [respondToResolution] = useRespondToResolutionMutation();
  const [requestMediator] = useRequestMediatorMutation();
  const [cancelDispute] = useCancelDisputeMutation();

  // State
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
          : "Resolution rejected. You can propose a new resolution."
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
        "Mediator requested successfully. A mediator will be assigned soon."
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
      <div className="container mt-5">
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
      <div className="container mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dispute</Alert.Heading>
          <p>{error?.data?.message || "Failed to load dispute details"}</p>
          <Button variant="outline-danger" onClick={() => refetch()}>
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="container mt-5">
        <Alert variant="warning">
          <Alert.Heading>Dispute Not Found</Alert.Heading>
          <p>No dispute found for this transaction.</p>
          <Button variant="outline-warning" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Alert>
      </div>
    );
  }

  // ✅ FIX: Better role display logic
  const getRoleDisplayName = () => {
    if (!userRole) return "Unknown";
    return userRole.charAt(0).toUpperCase() + userRole.slice(1);
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button
            variant="link"
            className="text-decoration-none p-0 mb-2"
            onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Back to Transactions
          </Button>
          <h2 className="fw-bold mb-0" style={{ color: "#1a1a1a" }}>
            Dispute Details
          </h2>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {getDisputeStatusBadge(dispute.dispute_status)}
          {getStageBadge(dispute.dispute_stage)}
        </div>
      </div>
      {/* ✅ FIX: Alert for Mediator Escalation - Role-specific messaging */}
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
              <span className="ms-1">
                {" "}
                Requested by: <strong>{dispute.mediator_requested_by}</strong>
              </span>
            )}
          </p>
          {dispute.mediator && (
            <div className="mt-2">
              <strong>Assigned Mediator:</strong>{" "}
              {dispute.mediator.name || dispute.mediator.email}
            </div>
          )}
        </Alert>
      )}
      {/* ✅ FIX: Alert for Pending Action - Role-specific messaging */}
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
            onClick={() => setShowRespondModal(true)}>
            <i className="bi bi-eye me-2"></i>Review Proposal
          </Button>
        </Alert>
      )}
      {/* ✅ FIX: Alert for Current User's Pending Proposal - Role-aware */}
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
        <div className="col-lg-8">
          {/* Dispute Overview */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 fw-bold" style={{ color: "#006747EB" }}>
                <i className="bi bi-flag me-2"></i>Dispute Overview
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="row g-3">
                <div className="col-md-6">
                  <small className="text-muted d-block">Transaction ID</small>
                  <code className="d-block">{dispute.transaction_id}</code>
                </div>
                <div className="col-md-6">
                  <small className="text-muted d-block">Product</small>
                  <strong>{dispute.product_name}</strong>
                </div>
                <div className="col-md-6">
                  <small className="text-muted d-block">Raised By</small>
                  <Badge
                    bg={
                      dispute.dispute_raised_by === "buyer" ? "primary" : "info"
                    }>
                    {dispute.dispute_raised_by === "buyer" ? "Buyer" : "Seller"}
                    {dispute.dispute_raised_by === userRole && " (You)"}
                  </Badge>
                </div>
                <div className="col-md-6">
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
                  <strong>{dispute.reason_for_dispute}</strong>
                </div>
                <div className="col-12">
                  <small className="text-muted d-block mb-1">Description</small>
                  <p className="mb-0">{dispute.dispute_description}</p>
                </div>
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
                    style={{ fontSize: "3rem" }}></i>
                  <p className="text-muted mt-2">No resolution proposals yet</p>
                  {canPropose && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => setShowProposeModal(true)}>
                      Be the first to propose a resolution
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <Accordion defaultActiveKey="0">
                    {dispute.resolution_proposals.map((proposal, index) => {
                      // ✅ FIX: Case-insensitive email comparison
                      const isUserProposal =
                        proposal.proposed_by_email.toLowerCase() ===
                        userEmail?.toLowerCase();

                      return (
                        <Accordion.Item
                          eventKey={String(index)}
                          key={proposal._id || index}>
                          <Accordion.Header>
                            <div className="d-flex justify-content-between align-items-center w-100 me-3">
                              <span className="fw-semibold">
                                Proposal #{index + 1} -{" "}
                                {proposal.proposed_by === "buyer"
                                  ? "Buyer"
                                  : "Seller"}
                                {isUserProposal && (
                                  <Badge bg="success" className="ms-2">
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
                              <strong>{proposal.proposed_by_email}</strong>
                              {isUserProposal && (
                                <Badge bg="primary" className="ms-2">
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
                                  proposal.proposal_date
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="mb-3">
                              <small className="text-muted d-block">
                                Proposal Description
                              </small>
                              <p className="mb-0 border rounded p-2 bg-light">
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
                                    <strong>{proposal.responded_by}</strong>
                                    {proposal.responded_by.toLowerCase() ===
                                      userEmail?.toLowerCase() && (
                                      <Badge bg="info" className="ms-2">
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
                                        proposal.response_date
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                  {proposal.response_description && (
                                    <div className="mb-3">
                                      <small className="text-muted d-block">
                                        Response
                                      </small>
                                      <p className="mb-0 border rounded p-2 bg-light">
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

                  {/* ✅ FIXED: Rejection Counter with safe statusInfo access */}
                  {statusInfo?.rejection_count > 0 &&
                    dispute.dispute_status !== "resolved" && (
                      <Alert variant="warning" className="mt-3 mb-0">
                        <small>
                          <i className="bi bi-exclamation-circle me-2"></i>
                          <strong>{statusInfo.rejection_count}</strong> of{" "}
                          <strong>{statusInfo.max_rejections}</strong>{" "}
                          rejections used.
                          {statusInfo.rejection_count >=
                          statusInfo.max_rejections
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
        <div className="col-lg-4">
          {/* Action Buttons */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold">Actions ({getRoleDisplayName()})</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {/* Propose Resolution */}
                {canPropose && !isMediatorInvolved && (
                  <Button
                    variant="success"
                    onClick={() => setShowProposeModal(true)}
                    disabled={
                      dispute.dispute_status === "resolved" ||
                      dispute.dispute_status === "cancelled"
                    }>
                    <i className="bi bi-lightbulb me-2"></i>
                    Propose Resolution
                  </Button>
                )}

                {/* Respond to Proposal */}
                {canRespond &&
                  pendingProposalForCurrentUser &&
                  !isMediatorInvolved && (
                    <Button
                      variant="warning"
                      onClick={() => setShowRespondModal(true)}>
                      <i className="bi bi-reply me-2"></i>Respond to Proposal
                    </Button>
                  )}

                {/* Request Mediator */}
                {canRequestMediator && !isMediatorInvolved && (
                  <Button
                    variant="danger"
                    onClick={() => setShowMediatorModal(true)}>
                    <i className="bi bi-person-badge me-2"></i>Request Mediator
                  </Button>
                )}

                {/* Cancel Dispute */}
                {canCancelDispute && !isMediatorInvolved && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowCancelModal(true)}>
                    <i className="bi bi-x-circle me-2"></i>Cancel Dispute
                  </Button>
                )}

                {/* ✅ FIX: Show why buttons are disabled */}
                {!canPropose && !canRespond && !isMediatorInvolved && (
                  <Alert variant="info" className="mb-0 p-2">
                    <small>
                      {currentUserPendingProposal ? (
                        <>
                          <i className="bi bi-clock me-1"></i>Waiting for other
                          party's response
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

                {/* Message when mediator is involved */}
                {isMediatorInvolved && (
                  <Alert variant="info" className="mb-0 p-2">
                    <small>
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
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">Buyer</small>
                    <strong>{dispute.buyer_email}</strong>
                    {isBuyer && (
                      <Badge bg="primary" className="ms-2">
                        You
                      </Badge>
                    )}
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">Seller</small>
                    <strong>{dispute.vendor_name}</strong>
                    <br />
                    <small className="text-muted">{dispute.vendor_email}</small>
                    {isSeller && (
                      <Badge bg="info" className="ms-2">
                        You
                      </Badge>
                    )}
                  </div>
                </div>
              </ListGroup.Item>
              {isMediatorInvolved && (
                <ListGroup.Item>
                  <div>
                    <small className="text-muted d-block">Mediator</small>
                    {dispute.mediator ? (
                      <>
                        <strong>
                          {dispute.mediator.name || dispute.mediator.email}
                        </strong>
                        <Badge bg="danger" className="ms-2">
                          Active
                        </Badge>
                      </>
                    ) : (
                      <>
                        <strong>Pending Assignment</strong>
                        <Badge bg="warning" className="ms-2">
                          Waiting
                        </Badge>
                      </>
                    )}
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
                  }>
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
                  }>
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
                  }>
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
        centered>
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
            onClick={() => setShowProposeModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleProposeResolution}
            disabled={isSubmitting || !proposalDescription.trim()}>
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
        centered>
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
                <p className="mb-0 mt-2">
                  {pendingProposalForCurrentUser.proposal_description}
                </p>
              </Alert>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Your Decision *</Form.Label>
                  <div className="d-grid gap-2">
                    <Button
                      variant={
                        respondAction === "accept"
                          ? "success"
                          : "outline-success"
                      }
                      onClick={() => setRespondAction("accept")}>
                      <i className="bi bi-check-circle me-2"></i>Accept
                      Resolution
                    </Button>
                    <Button
                      variant={
                        respondAction === "reject" ? "danger" : "outline-danger"
                      }
                      onClick={() => setRespondAction("reject")}>
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
            onClick={() => setShowRespondModal(false)}>
            Cancel
          </Button>
          <Button
            variant={respondAction === "accept" ? "success" : "danger"}
            onClick={handleRespondToResolution}
            disabled={
              isSubmitting || !respondAction || !responseDescription.trim()
            }>
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
        centered>
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
            onClick={() => setShowMediatorModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleRequestMediator}
            disabled={isSubmitting}>
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
        centered>
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
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, Keep Dispute
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelDispute}
            disabled={isSubmitting}>
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
    <div className="contestPage" style={{ backgroundColor: "#F9F9FB" }}>
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>
        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5 center-card">
            <DisputeComponents />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetailsPage;
