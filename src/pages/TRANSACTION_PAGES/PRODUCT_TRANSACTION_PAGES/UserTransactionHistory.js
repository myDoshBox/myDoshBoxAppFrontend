// import React from "react";
// import { useEffect, useState, useMemo } from "react";
// import { toast } from "react-toastify";
// import TransactionData from "../../../data/dummyData/transactionData.json";
// import { PaginationBar } from "../../../components/PaginationComponent";
// import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button, Modal, Accordion } from "react-bootstrap";
// import Dropdown from "react-bootstrap/Dropdown";
// import buyerImage from "../../../images/transact_person.png";
// import { useFetchSingleTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
// import { useVerifyEscrowProductTransactionPaymentMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
// import { useCancelTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
// import { useBuyerConfirmsProductMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
// import { useFetchAllTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
// import { useFetchDisputeDetailsQuery } from "../../../redux/slices/disputeSlices/disputeAPISlice"; // Assume this is the query hook for fetching transactions
// import { useSellerConfirmsTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // NEW

// import { useSelector } from "react-redux";

// const UserTransactionHistory = () => {
//   return (
//     <div className="contestPage" style={{ "background-color": "#F9F9FB" }}>
//       <div className="row">
//         <div className="col-lg-3 col-sm-12"></div>

//         <div className="col-lg-9 col-sm-12">
//           <UserDashboardNavbar />
//           <div className="mt-5 center-card">
//             <RecentTransactionTable />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const RecentTransactionTable = () => {
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const userEmail =
//     userInfo?.user?.email ||
//     userInfo?.email ||
//     userInfo?.organization_email ||
//     userInfo?.userInfo?.email;

//   const {
//     data: transactions,
//     isLoading,
//     error,
//     refetch,
//   } = useFetchAllTransactionsQuery(userEmail, {
//     refetchOnMountOrArgChange: true,
//   });

//   const [cancelTransaction] = useCancelTransactionMutation();
//   const [buyerConfirmsProduct] = useBuyerConfirmsProductMutation();
//   const [sellerConfirmsTransaction] = useSellerConfirmsTransactionMutation(); // NEW

//   const itemsPerPage = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [show, setShow] = useState(false);
//   const [confirmCancel, setConfirmCancel] = useState(false);
//   const [showVendorConfirmModal, setShowVendorConfirmModal] = useState(false); // NEW

//   const navigate = useNavigate();

//   // Fetch dispute details when selectedTransaction is in dispute
//   const {
//     data: allDisputes,
//     isLoading: disputeLoading,
//     error: disputeError,
//   } = useFetchDisputeDetailsQuery(userEmail, {
//     skip: !userEmail,
//   });

//   // Find the dispute that belongs to the selected transaction
//   const currentDispute = allDisputes?.fetchDisputeDetails?.find(
//     (d) => d.transaction_id === selectedTransaction?.transaction_id
//   );

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) setCurrentPage(page);
//   };

//   const handleShowMore = (transaction) => {
//     setSelectedTransaction(transaction);
//     setShow(true);
//   };

//   const handleCloseModal = () => {
//     setShow(false);
//     setSelectedTransaction(null);
//   };

//   const handleRaiseDispute = (transaction) => {
//     navigate(
//       `/userdashboard/disputes/initiate-dispute/${transaction?.transaction_id}`,
//       {
//         state: { transaction },
//       }
//     );
//   };

//   const handleResolveConflict = (transaction) => {
//     navigate(
//       `/userdashboard/disputes/resolve-dispute/${transaction?.transaction_id}`,
//       {
//         state: { transaction },
//       }
//     );
//   };

//   const handleCancelTransaction = async () => {
//     if (!selectedTransaction) return;

//     try {
//       toast.info("Cancelling transaction...", { autoClose: 2000 });

//       await cancelTransaction(selectedTransaction?.transaction_id).unwrap();

//       toast.success("Transaction cancelled successfully!");
//       setConfirmCancel(false);
//       setShow(false);

//       refetch();
//       navigate("/userdashboard/transaction-history/cancelled-transactions");
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to cancel transaction");
//     }
//   };

//   // NEW: Handle vendor confirmation
//   const handleVendorConfirmTransaction = async (confirmation) => {
//     if (!selectedTransaction) return;

//     try {
//       toast.info(
//         confirmation ? "Confirming transaction..." : "Declining transaction...",
//         { autoClose: 2000 }
//       );

//       await sellerConfirmsTransaction({
//         transaction_id: selectedTransaction.transaction_id,
//         confirmation: confirmation,
//         vendor_email: userEmail,
//       }).unwrap();

//       if (confirmation) {
//         toast.success(
//           "Transaction confirmed! Buyer has been notified to proceed with payment."
//         );
//       } else {
//         toast.info("Transaction declined. Buyer has been notified.");
//       }

//       setShowVendorConfirmModal(false);
//       setShow(false);
//       refetch();
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to process confirmation");
//     }
//   };

//   // NEW: Handle proceed to payment
//   const handleProceedToPayment = () => {
//     navigate(
//       `/userdashboard/transaction-history/payment/${selectedTransaction.transaction_id}`,
//       {
//         state: { transaction: selectedTransaction },
//       }
//     );
//   };

//   const getSlicedData = () => {
//     if (!transactions?.transactions?.length) return [];
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return transactions?.transactions?.slice(
//       startIndex,
//       startIndex + itemsPerPage
//     );
//   };

//   const slicedData = getSlicedData();

//   return (
//     <div className="bg-white rounded-1 p-3 w-100">
//       {/* Header */}
//       <div className="d-md-flex justify-content-between align-items-center mb-3">
//         <h3 className="fs-6 m-0 mb-3 mb-md-0">All Transactions</h3>
//         <div className="d-flex">
//           <Link to="../initiate-escrow" className="text-decoration-none me-2">
//             <Button
//               className="border-0 my-1 rounded-1 all-btn text-white fs-sm"
//               style={{ backgroundColor: "#006747EB" }}>
//               Create Transaction
//             </Button>
//           </Link>
//           <Link to="../initiate-escrow" className="text-decoration-none">
//             <Button
//               className="border-0 my-1 rounded-1 all-btn text-white fs-sm"
//               style={{ backgroundColor: "#006747EB" }}>
//               Download Transaction Slip
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Transaction Table */}
//       <div className="table-responsive">
//         <table className="table fs-sm">
//           <thead>
//             <tr className="d-md-none lightTextColor">
//               <th className="fs-6">Product</th>
//               <th className="fs-6 text-center">Date</th>
//               <th className="fs-6 text-center">Status</th>
//               <th className="fs-6 text-center">Action</th>
//             </tr>
//             <tr className="d-none d-md-table-row lightTextColor">
//               <th>Product Name</th>
//               <th className="text-center">Vendor</th>
//               <th className="text-center">Purchase Date</th>
//               <th className="text-center">Product Price</th>
//               <th className="text-center">Transaction Type</th>
//               <th className="text-center">Transaction Status</th>
//               <th className="text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {getSlicedData()?.map((history) => (
//               <React.Fragment key={history.id}>
//                 {/* Small screen row */}
//                 <tr className="d-md-none">
//                   <td>{history?.product_name}</td>
//                   <td className="text-center">
//                     {history?.createdAt?.slice(0, 10)}
//                   </td>
//                   <td className="text-center">{history?.transaction_status}</td>
//                   <td className="text-center">
//                     <Button
//                       variant={
//                         history?.transaction_status === "inDispute"
//                           ? "outline-danger"
//                           : "outline-success"
//                       }
//                       size="sm"
//                       onClick={() => handleShowMore(history)}>
//                       {history?.transaction_status === "inDispute"
//                         ? "View "
//                         : "View "}
//                     </Button>
//                   </td>
//                 </tr>

//                 {/* Desktop row */}
//                 <tr className="d-none d-md-table-row">
//                   <td>{history?.products?.[0]?.name || "N/A"}</td>
//                   <td className="text-center">{history?.vendor_name}</td>
//                   <td className="text-center">
//                     {history?.createdAt?.slice(0, 10)}
//                   </td>
//                   <td className="text-center">
//                     ₦{history?.products?.[0]?.price?.toLocaleString() || "N/A"}
//                   </td>
//                   <td className="text-center">{history?.transaction_type}</td>
//                   <td className="text-center">{history?.transaction_status}</td>
//                   <td className="text-center">
//                     <Button
//                       variant={
//                         history?.transaction_status === "inDispute"
//                           ? "outline-danger"
//                           : "outline-success"
//                       }
//                       size="sm"
//                       onClick={() => handleShowMore(history)}>
//                       View More
//                     </Button>
//                   </td>
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <PaginationBar
//         data={transactions?.transactions || []}
//         currentPage={currentPage}
//         handlePageChange={handlePageChange}
//         itemsPerPage={itemsPerPage}
//         totalPages={totalPages}
//         setTotalPages={setTotalPages}
//       />

//       {/* Transaction Details Modal */}
//       <Modal show={show} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {selectedTransaction?.transaction_status === "inDispute"
//               ? "Transaction & Dispute Details"
//               : "Transaction Details"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedTransaction ? (
//             <>
//               <Accordion defaultActiveKey="0">
//                 {/* Transaction Details Accordion */}
//                 <Accordion.Item eventKey="0">
//                   <Accordion.Header>
//                     <span
//                       style={{
//                         color: "#0f5132",
//                         backgroundColor: "#d1e7dd",
//                         padding: "8px 12px",
//                         borderRadius: "8px",
//                         width: "100%",
//                         fontWeight: "600",
//                       }}>
//                       Transaction Details
//                     </span>
//                   </Accordion.Header>

//                   <Accordion.Body>
//                     <p>
//                       <strong>Transaction ID:</strong>{" "}
//                       {selectedTransaction?.transaction_id}
//                     </p>
//                     <p>
//                       <strong>Transaction Status:</strong>{" "}
//                       {selectedTransaction?.transaction_status}
//                     </p>
//                     <p>
//                       <strong>Purchase Date:</strong>{" "}
//                       {selectedTransaction?.createdAt?.slice(0, 10)}
//                     </p>
//                     <p>
//                       <strong>Purchase Time:</strong>{" "}
//                       {selectedTransaction?.createdAt?.slice(11, 19)}
//                     </p>

//                     {/* Nested Accordions for Vendor, Buyer, and Products */}
//                     <Accordion
//                       defaultActiveKey={[
//                         "vendor-info",
//                         "buyer-info",
//                         "product-0",
//                       ]}
//                       alwaysOpen
//                       className="mt-3">
//                       {/* Vendor Info Accordion */}
//                       <Accordion.Item eventKey="vendor-info">
//                         <Accordion.Header>
//                           <span
//                             style={{
//                               color: "#0a3622",
//                               backgroundColor: "#d1e7dd",
//                               padding: "6px 10px",
//                               borderRadius: "6px",
//                               width: "100%",
//                               fontWeight: "500",
//                               fontSize: "0.95rem",
//                             }}>
//                             Vendor Information
//                           </span>
//                         </Accordion.Header>
//                         <Accordion.Body>
//                           <p>
//                             <strong>Vendor Name:</strong>{" "}
//                             {selectedTransaction?.vendor_name}
//                           </p>
//                           <p>
//                             <strong>Vendor Email:</strong>{" "}
//                             {selectedTransaction?.vendor_email}
//                           </p>
//                           <p className="mb-0">
//                             <strong>Vendor Phone:</strong>{" "}
//                             {selectedTransaction?.vendor_phone_number}
//                           </p>
//                         </Accordion.Body>
//                       </Accordion.Item>

//                       {/* Buyer Info Accordion */}
//                       <Accordion.Item eventKey="buyer-info">
//                         <Accordion.Header>
//                           <span
//                             style={{
//                               color: "#0a3622",
//                               backgroundColor: "#d1e7dd",
//                               padding: "6px 10px",
//                               borderRadius: "6px",
//                               width: "100%",
//                               fontWeight: "500",
//                               fontSize: "0.95rem",
//                             }}>
//                             Buyer Information
//                           </span>
//                         </Accordion.Header>
//                         <Accordion.Body>
//                           <p>
//                             <strong>Buyer Email:</strong>{" "}
//                             {selectedTransaction?.buyer_email}
//                           </p>
//                           <p className="mb-0">
//                             <strong>Delivery Address:</strong>{" "}
//                             {selectedTransaction?.delivery_address}
//                           </p>
//                         </Accordion.Body>
//                       </Accordion.Item>
//                     </Accordion>

//                     {/* Products Information Header */}
//                     <h6 className="fw-semibold text-success mt-3 mb-2">
//                       Products Information
//                     </h6>

//                     <Accordion defaultActiveKey="product-0">
//                       {/* Products Accordions */}
//                       {selectedTransaction?.products?.map((product, index) => (
//                         <Accordion.Item
//                           eventKey={`product-${index}`}
//                           key={product._id || index}>
//                           <Accordion.Header>
//                             <span
//                               style={{
//                                 color: "#084298",
//                                 backgroundColor: "#cfe2ff",
//                                 padding: "6px 10px",
//                                 borderRadius: "6px",
//                                 width: "100%",
//                                 fontWeight: "500",
//                                 fontSize: "0.95rem",
//                               }}>
//                               {product.name}{" "}
//                               {selectedTransaction?.products?.length > 1
//                                 ? `(${index + 1} of ${
//                                     selectedTransaction.products.length
//                                   })`
//                                 : ""}
//                             </span>
//                           </Accordion.Header>

//                           <Accordion.Body>
//                             <p>
//                               <strong>Product Name:</strong> {product.name}
//                             </p>
//                             <p>
//                               <strong>Quantity:</strong> {product.quantity}
//                             </p>
//                             <p>
//                               <strong>Price:</strong> ₦
//                               {product.price?.toLocaleString()}
//                             </p>
//                             <p>
//                               <strong>Subtotal:</strong> ₦
//                               {(
//                                 product.price * product.quantity
//                               )?.toLocaleString()}
//                             </p>
//                             <p>
//                               <strong>Description:</strong>{" "}
//                               {product.description || "N/A"}
//                             </p>

//                             {product.image && (
//                               <div className="mt-2">
//                                 <strong>Product Image:</strong>
//                                 <br />
//                                 <img
//                                   src={product.image}
//                                   alt={product.name}
//                                   style={{
//                                     maxWidth: "150px",
//                                     borderRadius: "8px",
//                                     border: "1px solid #ccc",
//                                     marginTop: "6px",
//                                   }}
//                                   onError={(e) => {
//                                     e.target.style.display = "none";
//                                   }}
//                                 />
//                               </div>
//                             )}
//                           </Accordion.Body>
//                         </Accordion.Item>
//                       ))}
//                     </Accordion>

//                     {/* Total Amount */}
//                     <div
//                       className="mt-3 p-2"
//                       style={{
//                         backgroundColor: "#f8f9fa",
//                         borderRadius: "6px",
//                       }}>
//                       <p className="mb-1 ">
//                         <strong className="bg-success text-white p-1 rounded-1">
//                           Sum Total:
//                         </strong>{" "}
//                         ₦{selectedTransaction?.sum_total?.toLocaleString()}
//                       </p>
//                     </div>
//                   </Accordion.Body>
//                 </Accordion.Item>

//                 {/* Dispute Details Accordion (only when inDispute) */}
//                 {selectedTransaction?.transaction_status === "inDispute" && (
//                   <Accordion.Item eventKey="1">
//                     <Accordion.Header>
//                       <span
//                         style={{
//                           color: "#842029",
//                           backgroundColor: "#f8d7da",
//                           padding: "8px 12px",
//                           borderRadius: "8px",
//                           width: "100%",
//                           fontWeight: "600",
//                         }}>
//                         Dispute Details
//                       </span>
//                     </Accordion.Header>

//                     <Accordion.Body>
//                       {disputeLoading ? (
//                         <p>Loading dispute details...</p>
//                       ) : disputeError ? (
//                         <p style={{ color: "red" }}>
//                           Error loading disputes:{" "}
//                           {disputeError?.data?.message || disputeError?.message}
//                         </p>
//                       ) : currentDispute ? (
//                         <>
//                           <p>
//                             <strong>Reason for Dispute:</strong>{" "}
//                             {currentDispute?.reason_for_dispute || "N/A"}
//                           </p>
//                           <p>
//                             <strong>Dispute Description:</strong>{" "}
//                             {currentDispute?.dispute_description || "N/A"}
//                           </p>
//                         </>
//                       ) : (
//                         <p>
//                           No dispute details available for this transaction.
//                         </p>
//                       )}
//                     </Accordion.Body>
//                   </Accordion.Item>
//                 )}
//               </Accordion>

//               {/* ✅ Action Buttons Section - UPDATED */}
//               {selectedTransaction?.buyer_initiated &&
//                 !selectedTransaction?.seller_confirmed &&
//                 selectedTransaction?.transaction_status === "processing" && (
//                   <div className="mt-3 d-flex gap-2 flex-wrap">
//                     {/* Buyer Actions */}
//                     {userEmail === selectedTransaction?.buyer_email && (
//                       <Button
//                         variant="outline-danger"
//                         onClick={() => setConfirmCancel(true)}>
//                         Cancel Transaction
//                       </Button>
//                     )}

//                     {/* Vendor Actions - UPDATED */}
//                     {userEmail === selectedTransaction?.vendor_email && (
//                       <>
//                         <Button
//                           variant="outline-primary"
//                           onClick={() => setShowVendorConfirmModal(true)}>
//                           Confirm Transaction
//                         </Button>
//                         <Button
//                           variant="outline-warning"
//                           onClick={() =>
//                             handleRaiseDispute(selectedTransaction)
//                           }>
//                           Raise Dispute
//                         </Button>
//                       </>
//                     )}
//                   </div>
//                 )}

//               {/* NEW: Buyer Proceed to Payment Button (after vendor confirms) */}
//               {selectedTransaction?.seller_confirmed &&
//                 selectedTransaction?.transaction_status ===
//                   "awaiting_payment" &&
//                 userEmail === selectedTransaction?.buyer_email && (
//                   <div className="mt-3">
//                     <Button
//                       variant="success"
//                       size="lg"
//                       onClick={handleProceedToPayment}
//                       className="w-100">
//                       Proceed to Payment
//                     </Button>
//                   </div>
//                 )}

//               {/* In Dispute Buttons */}
//               {selectedTransaction?.transaction_status === "inDispute" && (
//                 <div className="mt-3 d-flex gap-2 flex-wrap">
//                   {userEmail === selectedTransaction?.buyer_email && (
//                     <>
//                       <Button
//                         variant="outline-danger"
//                         onClick={() => setConfirmCancel(true)}>
//                         Cancel Transaction
//                       </Button>
//                       <Button
//                         variant="outline-success"
//                         onClick={() =>
//                           handleResolveConflict(selectedTransaction)
//                         }>
//                         Resolve Dispute
//                       </Button>
//                     </>
//                   )}
//                   {userEmail === selectedTransaction?.vendor_email && (
//                     <Button
//                       variant="outline-warning"
//                       onClick={() => toast.info("Mediator has been involved!")}>
//                       Involve Mediator
//                     </Button>
//                   )}
//                 </div>
//               )}
//             </>
//           ) : (
//             <p>No transaction details available.</p>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* NEW: Vendor Confirmation Modal */}
//       <Modal
//         show={showVendorConfirmModal}
//         onHide={() => setShowVendorConfirmModal(false)}
//         centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Transaction</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure you want to confirm transaction?</Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => {
//               handleVendorConfirmTransaction(false);
//             }}>
//             No
//           </Button>
//           <Button
//             variant="success"
//             onClick={() => {
//               handleVendorConfirmTransaction(true);
//             }}>
//             Yes
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Confirm Cancel Modal */}
//       <Modal
//         show={confirmCancel}
//         onHide={() => setConfirmCancel(false)}
//         centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Cancel Transaction</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to cancel this transaction?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setConfirmCancel(false)}>
//             No
//           </Button>
//           <Button variant="danger" onClick={handleCancelTransaction}>
//             Yes, Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// /* Table Row Component */
// export const RecentTransactionTableData = ({
//   product_name,
//   vendor_name,
//   createdAt,
//   transaction_status,
//   onViewMore,
// }) => {
//   return (
//     <tr className="border-bottom">
//       <td className="py-md-3">{product_name}</td>
//       <td className="text-center">{vendor_name}</td>
//       <td className="text-center">{createdAt?.slice(0, 10)}</td>
//       <td className="text-center">{transaction_status}</td>
//       <td className="text-center">
//         <Button
//           variant="outline-primary"
//           className="rounded-1 fs-sm"
//           onClick={onViewMore}>
//           View Details
//         </Button>
//       </td>
//     </tr>
//   );
// };

// export default UserTransactionHistory;

import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal, Accordion, Badge } from "react-bootstrap";
import { useCancelTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useBuyerConfirmsProductMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useFetchAllTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useFetchDisputeDetailsQuery } from "../../../redux/slices/disputeSlices/disputeAPISlice";
import { useSellerConfirmsTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useInitiatePaymentMutation } from "../../../redux/slices/paymentSlices/paymentAPISlice";
import { useSelector } from "react-redux";

// ========================================
// HELPER FUNCTIONS - CONSISTENT BADGE SYSTEM
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
      }}>
      {config.text}
    </Badge>
  );
};

const getPaymentStatus = (transaction) => {
  if (transaction?.verified_payment_status) {
    return (
      <Badge
        bg="success"
        style={{
          fontSize: "0.75rem",
          fontWeight: "500",
          padding: "4px 8px",
        }}>
        Paid
      </Badge>
    );
  }
  if (transaction?.transaction_status === "awaiting_payment") {
    return (
      <Badge
        bg="warning"
        style={{
          fontSize: "0.75rem",
          fontWeight: "500",
          padding: "4px 8px",
        }}>
        Pending
      </Badge>
    );
  }
  return (
    <Badge
      bg="secondary"
      style={{
        fontSize: "0.75rem",
        fontWeight: "500",
        padding: "4px 8px",
      }}>
      Not Initiated
    </Badge>
  );
};

// Helper to determine actual status display
const getDisplayStatus = (transaction) => {
  // If payment was verified but shipping not submitted
  if (
    transaction?.transaction_status === "payment_verified" &&
    !transaction?.shipping_submitted
  ) {
    return "awaiting_shipping";
  }

  // If transaction is in dispute
  if (transaction?.dispute_status === "active") {
    return "inDispute";
  }

  // Default case
  return transaction?.transaction_status;
};

// ========================================
// MAIN COMPONENT
// ========================================

const UserTransactionHistory = () => {
  return (
    <div className="contestPage" style={{ backgroundColor: "#F9F9FB" }}>
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>
        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5 center-card">
            <RecentTransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// TRANSACTION TABLE COMPONENT
// ========================================

export const RecentTransactionTable = () => {
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail =
    userInfo?.user?.email ||
    userInfo?.email ||
    userInfo?.organization_email ||
    userInfo?.userInfo?.email;

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useFetchAllTransactionsQuery(userEmail, {
    refetchOnMountOrArgChange: true,
  });

  const [cancelTransaction] = useCancelTransactionMutation();
  const [buyerConfirmsProduct] = useBuyerConfirmsProductMutation();
  const [sellerConfirmsTransaction] = useSellerConfirmsTransactionMutation();
  const [initiatePayment] = useInitiatePaymentMutation();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [show, setShow] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [showVendorConfirmModal, setShowVendorConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const navigate = useNavigate();
  console.log(selectedTransaction, "selectedTransaction");

  const {
    data: allDisputes,
    isLoading: disputeLoading,
    error: disputeError,
  } = useFetchDisputeDetailsQuery(userEmail, {
    skip: !userEmail,
  });

  const currentDispute = allDisputes?.fetchDisputeDetails?.find(
    (d) => d.transaction_id === selectedTransaction?.transaction_id
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleShowMore = (transaction) => {
    setSelectedTransaction(transaction);
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedTransaction(null);
  };

  const handleRaiseDispute = (transaction) => {
    navigate(
      `/userdashboard/disputes/initiate-dispute/${transaction?.transaction_id}`,
      { state: { transaction } }
    );
  };

  const handleResolveConflict = (transaction) => {
    navigate(
      `/userdashboard/disputes/resolve-dispute/${transaction?.transaction_id}`,
      { state: { transaction } }
    );
  };

  const handleCancelTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      toast.info("Cancelling transaction...", { autoClose: 2000 });
      await cancelTransaction(selectedTransaction?.transaction_id).unwrap();
      toast.success("Transaction cancelled successfully!");
      setConfirmCancel(false);
      setShow(false);
      refetch();
      navigate("/userdashboard/transaction-history/cancelled-transactions");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel transaction");
    }
  };

  const handleVendorConfirmTransaction = async (confirmation) => {
    if (!selectedTransaction) return;

    try {
      toast.info(
        confirmation ? "Confirming transaction..." : "Declining transaction...",
        { autoClose: 2000 }
      );

      await sellerConfirmsTransaction({
        transaction_id: selectedTransaction.transaction_id,
        confirmation: confirmation,
        vendor_email: userEmail,
      }).unwrap();

      if (confirmation) {
        toast.success(
          "Transaction confirmed! Buyer has been notified to proceed with payment."
        );
      } else {
        toast.info("Transaction declined. Buyer has been notified.");
      }

      setShowVendorConfirmModal(false);
      setShow(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to process confirmation");
    }
  };

  const handleInitiatePayment = (transaction) => {
    setSelectedTransaction(transaction);
    setShowPaymentModal(true);
  };

  const handleProceedToPaystack = async () => {
    if (!selectedTransaction) return;

    try {
      toast.info("Initiating payment...", { autoClose: 2000 });

      const response = await initiatePayment({
        transaction_id: selectedTransaction.transaction_id,
        buyer_email: userEmail,
      }).unwrap();

      if (response.status === "success" && response.authorization_url) {
        toast.success("Redirecting to payment gateway...");
        setShowPaymentModal(false);
        window.location.href = response.authorization_url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Payment initiation failed. Please try again."
      );
      console.error("Payment error:", error);
    }
  };

  const getSlicedData = () => {
    if (!transactions?.transactions?.length) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transactions?.transactions?.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  };

  const shouldShowPayButton = (transaction) => {
    return (
      transaction?.transaction_status === "awaiting_payment" &&
      transaction?.buyer_email === userEmail &&
      !transaction?.verified_payment_status
    );
  };

  return (
    <div className="bg-white rounded-1 p-3 w-100">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h3 className="fs-5 m-0 fw-bold" style={{ color: "#1a1a1a" }}>
          All Transactions
        </h3>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="../initiate-escrow" className="text-decoration-none">
            <Button
              className="border-0 rounded-1 text-white"
              style={{
                backgroundColor: "#006747EB",
                fontSize: "0.875rem",
                padding: "8px 16px",
              }}>
              <i className="bi bi-plus-circle me-2"></i>
              Create Transaction
            </Button>
          </Link>
          <Button
            variant="outline-success"
            className="rounded-1"
            style={{
              fontSize: "0.875rem",
              padding: "8px 16px",
              borderColor: "#006747EB",
              color: "#006747EB",
            }}>
            <i className="bi bi-download me-2"></i>
            Download Slip
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            style={{ color: "#006747EB" }}
            role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading transactions...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Failed to load transactions. Please try again.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && getSlicedData()?.length === 0 && (
        <div className="text-center py-5">
          <i
            className="bi bi-inbox"
            style={{ fontSize: "3rem", color: "#6c757d" }}></i>
          <p className="mt-3 text-muted">No transactions found</p>
          <Link to="../initiate-escrow">
            <Button
              style={{ backgroundColor: "#006747EB" }}
              className="border-0">
              Create Your First Transaction
            </Button>
          </Link>
        </div>
      )}

      {/* Transaction Table */}
      {!isLoading && !error && getSlicedData()?.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead
                style={{
                  backgroundColor: "#f8f9fa",
                  borderBottom: "2px solid #dee2e6",
                }}>
                {/* Mobile View Header */}
                <tr className="d-md-none">
                  <th style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Product
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Date
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Status
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Action
                  </th>
                </tr>
                {/* Desktop View Header */}
                <tr className="d-none d-md-table-row">
                  <th style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Product
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Vendor
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Date
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Amount
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Payment
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Status
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSlicedData()?.map((history) => (
                  <React.Fragment key={history._id || history.transaction_id}>
                    {/* Mobile Row */}
                    <tr
                      className="d-md-none"
                      style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-2">
                          {history?.products?.[0]?.image && (
                            <img
                              src={history.products[0].image}
                              alt={history.products[0].name}
                              style={{
                                width: "45px",
                                height: "45px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #e5e7eb",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div
                              className="fw-semibold text-truncate"
                              style={{ fontSize: "0.875rem" }}>
                              {history?.products?.[0]?.name || "N/A"}
                            </div>
                            {history?.products?.length > 1 && (
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}>
                                +{history.products.length - 1} more
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td
                        className="text-center"
                        style={{ fontSize: "0.75rem" }}>
                        {new Date(history?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="text-center">
                        <div className="d-flex flex-column gap-1 align-items-center">
                          {getPaymentStatus(history)}
                          {getStatusBadge(getDisplayStatus(history))}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-flex flex-column gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowMore(history)}
                            style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                            View
                          </Button>
                          {shouldShowPayButton(history) && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleInitiatePayment(history)}
                              style={{
                                fontSize: "0.75rem",
                                padding: "4px 8px",
                                backgroundColor: "#006747EB",
                                border: "none",
                              }}>
                              Pay
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Desktop Row */}
                    <tr
                      className="d-none d-md-table-row"
                      style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-3">
                          {history?.products?.[0]?.image && (
                            <img
                              src={history.products[0].image}
                              alt={history.products[0].name}
                              style={{
                                width: "55px",
                                height: "55px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div
                              className="fw-semibold"
                              style={{ fontSize: "0.875rem" }}>
                              {history?.products?.[0]?.name || "N/A"}
                            </div>
                            {history?.products?.length > 1 && (
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}>
                                +{history.products.length - 1} more items
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td
                        className="text-center"
                        style={{ fontSize: "0.875rem" }}>
                        {history?.vendor_name}
                      </td>
                      <td
                        className="text-center"
                        style={{ fontSize: "0.875rem" }}>
                        {new Date(history?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td
                        className="text-center fw-semibold"
                        style={{ fontSize: "0.875rem", color: "#006747EB" }}>
                        ₦{history?.transaction_total?.toLocaleString() || "N/A"}
                      </td>
                      <td className="text-center">
                        {getPaymentStatus(history)}
                      </td>
                      <td className="text-center">
                        {getStatusBadge(getDisplayStatus(history))}
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowMore(history)}
                            style={{
                              fontSize: "0.75rem",
                              padding: "6px 12px",
                            }}>
                            View Details
                          </Button>
                          {shouldShowPayButton(history) && (
                            <Button
                              size="sm"
                              onClick={() => handleInitiatePayment(history)}
                              className="border-0"
                              style={{
                                fontSize: "0.75rem",
                                padding: "6px 12px",
                                backgroundColor: "#006747EB",
                              }}>
                              <i className="bi bi-credit-card me-1"></i>
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4">
            <PaginationBar
              data={transactions?.transactions || []}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
            />
          </div>
        </>
      )}

      {/* Transaction Details Modal */}
      <Modal show={show} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton style={{ borderBottom: "2px solid #e5e7eb" }}>
          <Modal.Title
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#1a1a1a",
            }}>
            {selectedTransaction?.transaction_status === "inDispute"
              ? "Transaction & Dispute Details"
              : "Transaction Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {selectedTransaction ? (
            <>
              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <span
                      style={{
                        color: "#0f5132",
                        backgroundColor: "#d1e7dd",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "0.95rem",
                      }}>
                      <i className="bi bi-receipt me-2"></i>
                      Transaction Details
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <small
                          className="text-muted d-block mb-1"
                          style={{ fontSize: "0.75rem" }}>
                          Transaction ID
                        </small>
                        <span
                          className="fw-semibold"
                          style={{ fontSize: "0.875rem" }}>
                          {selectedTransaction?.transaction_id}
                        </span>
                      </div>
                      <div className="col-md-6">
                        <small
                          className="text-muted d-block mb-1"
                          style={{ fontSize: "0.75rem" }}>
                          Transaction Status
                        </small>
                        {getStatusBadge(getDisplayStatus(selectedTransaction))}
                      </div>
                      <div className="col-md-6">
                        <small
                          className="text-muted d-block mb-1"
                          style={{ fontSize: "0.75rem" }}>
                          Payment Status
                        </small>
                        {getPaymentStatus(selectedTransaction)}
                      </div>
                      <div className="col-md-6">
                        <small
                          className="text-muted d-block mb-1"
                          style={{ fontSize: "0.75rem" }}>
                          Purchase Date
                        </small>
                        <span style={{ fontSize: "0.875rem" }}>
                          {new Date(
                            selectedTransaction?.createdAt
                          ).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Vendor & Buyer Info */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div
                          className="p-3 rounded"
                          style={{ backgroundColor: "#f8f9fa" }}>
                          <h6
                            className="fw-bold mb-3"
                            style={{
                              fontSize: "0.875rem",
                              color: "#006747EB",
                            }}>
                            <i className="bi bi-shop me-2"></i>
                            Vendor Information
                          </h6>
                          <div className="mb-2">
                            <small
                              className="text-muted d-block"
                              style={{ fontSize: "0.75rem" }}>
                              Name
                            </small>
                            <span style={{ fontSize: "0.875rem" }}>
                              {selectedTransaction?.vendor_name}
                            </span>
                          </div>
                          <div className="mb-2">
                            <small
                              className="text-muted d-block"
                              style={{ fontSize: "0.75rem" }}>
                              Email
                            </small>
                            <span style={{ fontSize: "0.875rem" }}>
                              {selectedTransaction?.vendor_email}
                            </span>
                          </div>
                          <div>
                            <small
                              className="text-muted d-block"
                              style={{ fontSize: "0.75rem" }}>
                              Phone
                            </small>
                            <span style={{ fontSize: "0.875rem" }}>
                              {selectedTransaction?.vendor_phone_number}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div
                          className="p-3 rounded"
                          style={{ backgroundColor: "#f8f9fa" }}>
                          <h6
                            className="fw-bold mb-3"
                            style={{
                              fontSize: "0.875rem",
                              color: "#006747EB",
                            }}>
                            <i className="bi bi-person me-2"></i>
                            Buyer Information
                          </h6>
                          <div className="mb-2">
                            <small
                              className="text-muted d-block"
                              style={{ fontSize: "0.75rem" }}>
                              Email
                            </small>
                            <span style={{ fontSize: "0.875rem" }}>
                              {selectedTransaction?.buyer_email}
                            </span>
                          </div>
                          <div>
                            <small
                              className="text-muted d-block"
                              style={{ fontSize: "0.75rem" }}>
                              Delivery Address
                            </small>
                            <span style={{ fontSize: "0.875rem" }}>
                              {selectedTransaction?.delivery_address}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mb-4">
                      <h6
                        className="fw-bold mb-3"
                        style={{ fontSize: "0.95rem", color: "#006747EB" }}>
                        <i className="bi bi-box-seam me-2"></i>
                        Products ({selectedTransaction?.products?.length})
                      </h6>
                      {selectedTransaction?.products?.map((product, index) => (
                        <div
                          key={product._id || index}
                          className="border rounded p-3 mb-2"
                          style={{ backgroundColor: "#fafafa" }}>
                          <div className="d-flex gap-3 align-items-start">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "1px solid #e5e7eb",
                                  flexShrink: 0,
                                }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            )}
                            <div
                              className="flex-grow-1"
                              style={{ minWidth: 0 }}>
                              <h6
                                className="fw-semibold mb-2"
                                style={{ fontSize: "0.95rem" }}>
                                {product.name}
                              </h6>
                              {product.description && (
                                <p
                                  className="text-muted mb-2"
                                  style={{ fontSize: "0.8rem" }}>
                                  {product.description}
                                </p>
                              )}
                              <div
                                className="d-flex flex-wrap gap-3"
                                style={{ fontSize: "0.85rem" }}>
                                <span>
                                  <strong>Qty:</strong> {product.quantity}
                                </span>
                                <span>
                                  <strong>Price:</strong> ₦
                                  {product.price?.toLocaleString()}
                                </span>
                                <span className="text-success fw-semibold">
                                  <strong>Subtotal:</strong> ₦
                                  {(
                                    product.price * product.quantity
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Amount */}
                    <div
                      className="p-1 rounded"
                      style={{
                        backgroundColor: "#d1e7dd",
                        border: "2px solid #006747EB",
                      }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          className="fw-bold"
                          style={{ fontSize: "1.1rem", color: "#0f5132" }}>
                          Total Amount:
                        </span>
                        <span
                          className="fw-bold"
                          style={{ fontSize: "1.5rem", color: "#006747EB" }}>
                          ₦
                          {selectedTransaction?.transaction_total?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {/* Shipping Details Button - For Vendor after payment verification */}
                    {selectedTransaction?.verified_payment_status &&
                      userEmail === selectedTransaction?.vendor_email &&
                      !selectedTransaction?.shipping_submitted && (
                        <Link
                          to={`/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-details-form/${selectedTransaction?.transaction_id}`}
                          className="text-decoration-none">
                          <Button
                            className="w-auto mt-3 border-0"
                            style={{
                              backgroundColor: "#006747EB",
                              fontSize: "1rem",
                              fontWeight: "600",
                              padding: "12px",
                            }}>
                            <i className="bi bi-truck me-2"></i>
                            Fill Shipping Details
                          </Button>
                        </Link>
                      )}
                  </Accordion.Body>
                </Accordion.Item>

                {/* Dispute Details */}
                {selectedTransaction?.transaction_status === "inDispute" && (
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      <span
                        style={{
                          color: "#842029",
                          backgroundColor: "#f8d7da",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontWeight: "600",
                          fontSize: "0.95rem",
                        }}>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Dispute Details
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>
                      {disputeLoading ? (
                        <div className="text-center py-3">
                          <div
                            className="spinner-border spinner-border-sm text-danger"
                            role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-2 text-muted small">
                            Loading dispute details...
                          </p>
                        </div>
                      ) : disputeError ? (
                        <div className="alert alert-danger" role="alert">
                          <i className="bi bi-exclamation-circle me-2"></i>
                          Error loading disputes:{" "}
                          {disputeError?.data?.message || disputeError?.message}
                        </div>
                      ) : currentDispute ? (
                        <div>
                          <div className="mb-3">
                            <strong style={{ fontSize: "0.875rem" }}>
                              Reason for Dispute:
                            </strong>
                            <p
                              className="mt-1 mb-0"
                              style={{ fontSize: "0.875rem" }}>
                              {currentDispute?.reason_for_dispute || "N/A"}
                            </p>
                          </div>
                          <div>
                            <strong style={{ fontSize: "0.875rem" }}>
                              Dispute Description:
                            </strong>
                            <p
                              className="mt-1 mb-0"
                              style={{ fontSize: "0.875rem" }}>
                              {currentDispute?.dispute_description || "N/A"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted mb-0">
                          No dispute details available for this transaction.
                        </p>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                )}
              </Accordion>

              {/* Action Buttons */}
              <div className="mt-4">
                {/* Buyer/Vendor Actions - Processing State */}
                {selectedTransaction?.buyer_initiated &&
                  !selectedTransaction?.seller_confirmed &&
                  selectedTransaction?.transaction_status === "processing" && (
                    <div className="d-flex gap-2 flex-wrap">
                      {userEmail === selectedTransaction?.buyer_email && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setConfirmCancel(true)}
                          style={{ fontSize: "0.875rem" }}>
                          <i className="bi bi-x-circle me-1"></i>
                          Cancel Transaction
                        </Button>
                      )}
                      {userEmail === selectedTransaction?.vendor_email && (
                        <>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => setShowVendorConfirmModal(true)}
                            style={{ fontSize: "0.875rem" }}>
                            <i className="bi bi-check-circle me-1"></i>
                            Confirm Transaction
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() =>
                              handleRaiseDispute(selectedTransaction)
                            }
                            style={{ fontSize: "0.875rem" }}>
                            <i className="bi bi-flag me-1"></i>
                            Raise Dispute
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                {/* Payment Button */}
                {shouldShowPayButton(selectedTransaction) && (
                  <Button
                    size="lg"
                    onClick={() => handleInitiatePayment(selectedTransaction)}
                    className="w-100 border-0"
                    style={{
                      backgroundColor: "#006747EB",
                      fontSize: "1rem",
                      fontWeight: "600",
                      padding: "12px",
                    }}>
                    <i className="bi bi-credit-card me-2"></i>
                    Proceed to Payment - ₦
                    {selectedTransaction?.transaction_total?.toLocaleString()}
                  </Button>
                )}

                {/* Dispute Actions */}
                {selectedTransaction?.transaction_status === "inDispute" && (
                  <div className="d-flex gap-2 flex-wrap">
                    {userEmail === selectedTransaction?.buyer_email && (
                      <>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setConfirmCancel(true)}
                          style={{ fontSize: "0.875rem" }}>
                          Cancel Transaction
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() =>
                            handleResolveConflict(selectedTransaction)
                          }
                          style={{ fontSize: "0.875rem" }}>
                          Resolve Dispute
                        </Button>
                      </>
                    )}
                    {userEmail === selectedTransaction?.vendor_email && (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() =>
                          toast.info("Mediator has been involved!")
                        }
                        style={{ fontSize: "0.875rem" }}>
                        Involve Mediator
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-0">
                No transaction details available.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "2px solid #e5e7eb" }}>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            style={{ fontSize: "0.875rem", padding: "8px 20px" }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Modal */}
      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered>
        <Modal.Header closeButton style={{ borderBottom: "2px solid #e5e7eb" }}>
          <Modal.Title style={{ fontSize: "1.25rem", fontWeight: "700" }}>
            <i
              className="bi bi-credit-card me-2"
              style={{ color: "#006747EB" }}></i>
            Proceed to Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-4">
            <h5
              className="mb-4"
              style={{ fontWeight: "600", color: "#1a1a1a" }}>
              Transaction Summary
            </h5>
            <div
              className="mb-3 p-3 rounded"
              style={{ backgroundColor: "#f8f9fa" }}>
              <small
                className="text-muted d-block mb-2"
                style={{ fontSize: "0.75rem" }}>
                Transaction ID
              </small>
              <code
                style={{
                  fontSize: "0.875rem",
                  color: "#006747EB",
                  backgroundColor: "transparent",
                }}>
                {selectedTransaction?.transaction_id}
              </code>
            </div>
            <div className="mb-4">
              <small
                className="text-muted d-block mb-2"
                style={{ fontSize: "0.75rem" }}>
                Amount to Pay
              </small>
              <div
                className="fw-bold"
                style={{
                  fontSize: "2.5rem",
                  color: "#006747EB",
                  lineHeight: "1",
                }}>
                ₦{selectedTransaction?.transaction_total?.toLocaleString()}
              </div>
            </div>
            <div
              className="alert alert-info border-0"
              style={{ backgroundColor: "#e7f5f1" }}>
              <small style={{ color: "#006747EB" }}>
                <i className="bi bi-shield-check me-2"></i>
                You will be redirected to Paystack to complete your payment
                securely
              </small>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "2px solid #e5e7eb" }}>
          <Button
            variant="outline-secondary"
            onClick={() => setShowPaymentModal(false)}
            style={{ fontSize: "0.875rem", padding: "8px 20px" }}>
            Cancel
          </Button>
          <Button
            onClick={handleProceedToPaystack}
            className="border-0"
            style={{
              backgroundColor: "#006747EB",
              fontSize: "0.875rem",
              padding: "8px 24px",
              fontWeight: "600",
            }}>
            <i className="bi bi-arrow-right-circle me-2"></i>
            Proceed to Paystack
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Vendor Confirmation Modal */}
      <Modal
        show={showVendorConfirmModal}
        onHide={() => setShowVendorConfirmModal(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.125rem", fontWeight: "600" }}>
            Confirm Transaction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            Are you sure you want to confirm this transaction?
          </p>
          <p className="text-muted small mb-0">
            <i className="bi bi-info-circle me-1"></i>
            The buyer will be notified to proceed with payment.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            onClick={() => handleVendorConfirmTransaction(false)}
            style={{ fontSize: "0.875rem" }}>
            Decline
          </Button>
          <Button
            onClick={() => handleVendorConfirmTransaction(true)}
            className="border-0"
            style={{
              backgroundColor: "#006747EB",
              fontSize: "0.875rem",
            }}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        show={confirmCancel}
        onHide={() => setConfirmCancel(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.125rem", fontWeight: "600" }}>
            <i className="bi bi-exclamation-triangle me-2 text-danger"></i>
            Cancel Transaction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            Are you sure you want to cancel this transaction?
          </p>
          <div className="alert alert-danger border-0" role="alert">
            <small>
              <i className="bi bi-info-circle me-1"></i>
              This action cannot be undone.
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmCancel(false)}
            style={{ fontSize: "0.875rem" }}>
            No, Keep Transaction
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelTransaction}
            style={{ fontSize: "0.875rem" }}>
            Yes, Cancel Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export const RecentTransactionTableData = ({
  product_name,
  vendor_name,
  createdAt,
  transaction_status,
  onViewMore,
}) => {
  return (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
      <td className="py-3">{product_name}</td>
      <td className="text-center">{vendor_name}</td>
      <td className="text-center">{createdAt?.slice(0, 10)}</td>
      <td className="text-center">{getStatusBadge(transaction_status)}</td>
      <td className="text-center">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={onViewMore}
          style={{ fontSize: "0.75rem", padding: "6px 12px" }}>
          View Details
        </Button>
      </td>
    </tr>
  );
};

export default UserTransactionHistory;
