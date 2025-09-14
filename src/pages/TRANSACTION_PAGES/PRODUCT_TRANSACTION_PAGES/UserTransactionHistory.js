import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TransactionData from "../../../data/dummyData/transactionData.json";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import buyerImage from "../../../images/transact_person.png";
import { useFetchSingleTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
import { useVerifyEscrowProductTransactionPaymentMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useCancelTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useFetchAllTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
import { useSelector } from "react-redux";

const UserTransactionHistory = () => {
  return (
    <div className="contestPage" style={{ "background-color": "#F9F9FB" }}>
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

export const RecentTransactionTable = () => {
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail = userInfo?.user?.email;

  const { data: transactions, isLoading, error, refetch } =
    useFetchAllTransactionsQuery(userEmail, {
      refetchOnMountOrArgChange: true,
    });

  const [cancelTransaction] = useCancelTransactionMutation();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [show, setShow] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const navigate = useNavigate();

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
    navigate(`/userdashboard/disputes/initiate-dispute/${transaction?.transaction_id}`, {
      state: { transaction },
    });
  };

  const handleResolveConflict = (transaction) => {
    navigate(`/userdashboard/disputes/resolve-dispute/${transaction?.transaction_id}`);
  };

  const handleCancelTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      toast.info("Cancelling transaction...", { autoClose: 2000 });
      await cancelTransaction({
        transaction_id: selectedTransaction?.transaction_id,
      }).unwrap();

      toast.success("Transaction cancelled successfully!");
      setConfirmCancel(false);
      setShow(false);

      refetch(); // refresh list
      navigate("/userdashboard/transaction-history/cancelled-transactions");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel transaction");
    }
  };

  const getSlicedData = () => {
    if (!transactions?.transactions?.length) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return transactions.transactions.slice(startIndex, startIndex + itemsPerPage);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading transactions.</p>;

  return (
    <div className="bg-white rounded-1 p-3 w-100">
      {/* Header */}
      <div className="d-md-flex justify-content-between align-items-center mb-3">
        <h3 className="fs-6 m-0 mb-3 mb-md-0">All Transactions</h3>
        <div className="d-flex">
          <Link to="../initiate-escrow" className="text-decoration-none me-2">
            <Button
              className="border-0 my-1 rounded-1 all-btn text-white fs-sm"
              style={{ backgroundColor: "#006747EB" }}
            >
              Create Transaction
            </Button>
          </Link>
          <Link to="../initiate-escrow" className="text-decoration-none">
            <Button
              className="border-0 my-1 rounded-1 all-btn text-white fs-sm"
              style={{ backgroundColor: "#006747EB" }}
            >
              Download Transaction Slip
            </Button>
          </Link>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="table-responsive">
        <table className="table fs-sm">
          <thead>
            <tr className="d-md-none lightTextColor">
              <th>Product Name</th>
              <th className="text-center">Vendor</th>
              <th className="text-center">Purchase Date</th>
              <th className="text-center">Transaction Status</th>
              <th className="text-center">Action</th>
            </tr>
            <tr className="d-none d-md-table-row lightTextColor">
              <th>Product Name</th>
              <th className="text-center">Vendor</th>
              <th className="text-center">Purchase Date</th>
              <th className="text-center">Product Price</th>
              <th className="text-center">Transaction Type</th>
              <th className="text-center">Transaction Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {getSlicedData()?.map((history) => (
              <React.Fragment key={history.id}>
                {/* Small screen row */}
                <tr className="d-md-none">
                  <td>{history.product_name}</td>
                  <td className="text-center">{history.vendor_name}</td>
                  <td className="text-center">{history.createdAt?.slice(0, 10)}</td>
                  <td className="text-center">{history.transaction_status}</td>
                  <td className="text-center">
                    {history.transaction_status === "inDispute" ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleResolveConflict(history)}
                      >
                        Resolve Conflict
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleShowMore(history)}
                      >
                        View Details
                      </Button>
                    )}
                  </td>
                </tr>

                {/* Desktop row */}
                <tr className="d-none d-md-table-row">
                  <td>{history.product_name}</td>
                  <td className="text-center">{history.vendor_name}</td>
                  <td className="text-center">{history.createdAt?.slice(0, 10)}</td>
                  <td className="text-center">
                    {history.transaction_type === "buy"
                      ? history.transaction_total
                      : history.product_price}
                  </td>
                  <td className="text-center">{history.transaction_type}</td>
                  <td className="text-center">{history.transaction_status}</td>
                  <td className="text-center">
                    {history.transaction_status === "inDispute" ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleResolveConflict(history)}
                      >
                        Resolve Conflict
                      </Button>
                    ) : (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleShowMore(history)}
                      >
                        View More
                      </Button>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationBar
        data={transactions?.transactions || []}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
      />

      {/* Transaction Details Modal */}
      <Modal show={show} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction ? (
            <>
              <p>
                <strong>Product Name:</strong> {selectedTransaction.product_name}
              </p>
              <p>
                <strong>Product Description:</strong>{" "}
                {selectedTransaction.product_description}
              </p>
              {selectedTransaction.product_image && (
                <p>
                  <strong>Product Image:</strong>
                  <br />
                  <img
                    src={selectedTransaction.product_image}
                    alt="Product"
                    style={{ maxWidth: "150px" }}
                  />
                </p>
              )}
              <p>
                <strong>Transaction Total:</strong> ₦
                {selectedTransaction.transaction_type === "buy"
                  ? selectedTransaction.transaction_total
                  : selectedTransaction.product_price}
              </p>
              <p>
                <strong>Purchase Time:</strong>{" "}
                {selectedTransaction.createdAt?.slice(11, 19)}
              </p>
              <p>
                <strong>Transaction Status:</strong>{" "}
                {selectedTransaction.transaction_status}
              </p>
              <p>
                <strong>Purchase Date:</strong>{" "}
                {selectedTransaction.createdAt?.slice(0, 10)}
              </p>
              <p>
                <strong>Vendor Email:</strong>{" "}
                {selectedTransaction.vendor_email}
              </p>
              <p>
                <strong>Vendor Name:</strong>{" "}
                {selectedTransaction.vendor_name}
              </p>
              <p>
                <strong>Vendor Tel:</strong>{" "}
                {selectedTransaction.vendor_phone_number}
              </p>
              <p>
                <strong>Buyer Email:</strong>{" "}
                {selectedTransaction.buyer_email}
              </p>

              {selectedTransaction.transaction_status === "processing" && (
                <div className="mt-3 d-flex gap-2 flex-wrap">
                  {userEmail === selectedTransaction.buyer_email && (
                    <Button
                      variant="outline-danger"
                      onClick={() => setConfirmCancel(true)}
                    >
                      Cancel Transaction
                    </Button>
                  )}
                  {userEmail === selectedTransaction.vendor_email && (
                    <>
                      <Button
                        variant="outline-primary"
                        onClick={() =>
                          navigate(
                            `/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-details-form/${selectedTransaction.transaction_id}`
                          )
                        }
                      >
                        Confirm Transaction
                      </Button>
                      <Button
                        variant="outline-warning"
                        onClick={() => handleRaiseDispute(selectedTransaction)}
                      >
                        Raise Dispute
                      </Button>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <p>No transaction details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Cancel Modal */}
      <Modal show={confirmCancel} onHide={() => setConfirmCancel(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this transaction?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmCancel(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleCancelTransaction}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};


/* Table Row Component */
export const RecentTransactionTableData = ({
  product_name,
  vendor_name,
  createdAt,
  transaction_status,
  onViewMore,
}) => {
  return (
    <tr className="border-bottom">
      <td className="py-md-3">{product_name}</td>
      <td className="text-center">{vendor_name}</td>
      <td className="text-center">{createdAt?.slice(0, 10)}</td>
      <td className="text-center">{transaction_status}</td>
      <td className="text-center">
        <Button
          variant="outline-primary"
          className="rounded-1 fs-sm"
          onClick={onViewMore}
        >
          View Details
        </Button>
      </td>
    </tr>
  );
};

export default UserTransactionHistory;












// export const RecentTransactionTable = () => {
//   // user detail for single user
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const userEmail = userInfo?.user?.email;

//   const {
//     data: transactions,
//     error,
//     isLoading,
//   } = useFetchAllTransactionsQuery(userEmail, {
//     refetchOnMountOrArgChange: true,
//   });

//   // console.log("transactions", transactions);

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

//   // const location = useLocation();

//   // transactions fetched
//   const fetchedTransactions = transactions?.transactions;
//   // console.log("fetchedTransactions", fetchedTransactions);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleShowMore = (transactionId) => {
//     setSelectedTransaction(transactionId);
//     setShow(true);
//   };

//   const handleCloseModal = () => {
//     setShow(false);
//     setSelectedTransaction(null);
//   };

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const getSlicedData = () => {
//     if (!fetchedTransactions || fetchedTransactions?.length === 0) {
//       return []; // Return an empty array if there is no data
//     }
//     console.log("ft", fetchedTransactions);

//     // const transactionsInProgress = fetchedTransactions?.filter(
//     //   (transaction) =>
//     //     // transaction?.transaction_status === "completed" &&
//     //     // userEmail === transaction?.vendor_email &&
//     //     // transaction?.buyer_email !== transaction?.vendor_email &&
//     //     // transaction?.seller_confirm_status === false
//     //     transaction?.transaction_status === "processing"
//     // );

//     // console.log("ct", transactionsInProgress);

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     return fetchedTransactions?.slice(startIndex, endIndex);
//   };

//   // console.log("getSlicedData", getSlicedData());

//   // if (isLoading) return <p>Loading...</p>;
//   // if (error) return <p>Error loading transactions: {error?.data?.message}</p>;
//   return (
//     <div className="bg-white rounded-1 p-3" style={{ width: "100%" }}>
//       <div>
//         <div className="d-md-flex justify-content-between align-items-center mb-3">
//           <h3 className="fs-6 m-0 mb-3 mb-md-0" style={{}}>
//            All Transactions
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
//                     }}
//                   >
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
//                 }}
//               >
//                 Create Transaction
//               </Button>
//             </Link>

//             <Link to={"../initiate-escrow"} className="text-decoration-none">
//               <Button
//                 className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block"
//                 style={{
//                   backgroundColor: "#006747EB",
//                 }}
//               >
//                 Download Transaction Slip
//               </Button>
//             </Link>
//           </div>
//         </div>

//         <table className="table fs-sm">
//           <thead>
//             <tr className="lightTextColor">
//               <th className="px-0 d-none d-md-table-cell">Product Name</th>
//               <th className="text-center d-none d-md-table-cell">Vendor</th>
//               <th className="text-center d-none d-md-table-cell">
//                 Purchase Date
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
//                 Product Price
//               </th>
//               <th className="text-center d-none d-md-table-cell">
//                 Transaction Type
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
//                   onViewMore={() => handleShowMore(history)}
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
//             {/* {selectedTransaction &&
//             userEmail === selectedTransaction?.vendor_email &&
//             selectedTransaction?.buyer_email !==
//               selectedTransaction?.vendor_email &&
//             selectedTransaction?.seller_confirm_status === false ? ( */}
//             {selectedTransaction ? (
//               <>
//                 {selectedTransaction.transaction_type === "buy" ? (
//                   // Render for "buy" transaction type
//                   <>
//                     <p>
//                       <strong>Product Description:</strong>{" "}
//                       {selectedTransaction.product_description}
//                     </p>
//                     <p>
//                       <strong>Product Image:</strong>{" "}
//                       <img
//                         src={selectedTransaction.product_image}
//                         alt="Product"
//                       />
//                     </p>
//                     <p>
//                       <strong>Product Name:</strong>{" "}
//                       {selectedTransaction.product_name}
//                     </p>
//                     <p>
//                       <strong>Transaction Total:</strong> ₦
//                       {selectedTransaction.transaction_total}
//                     </p>
//                     <p>
//                       <strong>Product Quantity:</strong>{" "}
//                       {selectedTransaction.product_quantity}
//                     </p>
//                     <p>
//                       <strong>Transaction ID:</strong>{" "}
//                       {selectedTransaction.transaction_id}
//                     </p>
//                     <p>
//                       <strong>Transaction Status:</strong>{" "}
//                       {selectedTransaction.transaction_status}
//                     </p>
//                     <p>
//                       <strong>Transaction Type:</strong>{" "}
//                       {selectedTransaction.transaction_type}
//                     </p>
//                     <p>
//                       <strong>Purchase Date:</strong>{" "}
//                       {selectedTransaction.createdAt?.slice(0, 10)}
//                     </p>
//                     <p>
//                       <strong>Purchase Time:</strong>{" "}
//                       {selectedTransaction.createdAt?.slice(11, 19)}
//                     </p>
//                     <p>
//                       <strong>Vendor Email:</strong>{" "}
//                       {selectedTransaction.vendor_email}
//                     </p>
//                     <p>
//                       <strong>Vendor Name:</strong>{" "}
//                       {selectedTransaction.vendor_name}
//                     </p>
//                     <p>
//                       <strong>Vendor Phone Number:</strong>{" "}
//                       {selectedTransaction.vendor_phone_number}
//                     </p>
//                     <p>
//                       <strong>Delivery Address:</strong>{" "}
//                       {selectedTransaction.delivery_address}
//                     </p>
//                   </>
//                 ) : (
//                   // Render for "sell" transaction type
//                   <>
//                     <p>
//                       <strong>Product Description:</strong>{" "}
//                       {selectedTransaction.product_description}
//                     </p>
//                     <p>
//                       <strong>Product Image:</strong>{" "}
//                       <img
//                         src={selectedTransaction.product_image}
//                         alt="Product"
//                       />
//                     </p>
//                     <p>
//                       <strong>Product Name:</strong>{" "}
//                       {selectedTransaction.product_name}
//                     </p>
//                     <p>
//                       <strong>Product Price:</strong> ₦
//                       {selectedTransaction.product_price}
//                     </p>
//                     <p>
//                       <strong>Product Quantity:</strong>{" "}
//                       {selectedTransaction.product_quantity}
//                     </p>
//                     <p>
//                       <strong>Transaction ID:</strong>{" "}
//                       {selectedTransaction.transaction_id}
//                     </p>
//                     <p>
//                       <strong>Transaction Status:</strong>{" "}
//                       {selectedTransaction.transaction_status}
//                     </p>
//                     <p>
//                       <strong>Transaction Type:</strong>{" "}
//                       {selectedTransaction.transaction_type}
//                     </p>
//                     <p>
//                       <strong>Purchase Date:</strong>{" "}
//                       {/* {selectedTransaction.createdAt} */}
//                       {selectedTransaction.createdAt?.slice(0, 10)}
//                     </p>
//                     <p>
//                       <strong>Purchase Time:</strong>{" "}
//                       {/* {selectedTransaction.createdAt} */}
//                       {selectedTransaction.createdAt?.slice(11, 19)}
//                     </p>
//                     <p>
//                       <strong>Buyer Email:</strong>{" "}
//                       {selectedTransaction.buyer_email}
//                     </p>
//                     <p>
//                       <strong>Buyer Email:</strong>{" "}
//                       {selectedTransaction.delivery_address}
//                     </p>
//                   </>
//                 )}
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
//     </div>
//   );
// };

// export const RecentTransactionTableData = (props) => {
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const userEmail = userInfo?.user?.email;

//   const {
//     product_name,
//     vendor_name,
//     vendor_email,
//     buyer_email,
//     createdAt,
//     // purchase_by,
//     product_price,
//     transaction_total,
//     transaction_id,
//     status,
//     status_color,
//     status_message,
//     transaction_type,
//     transaction_status,
//     seller_confirm_status,
//     onViewMore,
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
//           {product_name}
//         </td>
//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {vendor_name}
//         </td>
//         <td className="py-md-3 text-center lightTextColor">
//           {createdAt?.slice(0, 10)}
//         </td>

//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           ₦{transaction_type === "buy" ? transaction_total : product_price}
//         </td>
//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {transaction_type}
//         </td>

//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {/* <Button
//             className="border-0 rounded-1 btn all-btn text-white fs-sm"
//             style={{
//               backgroundColor: "#006747EB",
//             }}
//           >
//             Generate Slip
//           </Button> */}
//           {transaction_status}
//         </td>
//         {/* <td
//           className="py-md-3 text-center"
//           style={{ color: `${status_color}` }}
//         >
//           {window.innerWidth < 768 ? (
//             <span style={{ color: `${status_color}` }}>●</span>
//           ) : (
//             `${transaction_status}`
//           )}
//         </td> */}

//         {/* ///// */}
//         {/* <td className="d-none d-md-table-cell py-md-3 text-center">
//           <Button
//             variant="outline-primary"
//             className="rounded-1 fs-sm"
//             onClick={onViewMore}
//           >
//             View More
//           </Button>
//         </td> */}
//         {/* ////// */}

//         {/* <td className="d-none d-md-table-cell py-md-3 text-center">
//           <Button
//             variant="outline-primary"
//             className="rounded-1 fs-sm"
//             onClick={onViewMore}
//           >
//             {seller_confirm_status === "false"
//               ? "View More"
//               : "Confirm Transaction"}
//           </Button>
//         </td> */}

//         {/* {userEmail === vendor_email &&
//         buyer_email !== vendor_email &&
//         seller_confirm_status === false &&
//         transaction_status === "processing" ? (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={() =>
//                 navigate(
//                   `confirm-escrow-product-transaction/shipping-details-form/${transaction_id}`
//                 )
//               }
//             >
//               Confirm Transaction
//             </Button>
//           </td>
//         ) : (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={onViewMore}
//             >
//               View More
//             </Button>
//           </td>
//         )} */}

//         {userEmail === vendor_email &&
//         buyer_email !== vendor_email &&
//         seller_confirm_status === false &&
//         transaction_status !== "inDispute" &&
//         transaction_status !== "cancelled" ? (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={() =>
//                 navigate(
//                   `/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-details-form/${transaction_id}`
//                 )
//               }
//             >
//               Confirm Transaction
//             </Button>

//             <Button
//               variant="outline-danger" // Different color to distinguish
//               className="rounded-1 fs-sm"
//               onClick={() =>
//                 navigate(
//                   `/userdashboard/disputes/initiate-dispute/${transaction_id}` // Adjust the route as needed
//                 )
//               }
//             >
//               Raise Dispute
//             </Button>
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={onViewMore}
//             >
//               View More
//             </Button>
//           </td>
//         ) : transaction_status === "inDispute" ? (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={() =>
//                 navigate(
//                   `/userdashboard/transaction-history/resolve-conflict/${transaction_id}` // Adjust the route as needed
//                 )
//               }
//             >
//               Resolve Conflict
//             </Button>
//           </td>
//         ) : (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={onViewMore}
//             >
//               View More
//             </Button>
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={onViewMore}
//             >
//               Cancel
//             </Button>
//           </td>
//         )}
//       </tr>
//     </>
//   );
// };

// export default UserTransactionHistory;

// import React from "react";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import TransactionData from "../../../data/dummyData/transactionData.json";
// import { PaginationBar } from "../../../components/PaginationComponent";
// import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button, Modal } from "react-bootstrap";
// import Dropdown from "react-bootstrap/Dropdown";
// import buyerImage from "../../../images/transact_person.png";
// import { useFetchSingleTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
// import { useVerifyEscrowProductTransactionPaymentMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
// import { useCancelTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
// import { useFetchAllTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
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
//   const userEmail = userInfo?.user?.email;

//   const { data: transactions, isLoading, error, refetch } =
//     useFetchAllTransactionsQuery(userEmail, {
//       refetchOnMountOrArgChange: true,
//     });

//   const [cancelTransaction] = useCancelTransactionMutation();

//   const itemsPerPage = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [show, setShow] = useState(false);
//   const [confirmCancel, setConfirmCancel] = useState(false);

//   const navigate = useNavigate();

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
//     navigate(`/userdashboard/disputes/initiate-dispute/${transaction.transaction_id}`, {
//       state: { transaction },
//     });
//   };

//   const handleResolveConflict = (transaction) => {
//     navigate(`/userdashboard/disputes/resolve-dispute/${transaction.transaction_id}`);
//   };

//  const handleCancelTransaction = async () => {
//   if (!selectedTransaction) return;

//   try {
//     toast.info("Cancelling transaction...", { autoClose: 2000 });
    
//     // FIX: Pass only the transaction_id string, not an object
//     await cancelTransaction(selectedTransaction.transaction_id).unwrap();

//     toast.success("Transaction cancelled successfully!");
//     setConfirmCancel(false);
//     setShow(false);

//     refetch(); // refresh list
//     navigate("/userdashboard/transaction-history/cancelled-transactions");
//   } catch (err) {
//     toast.error(err?.data?.message || "Failed to cancel transaction");
//   }
// };

//   const getSlicedData = () => {
//     if (!transactions?.transactions?.length) return [];
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return transactions.transactions.slice(startIndex, startIndex + itemsPerPage);
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading transactions.</p>;

//   return (
//     <div className="bg-white rounded-1 p-3 w-100">
//       {/* Header */}
//       <div className="d-md-flex justify-content-between align-items-center mb-3">
//         <h3 className="fs-6 m-0 mb-3 mb-md-0">All Transactions</h3>
//         <div className="d-flex">
//           <Link to="../initiate-escrow" className="text-decoration-none me-2">
//             <Button
//               className="border-0 my-1 rounded-1 all-btn text-white fs-sm"
//               style={{ backgroundColor: "#006747EB" }}
//             >
//               Create Transaction
//             </Button>
//           </Link>
//           <Link to="../initiate-escrow" className="text-decoration-none">
//             <Button
//               className="border-0 my-1 rounded-1 all-btn text-white fs-sm"
//               style={{ backgroundColor: "#006747EB" }}
//             >
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
//               <th>Product Name</th>
//               <th className="text-center">Vendor</th>
//               <th className="text-center">Purchase Date</th>
//               <th className="text-center">Transaction Status</th>
//               <th className="text-center">Action</th>
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
//                   <td>{history.product_name}</td>
//                   <td className="text-center">{history.vendor_name}</td>
//                   <td className="text-center">{history.createdAt?.slice(0, 10)}</td>
//                   <td className="text-center">{history.transaction_status}</td>
//                   <td className="text-center">
//                     {history.transaction_status === "inDispute" ? (
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => handleResolveConflict(history)}
//                       >
//                         Resolve Conflict
//                       </Button>
//                     ) : (
//                       <Button
//                         variant="primary"
//                         size="sm"
//                         onClick={() => handleShowMore(history)}
//                       >
//                         View Details
//                       </Button>
//                     )}
//                   </td>
//                 </tr>

//                 {/* Desktop row */}
//                 <tr className="d-none d-md-table-row">
//                   <td>{history.product_name}</td>
//                   <td className="text-center">{history.vendor_name}</td>
//                   <td className="text-center">{history.createdAt?.slice(0, 10)}</td>
//                   <td className="text-center">
//                     {history.transaction_type === "buy"
//                       ? history.transaction_total
//                       : history.product_price}
//                   </td>
//                   <td className="text-center">{history.transaction_type}</td>
//                   <td className="text-center">{history.transaction_status}</td>
//                   <td className="text-center">
//                     {history.transaction_status === "inDispute" ? (
//                       <Button
//                         variant="outline-danger"
//                         size="sm"
//                         onClick={() => handleResolveConflict(history)}
//                       >
//                         Resolve Conflict
//                       </Button>
//                     ) : (
//                       <Button
//                         variant="outline-success"
//                         size="sm"
//                         onClick={() => handleShowMore(history)}
//                       >
//                         View More
//                       </Button>
//                     )}
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
//           <Modal.Title>Transaction Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedTransaction ? (
//             <>
//               <p>
//                 <strong>Product Name:</strong> {selectedTransaction.product_name}
//               </p>
//               <p>
//                 <strong>Product Description:</strong>{" "}
//                 {selectedTransaction.product_description}
//               </p>
//               {selectedTransaction.product_image && (
//                 <p>
//                   <strong>Product Image:</strong>
//                   <br />
//                   <img
//                     src={selectedTransaction.product_image}
//                     alt="Product"
//                     style={{ maxWidth: "150px" }}
//                   />
//                 </p>
//               )}
//               <p>
//                 <strong>Transaction Total:</strong> ₦
//                 {selectedTransaction.transaction_type === "buy"
//                   ? selectedTransaction.transaction_total
//                   : selectedTransaction.product_price}
//               </p>
//               <p>
//                 <strong>Purchase Time:</strong>{" "}
//                 {selectedTransaction.createdAt?.slice(11, 19)}
//               </p>
//               <p>
//                 <strong>Transaction Status:</strong>{" "}
//                 {selectedTransaction.transaction_status}
//               </p>
//               <p>
//                 <strong>Purchase Date:</strong>{" "}
//                 {selectedTransaction.createdAt?.slice(0, 10)}
//               </p>
//               <p>
//                 <strong>Vendor Email:</strong>{" "}
//                 {selectedTransaction.vendor_email}
//               </p>
//               <p>
//                 <strong>Vendor Name:</strong>{" "}
//                 {selectedTransaction.vendor_name}
//               </p>
//               <p>
//                 <strong>Vendor Tel:</strong>{" "}
//                 {selectedTransaction.vendor_phone_number}
//               </p>
//               <p>
//                 <strong>Buyer Email:</strong>{" "}
//                 {selectedTransaction.buyer_email}
//               </p>

//               {selectedTransaction.transaction_status === "processing" && (
//                 <div className="mt-3 d-flex gap-2 flex-wrap">
//                   {userEmail === selectedTransaction.buyer_email && (
//                     <Button
//                       variant="outline-danger"
//                       onClick={() => setConfirmCancel(true)}
//                     >
//                       Cancel Transaction
//                     </Button>
//                   )}
//                   {userEmail === selectedTransaction.vendor_email && (
//                     <>
//                       <Button
//                         variant="outline-primary"
//                         onClick={() =>
//                           navigate(
//                             `/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-details-form/${selectedTransaction.transaction_id}`
//                           )
//                         }
//                       >
//                         Confirm Transaction
//                       </Button>
//                       <Button
//                         variant="outline-warning"
//                         onClick={() => handleRaiseDispute(selectedTransaction)}
//                       >
//                         Raise Dispute
//                       </Button>
//                     </>
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

//       {/* Confirm Cancel Modal */}
//       <Modal show={confirmCancel} onHide={() => setConfirmCancel(false)} centered>
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
//           onClick={onViewMore}
//         >
//           View Details
//         </Button>
//       </td>
//     </tr>
//   );
// };

// export default UserTransactionHistory;












// export const RecentTransactionTable = () => {
//   // user detail for single user
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const userEmail = userInfo?.user?.email;

//   const {
//     data: transactions,
//     error,
//     isLoading,
//   } = useFetchAllTransactionsQuery(userEmail, {
//     refetchOnMountOrArgChange: true,
//   });

//   // console.log("transactions", transactions);

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

//   // const location = useLocation();

//   // transactions fetched
//   const fetchedTransactions = transactions?.transactions;
//   // console.log("fetchedTransactions", fetchedTransactions);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleShowMore = (transactionId) => {
//     setSelectedTransaction(transactionId);
//     setShow(true);
//   };

//   const handleCloseModal = () => {
//     setShow(false);
//     setSelectedTransaction(null);
//   };

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const getSlicedData = () => {
//     if (!fetchedTransactions || fetchedTransactions?.length === 0) {
//       return []; // Return an empty array if there is no data
//     }
//     console.log("ft", fetchedTransactions);

//     // const transactionsInProgress = fetchedTransactions?.filter(
//     //   (transaction) =>
//     //     // transaction?.transaction_status === "completed" &&
//     //     // userEmail === transaction?.vendor_email &&
//     //     // transaction?.buyer_email !== transaction?.vendor_email &&
//     //     // transaction?.seller_confirm_status === false
//     //     transaction?.transaction_status === "processing"
//     // );

//     // console.log("ct", transactionsInProgress);

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     return fetchedTransactions?.slice(startIndex, endIndex);
//   };

//   // console.log("getSlicedData", getSlicedData());

//   // if (isLoading) return <p>Loading...</p>;
//   // if (error) return <p>Error loading transactions: {error?.data?.message}</p>;
//   return (
//     <div className="bg-white rounded-1 p-3" style={{ width: "100%" }}>
//       <div>
//         <div className="d-md-flex justify-content-between align-items-center mb-3">
//           <h3 className="fs-6 m-0 mb-3 mb-md-0" style={{}}>
//            All Transactions
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
//                     }}
//                   >
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
//                 }}
//               >
//                 Create Transaction
//               </Button>
//             </Link>

//             <Link to={"../initiate-escrow"} className="text-decoration-none">
//               <Button
//                 className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block"
//                 style={{
//                   backgroundColor: "#006747EB",
//                 }}
//               >
//                 Download Transaction Slip
//               </Button>
//             </Link>
//           </div>
//         </div>

//         <table className="table fs-sm">
//           <thead>
//             <tr className="lightTextColor">
//               <th className="px-0 d-none d-md-table-cell">Product Name</th>
//               <th className="text-center d-none d-md-table-cell">Vendor</th>
//               <th className="text-center d-none d-md-table-cell">
//                 Purchase Date
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
//                 Product Price
//               </th>
//               <th className="text-center d-none d-md-table-cell">
//                 Transaction Type
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
//                   onViewMore={() => handleShowMore(history)}
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
//             {/* {selectedTransaction &&
//             userEmail === selectedTransaction?.vendor_email &&
//             selectedTransaction?.buyer_email !==
//               selectedTransaction?.vendor_email &&
//             selectedTransaction?.seller_confirm_status === false ? ( */}
//             {selectedTransaction ? (
//               <>
//                 {selectedTransaction.transaction_type === "buy" ? (
//                   // Render for "buy" transaction type
//                   <>
//                     <p>
//                       <strong>Product Description:</strong>{" "}
//                       {selectedTransaction.product_description}
//                     </p>
//                     <p>
//                       <strong>Product Image:</strong>{" "}
//                       <img
//                         src={selectedTransaction.product_image}
//                         alt="Product"
//                       />
//                     </p>
//                     <p>
//                       <strong>Product Name:</strong>{" "}
//                       {selectedTransaction.product_name}
//                     </p>
//                     <p>
//                       <strong>Transaction Total:</strong> ₦
//                       {selectedTransaction.transaction_total}
//                     </p>
//                     <p>
//                       <strong>Product Quantity:</strong>{" "}
//                       {selectedTransaction.product_quantity}
//                     </p>
//                     <p>
//                       <strong>Transaction ID:</strong>{" "}
//                       {selectedTransaction.transaction_id}
//                     </p>
//                     <p>
//                       <strong>Transaction Status:</strong>{" "}
//                       {selectedTransaction.transaction_status}
//                     </p>
//                     <p>
//                       <strong>Transaction Type:</strong>{" "}
//                       {selectedTransaction.transaction_type}
//                     </p>
//                     <p>
//                       <strong>Purchase Date:</strong>{" "}
//                       {selectedTransaction.createdAt?.slice(0, 10)}
//                     </p>
//                     <p>
//                       <strong>Purchase Time:</strong>{" "}
//                       {selectedTransaction.createdAt?.slice(11, 19)}
//                     </p>
//                     <p>
//                       <strong>Vendor Email:</strong>{" "}
//                       {selectedTransaction.vendor_email}
//                     </p>
//                     <p>
//                       <strong>Vendor Name:</strong>{" "}
//                       {selectedTransaction.vendor_name}
//                     </p>
//                     <p>
//                       <strong>Vendor Phone Number:</strong>{" "}
//                       {selectedTransaction.vendor_phone_number}
//                     </p>
//                     <p>
//                       <strong>Delivery Address:</strong>{" "}
//                       {selectedTransaction.delivery_address}
//                     </p>
//                   </>
//                 ) : (
//                   // Render for "sell" transaction type
//                   <>
//                     <p>
//                       <strong>Product Description:</strong>{" "}
//                       {selectedTransaction.product_description}
//                     </p>
//                     <p>
//                       <strong>Product Image:</strong>{" "}
//                       <img
//                         src={selectedTransaction.product_image}
//                         alt="Product"
//                       />
//                     </p>
//                     <p>
//                       <strong>Product Name:</strong>{" "}
//                       {selectedTransaction.product_name}
//                     </p>
//                     <p>
//                       <strong>Product Price:</strong> ₦
//                       {selectedTransaction.product_price}
//                     </p>
//                     <p>
//                       <strong>Product Quantity:</strong>{" "}
//                       {selectedTransaction.product_quantity}
//                     </p>
//                     <p>
//                       <strong>Transaction ID:</strong>{" "}
//                       {selectedTransaction.transaction_id}
//                     </p>
//                     <p>
//                       <strong>Transaction Status:</strong>{" "}
//                       {selectedTransaction.transaction_status}
//                     </p>
//                     <p>
//                       <strong>Transaction Type:</strong>{" "}
//                       {selectedTransaction.transaction_type}
//                     </p>
//                     <p>
//                       <strong>Purchase Date:</strong>{" "}
//                       {/* {selectedTransaction.createdAt} */}
//                       {selectedTransaction.createdAt?.slice(0, 10)}
//                     </p>
//                     <p>
//                       <strong>Purchase Time:</strong>{" "}
//                       {/* {selectedTransaction.createdAt} */}
//                       {selectedTransaction.createdAt?.slice(11, 19)}
//                     </p>
//                     <p>
//                       <strong>Buyer Email:</strong>{" "}
//                       {selectedTransaction.buyer_email}
//                     </p>
//                     <p>
//                       <strong>Buyer Email:</strong>{" "}
//                       {selectedTransaction.delivery_address}
//                     </p>
//                   </>
//                 )}
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
//     </div>
//   );
// };

// export const RecentTransactionTableData = (props) => {
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const userEmail = userInfo?.user?.email;

//   const {
//     product_name,
//     vendor_name,
//     vendor_email,
//     buyer_email,
//     createdAt,
//     // purchase_by,
//     product_price,
//     transaction_total,
//     transaction_id,
//     status,
//     status_color,
//     status_message,
//     transaction_type,
//     transaction_status,
//     seller_confirm_status,
//     onViewMore,
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
//           {product_name}
//         </td>
//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {vendor_name}
//         </td>
//         <td className="py-md-3 text-center lightTextColor">
//           {createdAt?.slice(0, 10)}
//         </td>

//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           ₦{transaction_type === "buy" ? transaction_total : product_price}
//         </td>
//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {transaction_type}
//         </td>

//         <td className="d-none d-md-table-cell py-md-3 text-center">
//           {/* <Button
//             className="border-0 rounded-1 btn all-btn text-white fs-sm"
//             style={{
//               backgroundColor: "#006747EB",
//             }}
//           >
//             Generate Slip
//           </Button> */}
//           {transaction_status}
//         </td>
//         {/* <td
//           className="py-md-3 text-center"
//           style={{ color: `${status_color}` }}
//         >
//           {window.innerWidth < 768 ? (
//             <span style={{ color: `${status_color}` }}>●</span>
//           ) : (
//             `${transaction_status}`
//           )}
//         </td> */}

//         {/* ///// */}
//         {/* <td className="d-none d-md-table-cell py-md-3 text-center">
//           <Button
//             variant="outline-primary"
//             className="rounded-1 fs-sm"
//             onClick={onViewMore}
//           >
//             View More
//           </Button>
//         </td> */}
//         {/* ////// */}

//         {/* <td className="d-none d-md-table-cell py-md-3 text-center">
//           <Button
//             variant="outline-primary"
//             className="rounded-1 fs-sm"
//             onClick={onViewMore}
//           >
//             {seller_confirm_status === "false"
//               ? "View More"
//               : "Confirm Transaction"}
//           </Button>
//         </td> */}

//         {/* {userEmail === vendor_email &&
//         buyer_email !== vendor_email &&
//         seller_confirm_status === false &&
//         transaction_status === "processing" ? (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={() =>
//                 navigate(
//                   `confirm-escrow-product-transaction/shipping-details-form/${transaction_id}`
//                 )
//               }
//             >
//               Confirm Transaction
//             </Button>
//           </td>
//         ) : (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={onViewMore}
//             >
//               View More
//             </Button>
//           </td>
//         )} */}

//         {userEmail === vendor_email &&
//         buyer_email !== vendor_email &&
//         seller_confirm_status === false &&
//         transaction_status !== "inDispute" &&
//         transaction_status !== "cancelled" ? (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={() =>
//                 navigate(
//                   `/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-details-form/${transaction_id}`
//                 )
//               }
//             >
//               Confirm Transaction
//             </Button>

//             <Button
//               variant="outline-danger" // Different color to distinguish
//               className="rounded-1 fs-sm"
//               onClick={() =>
//                 navigate(
//                   `/userdashboard/disputes/initiate-dispute/${transaction_id}` // Adjust the route as needed
//                 )
//               }
//             >
//               Raise Dispute
//             </Button>
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={onViewMore}
//             >
//               View More
//             </Button>
//           </td>
//         ) : transaction_status === "inDispute" ? (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={() =>
//                 navigate(
//                   `/userdashboard/transaction-history/resolve-conflict/${transaction_id}` // Adjust the route as needed
//                 )
//               }
//             >
//               Resolve Conflict
//             </Button>
//           </td>
//         ) : (
//           <td className="d-none d-md-table-cell py-md-3 text-center">
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={onViewMore}
//             >
//               View More
//             </Button>
//             <Button
//               variant="outline-primary"
//               className="rounded-1 fs-sm"
//               onClick={onViewMore}
//             >
//               Cancel
//             </Button>
//           </td>
//         )}
//       </tr>
//     </>
//   );
// };

// export default UserTransactionHistory;
