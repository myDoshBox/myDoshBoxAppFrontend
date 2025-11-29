// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { PaginationBar } from "../../../components/PaginationComponent";
// import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
// import { Link, useNavigate } from "react-router-dom";
// import { Button, Modal, Badge } from "react-bootstrap";
// import {
//   useBuyerConfirmsProductMutation,
//   useFetchAllShippingDetailsQuery,
// } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
// import { useSelector } from "react-redux";

// // ========================================
// // HELPER FUNCTIONS - CONSISTENT BADGE SYSTEM
// // ========================================

// const getStatusBadge = (status) => {
//   const statusConfig = {
//     processing: {
//       variant: "secondary",
//       bg: "#6c757d",
//       text: "Processing",
//     },
//     awaiting_payment: {
//       variant: "warning",
//       bg: "#ffc107",
//       text: "Awaiting Payment",
//     },
//     payment_verified: {
//       variant: "info",
//       bg: "#0dcaf0",
//       text: "Payment Verified",
//     },
//     awaiting_shipping: {
//       variant: "warning",
//       bg: "#ffc107",
//       text: "Awaiting Shipping",
//     },
//     in_transit: {
//       variant: "primary",
//       bg: "#0d6efd",
//       text: "In Transit",
//     },
//     completed: {
//       variant: "success",
//       bg: "#198754",
//       text: "Completed",
//     },
//     cancelled: {
//       variant: "danger",
//       bg: "#dc3545",
//       text: "Cancelled",
//     },
//     inDispute: {
//       variant: "danger",
//       bg: "#dc3545",
//       text: "In Dispute",
//     },
//   };

//   const config = statusConfig[status] || {
//     variant: "secondary",
//     bg: "#6c757d",
//     text: status || "Unknown",
//   };

//   return (
//     <Badge
//       bg={config.variant}
//       style={{
//         fontSize: "0.75rem",
//         fontWeight: "500",
//         padding: "4px 8px",
//       }}>
//       {config.text}
//     </Badge>
//   );
// };

// // ========================================
// // MAIN COMPONENT
// // ========================================

// const ShippingDetailsHistory = () => {
//   return (
//     <div
//       className="container-fluid px-0"
//       style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
//       <div className="row g-0">
//         <div className="col-12">
//           <UserDashboardNavbar />
//           <div className="px-3 px-lg-4 py-2">
//             <RecentTransactionTable />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ========================================
// // SHIPPING DETAILS TABLE COMPONENT
// // ========================================

// export const RecentTransactionTable = () => {
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const userEmail =
//     userInfo?.user?.email ||
//     userInfo?.email ||
//     userInfo?.organization_email ||
//     userInfo?.userInfo?.email;

//   const {
//     data: shippingDetails,
//     error,
//     isLoading,
//     refetch,
//   } = useFetchAllShippingDetailsQuery(userEmail, {
//     refetchOnMountOrArgChange: true,
//   });

//   const [buyerConfirmProduct] = useBuyerConfirmsProductMutation();

//   const itemsPerPage = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [selectedShipping, setSelectedShipping] = useState(null);
//   const [show, setShow] = useState(false);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   console.log(selectedShipping, "selectedShipping");

//   const navigate = useNavigate();

//   const fetchedTransactions = shippingDetails?.transactions;

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleShowMore = (shipping) => {
//     setSelectedShipping(shipping);
//     setShow(true);
//   };

//   const handleShowVerification = (shipping) => {
//     setSelectedShipping(shipping);
//     setShowVerifyModal(true);
//   };

//   const handleCloseModal = () => {
//     setShow(false);
//     setSelectedShipping(null);
//   };

//   const handleCloseVerifyModal = () => {
//     setShowVerifyModal(false);
//     setSelectedShipping(null);
//   };

//   const handleConfirmProduct = async (e) => {
//     e.preventDefault();
//     if (!selectedShipping) return;

//     try {
//       toast.info("Confirming product receipt...", { autoClose: 2000 });

//       await buyerConfirmProduct(
//         selectedShipping?.product?.transaction_id
//       ).unwrap();

//       toast.success("Product confirmed successfully!");
//       setShowVerifyModal(false);
//       setSelectedShipping(null);
//       refetch();
//       navigate(
//         "/userdashboard/transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
//       );
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to confirm product");
//     }
//   };

//   const getSlicedData = () => {
//     if (!fetchedTransactions?.length) return [];
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return fetchedTransactions?.slice(startIndex, startIndex + itemsPerPage);
//   };

//   const shouldShowVerifyButton = (shipping) => {
//     return (
//       userEmail === shipping?.buyer_email &&
//       shipping?.buyer_email !== shipping?.vendor_email &&
//       shipping?.product?.transaction_status === "in_transit"
//     );
//   };

//   return (
//     <div className="bg-white rounded-1 p-3 w-100">
//       {/* Header */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
//         <h3 className="fs-5 m-0 fw-bold" style={{ color: "#1a1a1a" }}>
//           All Shipping Details
//         </h3>
//         <div className="d-flex gap-2 flex-wrap">
//           <Link to="../initiate-escrow" className="text-decoration-none">
//             <Button
//               className="border-0 rounded-1 text-white"
//               style={{
//                 backgroundColor: "#006747EB",
//                 fontSize: "0.875rem",
//                 padding: "8px 16px",
//               }}>
//               <i className="bi bi-plus-circle me-2"></i>
//               Create Transaction
//             </Button>
//           </Link>
//           <Button
//             variant="outline-success"
//             className="rounded-1"
//             style={{
//               fontSize: "0.875rem",
//               padding: "8px 16px",
//               borderColor: "#006747EB",
//               color: "#006747EB",
//             }}>
//             <i className="bi bi-download me-2"></i>
//             Download Slip
//           </Button>
//         </div>
//       </div>

//       {/* Loading State */}
//       {isLoading && (
//         <div className="text-center py-5">
//           <div
//             className="spinner-border"
//             style={{ color: "#006747EB" }}
//             role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3 text-muted">Loading shipping details...</p>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="alert alert-danger" role="alert">
//           <i className="bi bi-exclamation-triangle me-2"></i>
//           Failed to load shipping details. Please try again.
//         </div>
//       )}

//       {/* Empty State */}
//       {!isLoading && !error && getSlicedData()?.length === 0 && (
//         <div className="text-center py-5">
//           <i
//             className="bi bi-box-seam"
//             style={{ fontSize: "3rem", color: "#6c757d" }}></i>
//           <p className="mt-3 text-muted">No shipping details found</p>
//           <Link to="../initiate-escrow">
//             <Button
//               style={{ backgroundColor: "#006747EB" }}
//               className="border-0">
//               Create Your First Transaction
//             </Button>
//           </Link>
//         </div>
//       )}

//       {/* Shipping Details Table */}
//       {!isLoading && !error && getSlicedData()?.length > 0 && (
//         <>
//           <div className="table-responsive" style={{ overflowX: "auto" }}>
//             <table className="table table-hover align-middle">
//               <thead
//                 style={{
//                   backgroundColor: "#f8f9fa",
//                   borderBottom: "2px solid #dee2e6",
//                 }}>
//                 {/* Mobile View Header */}
//                 <tr className="d-md-none">
//                   <th style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Shipping Info
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Date
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Status
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Actions
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Action
//                   </th>
//                 </tr>
//                 {/* Desktop View Header */}
//                 <tr className="d-none d-md-table-row">
//                   <th style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Transaction ID
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Shipping Company
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Delivery Person
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Contact
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Delivery Date
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Status
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     View
//                   </th>
//                   <th
//                     className="text-center"
//                     style={{ fontSize: "0.875rem", fontWeight: "600" }}>
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {getSlicedData()?.map((shipping) => (
//                   <React.Fragment key={shipping._id}>
//                     {/* Mobile Row */}
//                     <tr
//                       className="d-md-none"
//                       style={{ borderBottom: "1px solid #f0f0f0" }}>
//                       <td className="py-3">
//                         <div style={{ fontSize: "0.875rem" }}>
//                           <div className="fw-semibold mb-1">
//                             {shipping?.shipping_company}
//                           </div>
//                           <small
//                             className="text-muted"
//                             style={{ fontSize: "0.75rem" }}>
//                             {shipping?.delivery_person_name}
//                           </small>
//                         </div>
//                       </td>
//                       <td
//                         className="text-center"
//                         style={{ fontSize: "0.75rem" }}>
//                         {new Date(shipping?.delivery_date).toLocaleDateString(
//                           "en-US",
//                           {
//                             month: "short",
//                             day: "numeric",
//                           }
//                         )}
//                       </td>
//                       <td className="text-center">
//                         {getStatusBadge(shipping?.product?.transaction_status)}
//                       </td>

//                       <td className="text-center">
//                         <div className="d-flex gap-2 justify-content-center flex-wrap">
//                           <Button
//                             variant="outline-primary"
//                             size="sm"
//                             onClick={() => handleShowMore(shipping)}
//                             style={{
//                               fontSize: "0.75rem",
//                               padding: "6px 12px",
//                             }}>
//                             View Details
//                           </Button>
//                         </div>
//                       </td>
//                       <td>
//                         {shouldShowVerifyButton(shipping) && (
//                           <Button
//                             size="sm"
//                             onClick={() => handleShowVerification(shipping)}
//                             className="border-0"
//                             style={{
//                               fontSize: "0.75rem",
//                               padding: "6px 12px",
//                               backgroundColor: "#006747EB",
//                             }}>
//                             <i className="bi bi-check-circle me-1"></i>
//                             Verify Product
//                           </Button>
//                         )}
//                       </td>
//                     </tr>

//                     {/* Desktop Row */}
//                     <tr
//                       className="d-none d-md-table-row"
//                       style={{ borderBottom: "1px solid #f0f0f0" }}>
//                       <td className="py-3">
//                         <code
//                           style={{
//                             fontSize: "0.75rem",
//                             color: "#006747EB",
//                             backgroundColor: "#e7f5f1",
//                             padding: "4px 8px",
//                             borderRadius: "4px",
//                           }}>
//                           {shipping?.product?.transaction_id?.slice(0, 15)}...
//                         </code>
//                       </td>
//                       <td
//                         className="text-center fw-semibold"
//                         style={{ fontSize: "0.875rem" }}>
//                         <i className="bi bi-truck me-2 text-primary"></i>
//                         {shipping?.shipping_company}
//                       </td>
//                       <td
//                         className="text-center"
//                         style={{ fontSize: "0.875rem" }}>
//                         {shipping?.delivery_person_name}
//                       </td>
//                       <td
//                         className="text-center"
//                         style={{ fontSize: "0.875rem" }}>
//                         <i className="bi bi-telephone me-1"></i>
//                         {shipping?.delivery_person_number}
//                       </td>
//                       <td
//                         className="text-center"
//                         style={{ fontSize: "0.875rem" }}>
//                         {new Date(shipping?.delivery_date).toLocaleDateString(
//                           "en-US",
//                           {
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                           }
//                         )}
//                       </td>

//                       <td className="text-center">
//                         {getStatusBadge(shipping?.product?.transaction_status)}
//                       </td>
//                       <td className="text-center">
//                         <div className="d-flex gap-2 justify-content-center flex-wrap">
//                           <Button
//                             variant="outline-primary"
//                             size="sm"
//                             onClick={() => handleShowMore(shipping)}
//                             style={{
//                               fontSize: "0.75rem",
//                               padding: "6px 12px",
//                             }}>
//                             View Details
//                           </Button>
//                         </div>
//                       </td>
//                       <td>
//                         {shouldShowVerifyButton(shipping) && (
//                           <Button
//                             size="sm"
//                             onClick={() => handleShowVerification(shipping)}
//                             className="border-0"
//                             style={{
//                               fontSize: "0.75rem",
//                               padding: "6px 12px",
//                               backgroundColor: "#006747EB",
//                             }}>
//                             <i className="bi bi-check-circle me-1"></i>
//                             Verify Product
//                           </Button>
//                         )}
//                       </td>
//                     </tr>
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="mt-4">
//             <PaginationBar
//               data={fetchedTransactions || []}
//               currentPage={currentPage}
//               handlePageChange={handlePageChange}
//               itemsPerPage={itemsPerPage}
//               totalPages={totalPages}
//               setTotalPages={setTotalPages}
//             />
//           </div>
//         </>
//       )}

//       {/* Shipping Details Modal */}
//       <Modal show={show} onHide={handleCloseModal} size="lg" centered>
//         <Modal.Header closeButton style={{ borderBottom: "2px solid #e5e7eb" }}>
//           <Modal.Title
//             style={{
//               fontSize: "1.25rem",
//               fontWeight: "700",
//               color: "#1a1a1a",
//             }}>
//             <i
//               className="bi bi-box-seam me-2"
//               style={{ color: "#006747EB" }}></i>
//             Shipping Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
//           {selectedShipping ? (
//             <>
//               {/* Transaction Info */}
//               <div className="mb-4">
//                 <h6
//                   className="fw-bold mb-3 pb-2"
//                   style={{
//                     fontSize: "0.95rem",
//                     color: "#006747EB",
//                     borderBottom: "2px solid #e5e7eb",
//                   }}>
//                   <i className="bi bi-receipt me-2"></i>
//                   Transaction Information
//                 </h6>
//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <small
//                       className="text-muted d-block mb-1"
//                       style={{ fontSize: "0.75rem" }}>
//                       Transaction ID
//                     </small>
//                     <code
//                       style={{
//                         fontSize: "0.75rem",
//                         color: "#006747EB",
//                         backgroundColor: "#e7f5f1",
//                         padding: "4px 8px",
//                         borderRadius: "4px",
//                       }}>
//                       {selectedShipping?.product?.transaction_id}
//                     </code>
//                   </div>
//                   <div className="col-md-6">
//                     <small
//                       className="text-muted d-block mb-1"
//                       style={{ fontSize: "0.75rem" }}>
//                       Transaction Status
//                     </small>
//                     {getStatusBadge(
//                       selectedShipping?.product?.transaction_status
//                     )}
//                   </div>
//                 </div>
//               </div>
//               {/* Shipping Information */}
//               <div className="mb-4">
//                 <h6
//                   className="fw-bold mb-3 pb-2"
//                   style={{
//                     fontSize: "0.95rem",
//                     color: "#006747EB",
//                     borderBottom: "2px solid #e5e7eb",
//                   }}>
//                   <i className="bi bi-truck me-2"></i>
//                   Shipping Information
//                 </h6>
//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <div
//                       className="p-3 rounded"
//                       style={{ backgroundColor: "#f8f9fa" }}>
//                       <div className="mb-2">
//                         <small
//                           className="text-muted d-block"
//                           style={{ fontSize: "0.75rem" }}>
//                           Shipping Company
//                         </small>
//                         <span
//                           className="fw-semibold"
//                           style={{ fontSize: "0.875rem" }}>
//                           {selectedShipping?.shipping_company}
//                         </span>
//                       </div>
//                       <div className="mb-2">
//                         <small
//                           className="text-muted d-block"
//                           style={{ fontSize: "0.75rem" }}>
//                           Delivery Person
//                         </small>
//                         <span style={{ fontSize: "0.875rem" }}>
//                           {selectedShipping?.delivery_person_name}
//                         </span>
//                       </div>
//                       <div>
//                         <small
//                           className="text-muted d-block"
//                           style={{ fontSize: "0.75rem" }}>
//                           Contact Number
//                         </small>
//                         <span style={{ fontSize: "0.875rem" }}>
//                           {selectedShipping?.delivery_person_number}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div
//                       className="p-3 rounded"
//                       style={{ backgroundColor: "#f8f9fa" }}>
//                       <div className="mb-2">
//                         <small
//                           className="text-muted d-block"
//                           style={{ fontSize: "0.75rem" }}>
//                           Delivery Date
//                         </small>
//                         <span
//                           className="fw-semibold"
//                           style={{ fontSize: "0.875rem" }}>
//                           {new Date(
//                             selectedShipping?.delivery_date
//                           ).toLocaleDateString("en-US", {
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                           })}
//                         </span>
//                       </div>
//                       <div className="mb-2">
//                         <small
//                           className="text-muted d-block"
//                           style={{ fontSize: "0.75rem" }}>
//                           Pick Up Address
//                         </small>
//                         <span style={{ fontSize: "0.875rem" }}>
//                           {selectedShipping?.pick_up_address}
//                         </span>
//                       </div>
//                       <div>
//                         <small
//                           className="text-muted d-block"
//                           style={{ fontSize: "0.75rem" }}>
//                           Delivery Address
//                         </small>
//                         <span style={{ fontSize: "0.875rem" }}>
//                           {selectedShipping?.product?.delivery_address}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Product Details */}
//               <div className="mb-4">
//                 <h6
//                   className="fw-bold mb-3 pb-2"
//                   style={{
//                     fontSize: "0.95rem",
//                     color: "#006747EB",
//                     borderBottom: "2px solid #e5e7eb",
//                   }}>
//                   <i className="bi bi-box-seam me-2"></i>
//                   Product Details
//                 </h6>
//                 {selectedShipping?.product?.products?.length > 0 ? (
//                   <div className="row g-3">
//                     {selectedShipping.product.products.map((product, index) => (
//                       <div key={product._id || index} className="col-12">
//                         <div
//                           className="d-flex gap-3 p-3 rounded"
//                           style={{
//                             backgroundColor: "#f8f9fa",
//                             border: "1px solid #e5e7eb",
//                           }}>
//                           {/* Product Image */}
//                           {product.image && (
//                             <div style={{ flexShrink: 0 }}>
//                               <img
//                                 src={product.image}
//                                 alt={product.name}
//                                 style={{
//                                   width: "80px",
//                                   height: "80px",
//                                   objectFit: "cover",
//                                   borderRadius: "8px",
//                                   border: "1px solid #dee2e6",
//                                 }}
//                               />
//                             </div>
//                           )}

//                           {/* Product Info */}
//                           <div className="flex-grow-1">
//                             <div className="mb-2">
//                               <span
//                                 className="fw-semibold d-block"
//                                 style={{
//                                   fontSize: "0.95rem",
//                                   color: "#1a1a1a",
//                                 }}>
//                                 {product.name}
//                               </span>
//                               <small
//                                 className="text-muted"
//                                 style={{ fontSize: "0.75rem" }}>
//                                 {product.description}
//                               </small>
//                             </div>

//                             <div className="d-flex flex-wrap gap-3 mt-2">
//                               <div>
//                                 <small
//                                   className="text-muted d-block"
//                                   style={{ fontSize: "0.7rem" }}>
//                                   Quantity
//                                 </small>
//                                 <span
//                                   className="fw-semibold"
//                                   style={{ fontSize: "0.875rem" }}>
//                                   {product.quantity}
//                                 </span>
//                               </div>
//                               <div>
//                                 <small
//                                   className="text-muted d-block"
//                                   style={{ fontSize: "0.7rem" }}>
//                                   Unit Price
//                                 </small>
//                                 <span
//                                   className="fw-semibold"
//                                   style={{ fontSize: "0.875rem" }}>
//                                   ₦{product.price?.toLocaleString()}
//                                 </span>
//                               </div>
//                               <div>
//                                 <small
//                                   className="text-muted d-block"
//                                   style={{ fontSize: "0.7rem" }}>
//                                   Subtotal
//                                 </small>
//                                 <span
//                                   className="fw-semibold text-success"
//                                   style={{ fontSize: "0.875rem" }}>
//                                   ₦
//                                   {(
//                                     product.price * product.quantity
//                                   )?.toLocaleString()}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     {/* Transaction Total */}
//                     <div className="col-12">
//                       <div
//                         className="d-flex justify-content-between align-items-center p-3 rounded"
//                         style={{ backgroundColor: "#e7f5f1" }}>
//                         <span
//                           className="fw-bold"
//                           style={{ fontSize: "0.95rem" }}>
//                           Transaction Total:
//                         </span>
//                         <span
//                           className="fw-bold"
//                           style={{ fontSize: "1.1rem", color: "#006747EB" }}>
//                           ₦
//                           {selectedShipping?.product?.transaction_total?.toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <p
//                     className="text-muted mb-0"
//                     style={{ fontSize: "0.875rem" }}>
//                     No product details available
//                   </p>
//                 )}
//               </div>
//               {/* Vendor Information */}
//               <div className="mb-4">
//                 <h6
//                   className="fw-bold mb-3 pb-2"
//                   style={{
//                     fontSize: "0.95rem",
//                     color: "#006747EB",
//                     borderBottom: "2px solid #e5e7eb",
//                   }}>
//                   <i className="bi bi-shop me-2"></i>
//                   Vendor Information
//                 </h6>
//                 <div
//                   className="p-3 rounded"
//                   style={{ backgroundColor: "#f8f9fa" }}>
//                   <div className="row g-2">
//                     <div className="col-md-6">
//                       <small
//                         className="text-muted d-block"
//                         style={{ fontSize: "0.75rem" }}>
//                         Vendor Name
//                       </small>
//                       <span
//                         className="fw-semibold"
//                         style={{ fontSize: "0.875rem" }}>
//                         {selectedShipping?.product?.vendor_name ||
//                           selectedShipping?.vendor_name}
//                       </span>
//                     </div>
//                     <div className="col-md-6">
//                       <small
//                         className="text-muted d-block"
//                         style={{ fontSize: "0.75rem" }}>
//                         Contact Email
//                       </small>
//                       <span style={{ fontSize: "0.875rem" }}>
//                         {selectedShipping?.product?.vendor_email ||
//                           selectedShipping?.vendor_email}
//                       </span>
//                     </div>
//                     {(selectedShipping?.product?.vendor_phone_number ||
//                       selectedShipping?.vendor_phone_number) && (
//                       <div className="col-md-6">
//                         <small
//                           className="text-muted d-block"
//                           style={{ fontSize: "0.75rem" }}>
//                           Phone Number
//                         </small>
//                         <span style={{ fontSize: "0.875rem" }}>
//                           {selectedShipping?.product?.vendor_phone_number ||
//                             selectedShipping?.vendor_phone_number}
//                         </span>
//                       </div>
//                     )}
//                     <div className="col-md-6">
//                       <small
//                         className="text-muted d-block"
//                         style={{ fontSize: "0.75rem" }}>
//                         Payment Status
//                       </small>
//                       {selectedShipping?.product?.verified_payment_status ? (
//                         <Badge bg="success" style={{ fontSize: "0.75rem" }}>
//                           <i className="bi bi-check-circle me-1"></i>
//                           Paid
//                         </Badge>
//                       ) : (
//                         <Badge bg="warning" style={{ fontSize: "0.75rem" }}>
//                           Pending
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* Timeline */}
//               <div className="mb-4">
//                 <h6
//                   className="fw-bold mb-3 pb-2"
//                   style={{
//                     fontSize: "0.95rem",
//                     color: "#006747EB",
//                     borderBottom: "2px solid #e5e7eb",
//                   }}>
//                   <i className="bi bi-clock-history me-2"></i>
//                   Timeline
//                 </h6>
//                 <div style={{ fontSize: "0.875rem" }}>
//                   <div className="mb-2">
//                     <strong>Purchase Date:</strong>{" "}
//                     {new Date(
//                       selectedShipping?.product?.createdAt
//                     ).toLocaleString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </div>
//                 </div>

//                 <Link
//                   to={`/userdashboard/disputes/initiate-dispute/${selectedShipping?.product?.transaction_id}`}
//                   state={{ transaction: selectedShipping?.product }}
//                   className="btn btn-outline-danger"
//                   style={{ fontSize: "0.875rem" }}>
//                   <i className="bi bi-flag me-1"></i>
//                   Raise Dispute
//                 </Link>
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-4">
//               <p className="text-muted mb-0">No shipping details available.</p>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer style={{ borderTop: "2px solid #e5e7eb" }}>
//           <Button
//             variant="secondary"
//             onClick={handleCloseModal}
//             style={{ fontSize: "0.875rem", padding: "8px 20px" }}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Product Verification Modal */}
//       <Modal show={showVerifyModal} onHide={handleCloseVerifyModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title style={{ fontSize: "1.125rem", fontWeight: "600" }}>
//             <i
//               className="bi bi-check-circle me-2"
//               style={{ color: "#006747EB" }}></i>
//             Verify Product Receipt
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="text-center py-3">
//             <i
//               className="bi bi-box-seam"
//               style={{ fontSize: "3rem", color: "#006747EB" }}></i>
//             <p className="mt-3 mb-2" style={{ fontSize: "1rem" }}>
//               Are you satisfied with your order?
//             </p>
//             <p className="text-muted small">
//               If you are satisfied, click "Yes" to release payment to the
//               vendor. If not, click "No" to open a dispute.
//             </p>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Link
//             to={`/userdashboard/disputes/initiate-dispute/${selectedShipping?.product?.transaction_id}`}
//             state={{ transaction: selectedShipping?.product }}
//             className="btn btn-outline-danger"
//             style={{ fontSize: "0.875rem" }}>
//             <i className="bi bi-flag me-1"></i>
//             No, Open Dispute
//           </Link>
//           <Button
//             onClick={handleConfirmProduct}
//             className="border-0"
//             style={{
//               backgroundColor: "#006747EB",
//               fontSize: "0.875rem",
//               fontWeight: "600",
//             }}>
//             <i className="bi bi-check-circle me-1"></i>
//             Yes, I'm Satisfied
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ShippingDetailsHistory;

import React, { useState } from "react";
import { toast } from "react-toastify";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal, Badge, Card } from "react-bootstrap";
import {
  useBuyerConfirmsProductMutation,
  useFetchAllShippingDetailsQuery,
} from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
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

// ========================================
// MAIN COMPONENT
// ========================================

const ShippingDetailsHistory = () => {
  return (
    <div
      className="container-fluid px-0"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />
          <div className="px-3 px-lg-4 py-2">
            <RecentTransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// SHIPPING DETAILS TABLE COMPONENT
// ========================================

export const RecentTransactionTable = () => {
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

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const navigate = useNavigate();

  const fetchedTransactions = shippingDetails?.transactions;

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleShowVerification = (shipping) => {
    setSelectedShipping(shipping);
    setShowVerifyModal(true);
  };

  const handleCloseVerifyModal = () => {
    setShowVerifyModal(false);
    setSelectedShipping(null);
  };

  const handleConfirmProduct = async (e) => {
    e.preventDefault();
    if (!selectedShipping) return;

    try {
      toast.info("Confirming product receipt...", { autoClose: 2000 });

      await buyerConfirmProduct(
        selectedShipping?.product?.transaction_id
      ).unwrap();

      toast.success("Product confirmed successfully!");
      setShowVerifyModal(false);
      setSelectedShipping(null);
      refetch();
      navigate(
        "/userdashboard/transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
      );
    } catch (error) {
      toast.error(error?.data?.message || "Failed to confirm product");
    }
  };

  const getSlicedData = () => {
    if (!fetchedTransactions?.length) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return fetchedTransactions?.slice(startIndex, startIndex + itemsPerPage);
  };

  const shouldShowVerifyButton = (shipping) => {
    return (
      userEmail === shipping?.buyer_email &&
      shipping?.buyer_email !== shipping?.vendor_email &&
      shipping?.product?.transaction_status === "in_transit"
    );
  };

  // Mobile Card Component
  const MobileShippingCard = ({ shipping }) => (
    <Card className="mb-3 border-0 shadow-sm">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>
              <i className="bi bi-truck me-2 text-primary"></i>
              {shipping?.shipping_company}
            </h6>
            <code
              className="text-muted"
              style={{
                fontSize: "0.75rem",
                backgroundColor: "#f8f9fa",
                padding: "2px 6px",
                borderRadius: "3px",
              }}>
              {shipping?.product?.transaction_id}
            </code>
          </div>
          {getStatusBadge(shipping?.product?.transaction_status)}
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <i
              className="bi bi-calendar me-2 text-muted"
              style={{ fontSize: "0.8rem" }}></i>
            <small className="text-muted">Delivery Date:</small>
          </div>
          <div style={{ fontSize: "0.875rem", fontWeight: "500" }}>
            {new Date(shipping?.delivery_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="d-flex gap-2">
          <Link
            to={`/userdashboard/shipping-details/${shipping?._id}`}
            className="text-decoration-none flex-fill">
            <Button
              variant="outline-primary"
              size="sm"
              className="w-100"
              style={{ fontSize: "0.75rem" }}>
              <i className="bi bi-eye me-1"></i>
              View Details
            </Button>
          </Link>
          {shouldShowVerifyButton(shipping) && (
            <Button
              size="sm"
              onClick={() => handleShowVerification(shipping)}
              className="border-0 flex-fill"
              style={{
                fontSize: "0.75rem",
                backgroundColor: "#006747EB",
              }}>
              <i className="bi bi-check-circle me-1"></i>
              Verify
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="bg-white rounded-1 p-3 w-100">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h3 className="fs-5 m-0 fw-bold" style={{ color: "#1a1a1a" }}>
          All Shipping Details
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
            style={{ color: "#006747EB", width: "3rem", height: "3rem" }}
            role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted" style={{ fontSize: "0.95rem" }}>
            Loading shipping details...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && error.status !== 404 && (
        <div className="text-center py-5">
          <i
            className="bi bi-exclamation-triangle text-danger"
            style={{ fontSize: "3rem" }}></i>
          <p
            className="mt-3 text-danger fw-semibold"
            style={{ fontSize: "1rem" }}>
            Failed to load shipping details
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
      )}

      {/* Empty State */}
      {!isLoading && getSlicedData()?.length === 0 && (
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
              className="bi bi-box-seam"
              style={{ fontSize: "3.5rem", color: "#006747EB" }}></i>
          </div>
          <h5 className="fw-bold mb-2" style={{ color: "#1a1a1a" }}>
            No Shipping Details Found
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            No shipping information available yet. Create a transaction to get
            started.
          </p>
          <Link to="../initiate-escrow" className="text-decoration-none">
            <Button
              size="lg"
              className="border-0"
              style={{
                backgroundColor: "#006747EB",
                fontSize: "1rem",
                fontWeight: "600",
                padding: "12px 32px",
              }}>
              <i className="bi bi-plus-circle me-2"></i>
              Create Your First Transaction
            </Button>
          </Link>
        </div>
      )}

      {/* Shipping Details - MOBILE VIEW (Cards) */}
      {!isLoading && !error && getSlicedData()?.length > 0 && (
        <>
          {/* Mobile View - Cards */}
          <div className="d-block d-md-none">
            {getSlicedData()?.map((shipping) => (
              <MobileShippingCard key={shipping._id} shipping={shipping} />
            ))}
          </div>

          {/* Desktop View - Table with Horizontal Scroll */}
          <div className="d-none d-md-block">
            <div
              className="table-responsive"
              style={{
                overflowX: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "#006747EB #f8f9fa",
              }}>
              <table
                className="table table-hover align-middle mb-0"
                style={{
                  minWidth: "768px",
                  marginBottom: 0,
                }}>
                <thead
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderBottom: "2px solid #dee2e6",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}>
                  <tr>
                    <th
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        minWidth: "120px",
                      }}>
                      Transaction ID
                    </th>
                    <th
                      className="text-center"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        minWidth: "150px",
                      }}>
                      Shipping Company
                    </th>
                    <th
                      className="text-center"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        minWidth: "120px",
                      }}>
                      Delivery Date
                    </th>
                    <th
                      className="text-center"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        minWidth: "100px",
                      }}>
                      Status
                    </th>
                    <th
                      className="text-center"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        minWidth: "150px",
                      }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSlicedData()?.map((shipping) => (
                    <tr
                      key={shipping._id}
                      style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td className="py-3" style={{ minWidth: "120px" }}>
                        <code
                          style={{
                            fontSize: "0.75rem",
                            color: "#006747EB",
                            backgroundColor: "#e7f5f1",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            display: "inline-block",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={shipping?.product?.transaction_id}>
                          {shipping?.product?.transaction_id?.slice(0, 12)}...
                        </code>
                      </td>
                      <td
                        className="text-center fw-semibold"
                        style={{
                          fontSize: "0.875rem",
                          whiteSpace: "nowrap",
                          minWidth: "150px",
                        }}>
                        <i className="bi bi-truck me-2 text-primary"></i>
                        {shipping?.shipping_company}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          fontSize: "0.875rem",
                          whiteSpace: "nowrap",
                          minWidth: "120px",
                        }}>
                        {new Date(shipping?.delivery_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="text-center" style={{ minWidth: "100px" }}>
                        {getStatusBadge(shipping?.product?.transaction_status)}
                      </td>
                      <td className="text-center" style={{ minWidth: "150px" }}>
                        <div className="d-flex gap-2 justify-content-center flex-nowrap">
                          <Link
                            to={`/userdashboard/transaction-history/shipping-details-page/${shipping?._id}`}
                            className="text-decoration-none">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              style={{
                                fontSize: "0.75rem",
                                padding: "6px 12px",
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}>
                              <i className="bi bi-eye me-1"></i>
                              View Details
                            </Button>
                          </Link>
                          {shouldShowVerifyButton(shipping) && (
                            <Button
                              size="sm"
                              onClick={() => handleShowVerification(shipping)}
                              className="border-0"
                              style={{
                                fontSize: "0.75rem",
                                padding: "6px 12px",
                                backgroundColor: "#006747EB",
                                whiteSpace: "nowrap",
                                minWidth: "110px",
                              }}>
                              <i className="bi bi-check-circle me-1"></i>
                              Verify Product
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4">
            <PaginationBar
              data={fetchedTransactions || []}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
            />
          </div>
        </>
      )}

      {/* Product Verification Modal */}
      <Modal show={showVerifyModal} onHide={handleCloseVerifyModal} centered>
        <Modal.Header closeButton style={{ borderBottom: "2px solid #e5e7eb" }}>
          <Modal.Title style={{ fontSize: "1.125rem", fontWeight: "600" }}>
            <i
              className="bi bi-check-circle me-2"
              style={{ color: "#006747EB" }}></i>
            Verify Product Receipt
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <i
              className="bi bi-box-seam"
              style={{ fontSize: "3rem", color: "#006747EB" }}></i>
            <p className="mt-3 mb-2" style={{ fontSize: "1rem" }}>
              Are you satisfied with your order?
            </p>
            <p className="text-muted small">
              If you are satisfied, click "Yes" to release payment to the
              vendor. If not, click "No" to open a dispute.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "2px solid #e5e7eb" }}>
          <Link
            to={`/userdashboard/disputes/initiate-dispute/${selectedShipping?.product?.transaction_id}`}
            state={{ transaction: selectedShipping?.product }}
            className="btn btn-outline-danger"
            style={{ fontSize: "0.875rem", padding: "8px 20px" }}>
            <i className="bi bi-flag me-1"></i>
            No, Open Dispute
          </Link>
          <Button
            onClick={handleConfirmProduct}
            className="border-0"
            style={{
              backgroundColor: "#006747EB",
              fontSize: "0.875rem",
              fontWeight: "600",
              padding: "8px 20px",
            }}>
            <i className="bi bi-check-circle me-1"></i>
            Yes, I'm Satisfied
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShippingDetailsHistory;
