import React from "react";
import { useEffect, useState, useMemo  } from "react";
import { toast } from "react-toastify";
import TransactionData from "../../../data/dummyData/transactionData.json";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Modal, Accordion } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import buyerImage from "../../../images/transact_person.png";
import { useFetchSingleTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
import { useVerifyEscrowProductTransactionPaymentMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useCancelTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useBuyerConfirmsProductMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useFetchAllTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
import {  useFetchDisputeDetailsQuery } from "../../../redux/slices/disputeSlices/disputeAPISlice"; // Assume this is the query hook for fetching transactions

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
  const [buyerConfirmsProduct] = useBuyerConfirmsProductMutation();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [show, setShow] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const navigate = useNavigate();

 // Fetch dispute details when selectedTransaction is in dispute
const { 
  data: allDisputes, 
  isLoading: disputeLoading, 
  error: disputeError 
} = useFetchDisputeDetailsQuery(userEmail, {
  skip: !userEmail,
});

 // Find the dispute that belongs to the selected transaction
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
    navigate(`/userdashboard/disputes/initiate-dispute/${transaction?.transaction_id}`, {
      state: { transaction },
    });
  };

  const handleResolveConflict = (transaction) => {
  navigate(`/userdashboard/disputes/resolve-dispute/${transaction?.transaction_id}`, {
    state: { transaction }, // pass full transaction object
  });
};


 const handleCancelTransaction = async () => {
  if (!selectedTransaction) return;

  try {
    toast.info("Cancelling transaction...", { autoClose: 2000 });
    
    // FIX: Pass only the transaction_id string, not an object
    await cancelTransaction(selectedTransaction?.transaction_id).unwrap();

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
    return transactions?.transactions?.slice(startIndex, startIndex + itemsPerPage);
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
              <th className="fs-6">Product</th>
              {/* <th className="text-center">Vendor</th> */}
              <th className="fs-6 text-center">Date</th>
              <th className="fs-6 text-center">Status</th>
              <th className="fs-6 text-center">Action</th>
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
                  <td>{history?.product_name}</td>
                  {/* <td className="text-center">{history?.vendor_name}</td> */}
                  <td className="text-center">{history?.createdAt?.slice(0, 10)}</td>
                  <td className="text-center">{history?.transaction_status}</td>
                  <td className="text-center">
                    <Button
                      variant={
                        history?.transaction_status === "inDispute" ? "outline-danger" : "outline-success"
                      }
                      size="sm"
                      onClick={() => handleShowMore(history)}
                    >
                      {history?.transaction_status === "inDispute"
                        ? "View "
                        : "View "}
                    </Button>
                  </td>
                </tr>

                {/* Desktop row */}
                <tr className="d-none d-md-table-row">
                  <td>{history?.product_name}</td>
                  <td className="text-center">{history?.vendor_name}</td>
                  <td className="text-center">{history?.createdAt?.slice(0, 10)}</td>
                  <td className="text-center">
                    {history?.transaction_type === "buy"
                      ? history?.transaction_total
                      : history?.product_price}
                  </td>
                  <td className="text-center">{history?.transaction_type}</td>
                  <td className="text-center">{history?.transaction_status}</td>
                  <td className="text-center">
                    <Button
                      variant={
                        history?.transaction_status === "inDispute"
                          ? "outline-danger"
                          : "outline-success"
                      }
                      size="sm"
                      onClick={() => handleShowMore(history)}
                    >
                      View More
                    </Button>
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
          <Modal.Title>
            {selectedTransaction?.transaction_status === "inDispute"
              ? "Transaction & Dispute Details"
              : "Transaction Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction ? (
            <>
              {/* ---- If inDispute: show toggles ---- */}
              {/* ✅ Get current dispute for this transaction */}
              {selectedTransaction?.transaction_status === "inDispute" ? (
                <Accordion defaultActiveKey="0">
                  {/* Transaction Details */}
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Transaction Details</Accordion.Header>
                    <Accordion.Body>
                      <p><strong>Product Name:</strong> {selectedTransaction?.product_name}</p>
                      <p><strong>Product Description:</strong> {selectedTransaction?.product_description}</p>
                      {selectedTransaction?.product_image && (
                        <p>
                          <strong>Product Image:</strong><br />
                          <img
                            src={selectedTransaction?.product_image}
                            alt="Product"
                            style={{ maxWidth: "150px" }}
                          />
                        </p>
                      )}
                      <p><strong>Transaction Total:</strong> ₦
                        {selectedTransaction?.transaction_type === "buy"
                          ? selectedTransaction?.transaction_total
                          : selectedTransaction?.product_price}
                      </p>
                      <p><strong>Purchase Time:</strong> {selectedTransaction?.createdAt?.slice(11, 19)}</p>
                      <p><strong>Transaction Status:</strong> {selectedTransaction?.transaction_status}</p>
                      <p><strong>Purchase Date:</strong> {selectedTransaction?.createdAt?.slice(0, 10)}</p>
                      <p><strong>Vendor Email:</strong> {selectedTransaction?.vendor_email}</p>
                      <p><strong>Vendor Name:</strong> {selectedTransaction?.vendor_name}</p>
                      <p><strong>Vendor Tel:</strong> {selectedTransaction?.vendor_phone_number}</p>
                      <p><strong>Buyer Email:</strong> {selectedTransaction?.buyer_email}</p>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Dispute Details */}
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Dispute Details</Accordion.Header>
                      <Accordion.Body>
                      {disputeLoading ? (
                        <p>Loading dispute details...</p>
                      ) : disputeError ? (
                        <p style={{ color: "red" }}>
                          Error loading disputes: {disputeError?.data?.message || disputeError?.message}
                        </p>
                      ) : currentDispute ? (
                        <>
                          <p><strong>Reason for Dispute:</strong> {currentDispute?.reason_for_dispute || "N/A"}</p>
                          <p><strong>Dispute Description:</strong> {currentDispute?.dispute_description || "N/A"}</p>
                        </>
                      ) : (
                        <p>No dispute details available for this transaction.</p>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ) : (
                <>
                  {/* ---- Normal Transaction Details ---- */}
                  <p><strong>Product Name:</strong> {selectedTransaction?.product_name}</p>
                  <p><strong>Product Description:</strong> {selectedTransaction?.product_description}</p>
                  {selectedTransaction?.product_image && (
                    <p>
                      <strong>Product Image:</strong><br />
                      <img
                        src={selectedTransaction?.product_image}
                        alt="Product"
                        style={{ maxWidth: "150px" }}
                      />
                    </p>
                  )}
                  <p><strong>Transaction Total:</strong> ₦
                    {selectedTransaction?.transaction_type === "buy"
                      ? selectedTransaction?.transaction_total
                      : selectedTransaction?.product_price}
                  </p>
                  <p><strong>Purchase Time:</strong> {selectedTransaction?.createdAt?.slice(11, 19)}</p>
                  <p><strong>Transaction Status:</strong> {selectedTransaction?.transaction_status}</p>
                  <p><strong>Purchase Date:</strong> {selectedTransaction?.createdAt?.slice(0, 10)}</p>
                  <p><strong>Vendor Email:</strong> {selectedTransaction?.vendor_email}</p>
                  <p><strong>Vendor Name:</strong> {selectedTransaction?.vendor_name}</p>
                  <p><strong>Vendor Tel:</strong> {selectedTransaction?.vendor_phone_number}</p>
                  <p><strong>Buyer Email:</strong> {selectedTransaction?.buyer_email}</p>
                </>
              )}

              {/* ---- Action Buttons ---- */}
              {selectedTransaction?.transaction_status === "processing" && (
                <div className="mt-3 d-flex gap-2 flex-wrap">
                  {/* Buyer Actions */}
                  {userEmail === selectedTransaction?.buyer_email && (
                    <Button
                      variant="outline-danger"
                      onClick={() => setConfirmCancel(true)}
                    >
                      Cancel Transaction
                    </Button>
                  )}
                  {userEmail === selectedTransaction?.buyer_email &&
                  selectedTransaction?.seller_confirm_status &&
                  selectedTransaction?.transaction_status === "processing" && (
                    <Button
                      variant="outline-success"
                      onClick={async () => {
                        try {
                          await buyerConfirmsProduct(selectedTransaction?.transaction_id).unwrap();
                          toast.success("Product confirmed successfully!");
                          handleCloseModal();
                          refetch();
                        } catch (error) {
                          toast.error(error?.data?.message || "Failed to confirm product");
                        }
                      }}
                    >
                      Confirm Product Received
                    </Button>
                  )}


                  {/* Seller Actions */}
                  {userEmail === selectedTransaction?.vendor_email && (
                      <>
                        {!selectedTransaction?.seller_confirm_status && (
                          <Button
                            variant="outline-primary"
                            onClick={() =>
                              navigate(
                                `/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-details-form/${selectedTransaction.transaction_id}`,
                                { state: { transaction: selectedTransaction } }
                              )
                            }
                          >
                            Confirm Transaction
                          </Button>
                        )}

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

              {selectedTransaction?.transaction_status === "inDispute" && (
                <div className="mt-3 d-flex gap-2 flex-wrap">
                  {/* Buyer sees Cancel + Resolve */}
                  {userEmail === selectedTransaction?.buyer_email && (
                    <>
                      <Button
                        variant="outline-danger"
                        onClick={() => setConfirmCancel(true)}
                      >
                        Cancel Transaction
                      </Button>
                      <Button
                        variant="outline-success"
                        onClick={() => handleResolveConflict(selectedTransaction)}
                      >
                        Resolve Dispute
                      </Button>
                    </>
                  )}

                  {/* Seller sees Involve Mediator */}
                  {userEmail === selectedTransaction?.vendor_email && (
                    <Button
                      variant="outline-warning"
                      onClick={() => toast.info("Mediator has been involved!")}
                    >
                      Involve Mediator
                    </Button>
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



