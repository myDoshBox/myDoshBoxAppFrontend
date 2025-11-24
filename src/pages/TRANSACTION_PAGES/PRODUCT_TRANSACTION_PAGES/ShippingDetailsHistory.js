// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import TransactionData from "../../../data/dummyData/transactionData.json";
// import { PaginationBar } from "../../../components/PaginationComponent";
// import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button, Modal } from "react-bootstrap";
// import Dropdown from "react-bootstrap/Dropdown";
// import buyerImage from "../../../images/transact_person.png";
// import {
//   useBuyerConfirmsProductMutation,
//   useFetchSingleTransactionsQuery,
// } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
// import { useVerifyEscrowProductTransactionPaymentMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";

// import { useFetchAllShippingDetailsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
// import { useSelector } from "react-redux";

// const ShippingDetailsHistory = () => {
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
//   // user detail for single user
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const userEmail =
//     userInfo?.user?.email ||
//     userInfo?.email ||
//     userInfo?.organization_email ||
//     userInfo?.userInfo?.email;
//   // transaction detail for single user
//   // const { escrowProductInfo } = useSelector((state) => state.escrowProductInfo);
//   // const transactionId = escrowProductInfo;

//   // console.log("transactionId", transactionId);

//   const {
//     data: shippingDetails,
//     error,
//     isLoading,
//   } = useFetchAllShippingDetailsQuery(userEmail, {
//     refetchOnMountOrArgChange: true,
//   });

//   console.log("shippingDetails", shippingDetails?.transactions);
//   // console.log("transactions_ss", transactions?.transactions);
//   // console.log("error", error);

//   const dropdownBtnValues = [
//     { label: "All Data", value_1: "Last 7 days", value_2: "Over $1000" },
//     { label: "2021", value_1: "2022", value_2: "2023" },
//   ];

//   const itemsPerPage = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   // const [selectedTransaction, setSelectedTransaction] = useState(null); // For modal
//   const [selectedTransaction, setSelectedTransaction] = useState(null); // For modal
//   const [show, setShow] = useState(false);
//   const [display, setDisplay] = useState(false);

//   // const location = useLocation();

//   // transactions fetched
//   const fetchedTransactions = shippingDetails?.transactions;
//   // console.log("fetchedTransactions", fetchedTransactions);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleShowMore = (transactionId) => {
//     // const selectedTransaction = fetchedTransactions?.find(
//     //   (transaction) => transaction.id === transactionId
//     // );
//     setSelectedTransaction(transactionId);
//     setShow(true);

//     // console.log("selectedTransaction", selectedTransaction);
//     // console.log("transactionid", transactionId);
//   };

//   const handleShowProductVerification = (transactionId) => {
//     // const selectedTransaction = fetchedTransactions?.find(
//     //   (transaction) => transaction.id === transactionId
//     // );
//     setSelectedTransaction(transactionId);
//     setDisplay(true);

//     // console.log("selectedTransaction", selectedTransaction);
//     // console.log("transactionid", transactionId);
//   };

//   const handleCloseModal = () => {
//     setShow(false);
//     setSelectedTransaction(null);
//   };

//   const handleClose = () => setShow(false);
//   const handleCloseDisplay = () => setDisplay(false);

//   const navigate = useNavigate();

//   const [buyerconfirmProduct, { data }] = useBuyerConfirmsProductMutation();

//   const handleSubmit = async (transaction_id, e) => {
//     e.preventDefault();

//     await buyerconfirmProduct(transaction_id)
//       .unwrap()
//       .then((res) => {
//         // console.log(res);
//         toast.success(res?.message);
//         navigate(
//           `/userdashboard/transaction-history/confirm-escrow-product-transaction/settled-transactions-history`
//         );
//       })
//       .catch((error) => {
//         toast.error(error?.data?.message);
//       });
//   };

//   const getSlicedData = () => {
//     if (!fetchedTransactions || fetchedTransactions?.length === 0) {
//       return []; // Return an empty array if there is no data
//     }

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     return fetchedTransactions?.slice(startIndex, endIndex);
//   };

//   // console.log("getSlicedData", getSlicedData());

//   // if (isLoading) return <p>Loading...</p>;
//   // if (error) return <p>Error loading transactions: {error?.data?.message}</p>;
//   // if (verifyingEscrow) return <h1>Loading...</h1>;
//   return (
//     <div className="bg-white rounded-1 p-3" style={{ width: "100%" }}>
//       <div>
//         <div className="d-md-flex justify-content-between align-items-center mb-3">
//           <h3 className="fs-6 m-0 mb-3 mb-md-0" style={{}}>
//             All Shipping Details
//           </h3>
//           <div className="d-flex">
//             {dropdownBtnValues.map((item) => {
//               return (
//                 <Dropdown>
//                   <Dropdown.Toggle
//                     id="dropdown-basic"
//                     className="border-1 border-gray my-1 rounded-1 btn bg-transparent text-black border-black me-3 fs-sm"
//                     style={{
//                       outline: "none",
//                       borderColor: "#E7E7E7",
//                     }}>
//                     {item.label}
//                   </Dropdown.Toggle>

//                   <Dropdown.Menu style={{ minWidth: "inherit" }}>
//                     <div key={item.label}>
//                       <Dropdown.Item className="fs-sm">
//                         {item.value_1}
//                       </Dropdown.Item>
//                       <Dropdown.Item className="fs-sm">
//                         {item.value_2}
//                       </Dropdown.Item>
//                     </div>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               );
//             })}
//             <Link to={"../initiate-escrow"} className="text-decoration-none">
//               <Button
//                 className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block me-3"
//                 style={{
//                   backgroundColor: "#006747EB",
//                 }}>
//                 Create Transaction
//               </Button>
//             </Link>

//             <Link to={"../initiate-escrow"} className="text-decoration-none">
//               <Button
//                 className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block"
//                 style={{
//                   backgroundColor: "#006747EB",
//                 }}>
//                 Download Transaction Slip
//               </Button>
//             </Link>
//           </div>
//         </div>

//         <table className="table fs-sm">
//           <thead>
//             <tr className="lightTextColor">
//               <th className="px-0 d-none d-md-table-cell">Transaction ID</th>
//               <th className="text-center d-none d-md-table-cell">
//                 Shipping Company
//               </th>
//               <th className="text-center d-none d-md-table-cell">
//                 Delivery Person Name
//               </th>
//               {/* <div className="d-flex justify-content-between align-items-center border-md-bottom"> */}
//               {/* <th className="text-center d-none d-md-table-cell">
//                   Purchase By
//                 </th> */}
//               {/* <th className="text-center d-none d-md-table-cell">
//                 Product Price
//               </th> */}
//               {/* </div> */}
//               {/* <th className="text-center d-none d-md-table-cell">Slip</th> */}
//               <th className="text-center d-none d-md-table-cell">
//                 Delivery Person Number
//               </th>
//               <th className="text-center d-none d-md-table-cell">
//                 Delivery Date
//               </th>
//               <th className="text-center d-none d-md-table-cell">
//                 Pick Up Address
//               </th>
//               <th className="text-center d-none d-md-table-cell">
//                 Transaction Status
//               </th>
//               <th className="text-center d-none d-md-table-cell">
//                 View Details
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Use the getSlicedData function to map over only the data for the current page */}
//             {getSlicedData()?.map((history) => {
//               return (
//                 <RecentTransactionTableData
//                   {...history}
//                   key={history.id}
//                   transaction_id={history?.product?.transaction_id}
//                   transaction_status={history?.product?.transaction_status}
//                   onViewMore={() => handleShowMore(history)}
//                   verifyProduct={() => handleShowProductVerification(history)}
//                   // onClick={console.log("hi")}
//                 />

//                 // <Button variant="primary" onClick={handleShow}>
//                 // </Button>
//               );
//             })}

//             {/* {console.log("gSD", getSlicedData())} */}
//           </tbody>
//         </table>
//         <PaginationBar
//           // data={TransactionData.user_recent_transaction}
//           data={fetchedTransactions || "no transactions"}
//           currentPage={currentPage}
//           handlePageChange={handlePageChange}
//           itemsPerPage={itemsPerPage}
//           totalPages={totalPages}
//           setTotalPages={setTotalPages}
//         />

//         {/* {console.log("ft", fetchedTransactions)} */}
//       </div>

//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Transaction Details</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Modal.Body>
//             {selectedTransaction ? (
//               <>
//                 <p>
//                   <strong>Transaction ID:</strong>{" "}
//                   {selectedTransaction?.product?.transaction_id}
//                 </p>

//                 <p>
//                   <strong>Product Name:</strong>{" "}
//                   {selectedTransaction?.product?.product_name}
//                 </p>

//                 <p>
//                   <strong>Shipping Company:</strong>{" "}
//                   {selectedTransaction?.shipping_company}
//                 </p>
//                 <p>
//                   <strong>Delivery Person Name:</strong>{" "}
//                   {selectedTransaction?.delivery_person_name}
//                 </p>
//                 <p>
//                   <strong>Delivery Person Number:</strong>{" "}
//                   {selectedTransaction?.delivery_person_number}
//                 </p>
//                 <p>
//                   <strong>Delivery Date:</strong>{" "}
//                   {selectedTransaction?.delivery_date}
//                 </p>
//                 <p>
//                   <strong>Pick Up Address:</strong>{" "}
//                   {selectedTransaction?.pick_up_address}
//                 </p>
//                 {/* <p>
//                   <strong>Transaction Total:</strong> ₦
//                   {selectedTransaction?.product?.transaction_total}
//                 </p> */}

//                 <p>
//                   <strong>Purchase Date:</strong>{" "}
//                   {selectedTransaction?.product.createdAt?.slice(0, 10)}
//                 </p>
//                 <p>
//                   <strong>Purchase Time:</strong>{" "}
//                   {selectedTransaction?.product?.createdAt?.slice(11, 19)}
//                 </p>

//                 <p>
//                   <strong>Delivery Address:</strong>{" "}
//                   {selectedTransaction?.product?.delivery_address}
//                 </p>
//                 <p>
//                   <strong>Transaction Status:</strong>{" "}
//                   {selectedTransaction?.product?.transaction_status}
//                 </p>
//               </>
//             ) : (
//               <p>No transaction details available.</p>
//             )}
//           </Modal.Body>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={display} onHide={handleCloseDisplay}>
//         <Modal.Header closeButton>
//           <Modal.Title>Verification of Product Received</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Modal.Body>
//             <p>
//               Are satisfied with your order? If you are, click yes, accept the
//               agreement so that the buyer can be paid. If not, click no and open
//               a dispute with the buyer
//             </p>
//           </Modal.Body>
//         </Modal.Body>
//         <Modal.Footer>
//           {/* <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button> */}
//           {/* redirect to dispute form */}
//           {/* <Link
//             variant="secondary"
//             className="GeneralBtnStyle1"
//             onClick={handleClose}
//           >
//             No, I will like to ope a dispute
//           </Link> */}

//           <Link
//             to={`/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-history/${selectedTransaction?.product?.transaction_id}/initiate-dispute`}
//             className="border-0 mt-3 btn text-white pale-red">
//             No, I will like to open a dispute
//           </Link>

//           {/* redirect to agreement page */}
//           <Button
//             className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
//             onClick={(e) =>
//               handleSubmit(selectedTransaction?.product?.transaction_id, e)
//             }>
//             Yes, I am satisfied
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export const RecentTransactionTableData = (props) => {
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const userEmail = userInfo?.user?.email;

//   const {
//     transaction_id,
//     shipping_company,
//     delivery_person_name,
//     delivery_person_number,
//     delivery_date,
//     pick_up_address,
//     transaction_status,
//     // product_name,
//     vendor_name,
//     vendor_email,
//     buyer_email,
//     createdAt,
//     // purchase_by,
//     product_price,
//     transaction_total,
//     // status,
//     // status_color,
//     // status_message,
//     transaction_type,
//     seller_confirm_status,
//     onViewMore,
//     verifyProduct,
//   } = props;

//   const navigate = useNavigate();

//   let maxWidth = window.innerWidth;

//   if (maxWidth < 250) {
//     maxWidth = "5rem";
//   } else if (maxWidth < 330) {
//     maxWidth = "9rem";
//   } else if (maxWidth < 450) {
//     maxWidth = "12rem";
//   }

//   const style = {
//     maxWidth,
//   };

//   return (
//     <>
//       <tr className="border-bottom">
//         <td className="border-0 border-md-bottom d-none d-md-table-cell py-md-3 px-0">
//           {transaction_id}
//         </td>
//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {shipping_company}
//         </td>
//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {delivery_person_name}
//         </td>
//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {delivery_person_number}
//         </td>
//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {delivery_date}
//         </td>
//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {pick_up_address}
//         </td>
//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {transaction_status}
//         </td>

//         {userEmail === buyer_email &&
//         buyer_email !== vendor_email &&
//         transaction_status === "processing" ? (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={verifyProduct}>
//               Verify Product
//             </Button>
//           </td>
//         ) : (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={onViewMore}>
//               View More
//             </Button>
//           </td>
//         )}
//       </tr>
//     </>
//   );
// };

// export default ShippingDetailsHistory;
import React, { useState } from "react";
import { toast } from "react-toastify";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal, Badge } from "react-bootstrap";
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
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [show, setShow] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  console.log(selectedShipping, "selectedShipping");

  const navigate = useNavigate();

  const fetchedTransactions = shippingDetails?.transactions;

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleShowMore = (shipping) => {
    setSelectedShipping(shipping);
    setShow(true);
  };

  const handleShowVerification = (shipping) => {
    setSelectedShipping(shipping);
    setShowVerifyModal(true);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedShipping(null);
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
            style={{ color: "#006747EB" }}
            role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
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

      {/* Empty State */}
      {!isLoading && !error && getSlicedData()?.length === 0 && (
        <div className="text-center py-5">
          <i
            className="bi bi-box-seam"
            style={{ fontSize: "3rem", color: "#6c757d" }}></i>
          <p className="mt-3 text-muted">No shipping details found</p>
          <Link to="../initiate-escrow">
            <Button
              style={{ backgroundColor: "#006747EB" }}
              className="border-0">
              Create Your First Transaction
            </Button>
          </Link>
        </div>
      )}

      {/* Shipping Details Table */}
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
                    Shipping Info
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
                    Transaction ID
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Shipping Company
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Delivery Person
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Contact
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    Delivery Date
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
                {getSlicedData()?.map((shipping) => (
                  <React.Fragment key={shipping._id}>
                    {/* Mobile Row */}
                    <tr
                      className="d-md-none"
                      style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td className="py-3">
                        <div style={{ fontSize: "0.875rem" }}>
                          <div className="fw-semibold mb-1">
                            {shipping?.shipping_company}
                          </div>
                          <small
                            className="text-muted"
                            style={{ fontSize: "0.75rem" }}>
                            {shipping?.delivery_person_name}
                          </small>
                        </div>
                      </td>
                      <td
                        className="text-center"
                        style={{ fontSize: "0.75rem" }}>
                        {new Date(shipping?.delivery_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="text-center">
                        {getStatusBadge(shipping?.product?.transaction_status)}
                      </td>
                      <td className="text-center">
                        <div className="d-flex flex-column gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowMore(shipping)}
                            style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                            View
                          </Button>
                          {shouldShowVerifyButton(shipping) && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleShowVerification(shipping)}
                              style={{
                                fontSize: "0.75rem",
                                padding: "4px 8px",
                                backgroundColor: "#006747EB",
                                border: "none",
                              }}>
                              Verify
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
                        <code
                          style={{
                            fontSize: "0.75rem",
                            color: "#006747EB",
                            backgroundColor: "#e7f5f1",
                            padding: "4px 8px",
                            borderRadius: "4px",
                          }}>
                          {shipping?.product?.transaction_id?.slice(0, 15)}...
                        </code>
                      </td>
                      <td
                        className="text-center fw-semibold"
                        style={{ fontSize: "0.875rem" }}>
                        <i className="bi bi-truck me-2 text-primary"></i>
                        {shipping?.shipping_company}
                      </td>
                      <td
                        className="text-center"
                        style={{ fontSize: "0.875rem" }}>
                        {shipping?.delivery_person_name}
                      </td>
                      <td
                        className="text-center"
                        style={{ fontSize: "0.875rem" }}>
                        <i className="bi bi-telephone me-1"></i>
                        {shipping?.delivery_person_number}
                      </td>
                      <td
                        className="text-center"
                        style={{ fontSize: "0.875rem" }}>
                        {new Date(shipping?.delivery_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="text-center">
                        {getStatusBadge(shipping?.product?.transaction_status)}
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowMore(shipping)}
                            style={{
                              fontSize: "0.75rem",
                              padding: "6px 12px",
                            }}>
                            View Details
                          </Button>
                          {shouldShowVerifyButton(shipping) && (
                            <Button
                              size="sm"
                              onClick={() => handleShowVerification(shipping)}
                              className="border-0"
                              style={{
                                fontSize: "0.75rem",
                                padding: "6px 12px",
                                backgroundColor: "#006747EB",
                              }}>
                              <i className="bi bi-check-circle me-1"></i>
                              Verify Product
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

      {/* Shipping Details Modal */}
      <Modal show={show} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton style={{ borderBottom: "2px solid #e5e7eb" }}>
          <Modal.Title
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#1a1a1a",
            }}>
            <i
              className="bi bi-box-seam me-2"
              style={{ color: "#006747EB" }}></i>
            Shipping Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {selectedShipping ? (
            <>
              {/* Transaction Info */}
              <div className="mb-4">
                <h6
                  className="fw-bold mb-3 pb-2"
                  style={{
                    fontSize: "0.95rem",
                    color: "#006747EB",
                    borderBottom: "2px solid #e5e7eb",
                  }}>
                  <i className="bi bi-receipt me-2"></i>
                  Transaction Information
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <small
                      className="text-muted d-block mb-1"
                      style={{ fontSize: "0.75rem" }}>
                      Transaction ID
                    </small>
                    <code
                      style={{
                        fontSize: "0.75rem",
                        color: "#006747EB",
                        backgroundColor: "#e7f5f1",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}>
                      {selectedShipping?.product?.transaction_id}
                    </code>
                  </div>
                  <div className="col-md-6">
                    <small
                      className="text-muted d-block mb-1"
                      style={{ fontSize: "0.75rem" }}>
                      Transaction Status
                    </small>
                    {getStatusBadge(
                      selectedShipping?.product?.transaction_status
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
                  }}>
                  <i className="bi bi-truck me-2"></i>
                  Shipping Information
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div
                      className="p-3 rounded"
                      style={{ backgroundColor: "#f8f9fa" }}>
                      <div className="mb-2">
                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "0.75rem" }}>
                          Shipping Company
                        </small>
                        <span
                          className="fw-semibold"
                          style={{ fontSize: "0.875rem" }}>
                          {selectedShipping?.shipping_company}
                        </span>
                      </div>
                      <div className="mb-2">
                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "0.75rem" }}>
                          Delivery Person
                        </small>
                        <span style={{ fontSize: "0.875rem" }}>
                          {selectedShipping?.delivery_person_name}
                        </span>
                      </div>
                      <div>
                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "0.75rem" }}>
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
                      style={{ backgroundColor: "#f8f9fa" }}>
                      <div className="mb-2">
                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "0.75rem" }}>
                          Delivery Date
                        </small>
                        <span
                          className="fw-semibold"
                          style={{ fontSize: "0.875rem" }}>
                          {new Date(
                            selectedShipping?.delivery_date
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
                          style={{ fontSize: "0.75rem" }}>
                          Pick Up Address
                        </small>
                        <span style={{ fontSize: "0.875rem" }}>
                          {selectedShipping?.pick_up_address}
                        </span>
                      </div>
                      <div>
                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "0.75rem" }}>
                          Delivery Address
                        </small>
                        <span style={{ fontSize: "0.875rem" }}>
                          {selectedShipping?.product?.delivery_address}
                        </span>
                      </div>
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
                  }}>
                  <i className="bi bi-clock-history me-2"></i>
                  Timeline
                </h6>
                <div style={{ fontSize: "0.875rem" }}>
                  <div className="mb-2">
                    <strong>Purchase Date:</strong>{" "}
                    {new Date(
                      selectedShipping?.product?.createdAt
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
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No shipping details available.</p>
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

      {/* Product Verification Modal */}
      <Modal show={showVerifyModal} onHide={handleCloseVerifyModal} centered>
        <Modal.Header closeButton>
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
        <Modal.Footer>
          <Link
            to={`/userdashboard/disputes/initiate-dispute/${selectedShipping?.product?.transaction_id}`}
            state={{ transaction: selectedShipping?.product }}
            className="btn btn-outline-danger"
            style={{ fontSize: "0.875rem" }}>
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
