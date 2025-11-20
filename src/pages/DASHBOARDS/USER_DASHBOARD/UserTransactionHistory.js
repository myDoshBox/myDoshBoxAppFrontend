import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TransactionData from "../../../data/dummyData/transactionData.json";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import buyerImage from "../../../images/transact_person.png";
import { useFetchSingleTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useVerifyEscrowProductTransactionPaymentMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import React, { useMemo } from "react";
import { useFetchAllTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useSelector } from "react-redux";
import { searchFilter } from "../../../components/utils/searchFilter";

const DebugAuthState = () => {
  const authState = useSelector((state) => state.usersauth);
  const { userInfo } = authState;

  return (
    <div
      style={{
        padding: "20px",
        background: "#f0f0f0",
        margin: "20px",
        borderRadius: "8px",
        fontFamily: "monospace",
      }}>
      <h3>🐛 Debug Auth State</h3>
      <div>
        <strong>Full Auth State:</strong>
        <pre>{JSON.stringify(authState, null, 2)}</pre>
      </div>
      <div>
        <strong>userInfo:</strong>
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
      </div>
      <div>
        <strong>userInfo?.email:</strong> {userInfo?.email || "UNDEFINED"}
      </div>
      <div>
        <strong>localStorage userInfo:</strong>
        <pre>{localStorage.getItem("userInfo")}</pre>
      </div>
    </div>
  );
};

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
  // FIXED: Direct access to email from userInfo
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail =
    userInfo?.user?.email ||
    userInfo?.email ||
    userInfo?.organization_email ||
    userInfo?.userInfo?.email;

  console.log("🔍 Full userInfo:", userInfo);
  console.log("📧 Extracted userEmail:", userEmail);

  const {
    data: transactions,
    error,
    isLoading,
    isFetching,
  } = useFetchAllTransactionsQuery(userEmail, {
    skip: !userEmail, // Don't fetch if no email
    refetchOnMountOrArgChange: true,
  });

  console.log("User Email:", userEmail);
  console.log("Transactions Data:", transactions);
  console.log("Error:", error);
  console.log("Loading:", isLoading);

  const dropdownBtnValues = [
    { label: "All Data", value_1: "Last 7 days", value_2: "Over $1000" },
    { label: "2021", value_1: "2022", value_2: "2023" },
  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [show, setShow] = useState(false);

  // transactions fetched
  const fetchedTransactions = transactions?.transactions;

  // Show loading state
  if (isLoading || isFetching) {
    return (
      <div className="bg-white rounded-1 p-3 text-center">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-1 p-3 text-center">
        <p className="text-danger">
          Error loading transactions:{" "}
          {error?.data?.message || error?.error || "Unknown error"}
        </p>
        <button
          className="btn btn-primary mt-2"
          onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // Show empty state
  if (!fetchedTransactions || fetchedTransactions.length === 0) {
    return (
      <div className="bg-white rounded-1 p-3 text-center">
        <p>No transactions found</p>
        <Link to="../initiate-escrow" className="btn btn-primary mt-2">
          Create Your First Transaction
        </Link>
      </div>
    );
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleShowMore = (transactionId) => {
    setSelectedTransaction(transactionId);
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedTransaction(null);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getSlicedData = () => {
    if (!fetchedTransactions || fetchedTransactions?.length === 0) {
      return [];
    }
    console.log("ft", fetchedTransactions);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return fetchedTransactions?.slice(startIndex, endIndex);
  };

  return (
    <div className="bg-white rounded-1 p-3" style={{ width: "100%" }}>
      <div>
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h3 className="fs-6 m-0 mb-3 mb-md-0" style={{}}>
            All Transactions
          </h3>
          <div className="d-flex">
            {dropdownBtnValues.map((item) => {
              return (
                <Dropdown key={item.label}>
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    className="border-1 border-gray my-1 rounded-1 btn bg-transparent text-black border-black me-3 fs-sm"
                    style={{
                      outline: "none",
                      borderColor: "#E7E7E7",
                    }}>
                    {item.label}
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ minWidth: "inherit" }}>
                    <div key={item.label}>
                      <Dropdown.Item className="fs-sm">
                        {item.value_1}
                      </Dropdown.Item>
                      <Dropdown.Item className="fs-sm">
                        {item.value_2}
                      </Dropdown.Item>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              );
            })}
            <Link to={"../initiate-escrow"} className="text-decoration-none">
              <Button
                className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block me-3"
                style={{
                  backgroundColor: "#006747EB",
                }}>
                Create Transaction
              </Button>
            </Link>

            <Link to={"../initiate-escrow"} className="text-decoration-none">
              <Button
                className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block"
                style={{
                  backgroundColor: "#006747EB",
                }}>
                Download Transaction Slip
              </Button>
            </Link>
          </div>
        </div>

        <table className="table fs-sm">
          <thead>
            <tr className="lightTextColor">
              <th className="px-0 d-none d-md-table-cell">Product Name</th>
              <th className="text-center d-none d-md-table-cell">Vendor</th>
              <th className="text-center d-none d-md-table-cell">
                Purchase Date
              </th>
              <th className="text-center d-none d-md-table-cell">
                Product Price
              </th>
              <th className="text-center d-none d-md-table-cell">
                Transaction Type
              </th>
              <th className="text-center d-none d-md-table-cell">
                Transaction Status
              </th>
              <th className="text-center d-none d-md-table-cell">
                View Details
              </th>
            </tr>
          </thead>
          <tbody>
            {getSlicedData()?.map((history) => {
              return (
                <RecentTransactionTableData
                  {...history}
                  key={history.id}
                  onViewMore={() => handleShowMore(history)}
                />
              );
            })}
          </tbody>
        </table>
        <PaginationBar
          data={fetchedTransactions || "no transactions"}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
        />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Modal.Body>
            {selectedTransaction ? (
              <>
                {selectedTransaction.transaction_type === "buy" ? (
                  <>
                    <p>
                      <strong>Product Description:</strong>{" "}
                      {selectedTransaction.product_description}
                    </p>
                    <p>
                      <strong>Product Image:</strong>{" "}
                      <img
                        src={selectedTransaction.product_image}
                        alt="Product"
                      />
                    </p>
                    <p>
                      <strong>Product Name:</strong>{" "}
                      {selectedTransaction.product_name}
                    </p>
                    <p>
                      <strong>Transaction Total:</strong> ₦
                      {selectedTransaction.transaction_total}
                    </p>
                    <p>
                      <strong>Product Quantity:</strong>{" "}
                      {selectedTransaction.product_quantity}
                    </p>
                    <p>
                      <strong>Transaction ID:</strong>{" "}
                      {selectedTransaction.transaction_id}
                    </p>
                    <p>
                      <strong>Transaction Status:</strong>{" "}
                      {selectedTransaction.transaction_status}
                    </p>
                    <p>
                      <strong>Transaction Type:</strong>{" "}
                      {selectedTransaction.transaction_type}
                    </p>
                    <p>
                      <strong>Purchase Date:</strong>{" "}
                      {selectedTransaction.createdAt?.slice(0, 10)}
                    </p>
                    <p>
                      <strong>Purchase Time:</strong>{" "}
                      {selectedTransaction.createdAt?.slice(11, 19)}
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
                      <strong>Vendor Phone Number:</strong>{" "}
                      {selectedTransaction.vendor_phone_number}
                    </p>
                    <p>
                      <strong>Delivery Address:</strong>{" "}
                      {selectedTransaction.delivery_address}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Product Description:</strong>{" "}
                      {selectedTransaction.product_description}
                    </p>
                    <p>
                      <strong>Product Image:</strong>{" "}
                      <img
                        src={selectedTransaction.product_image}
                        alt="Product"
                      />
                    </p>
                    <p>
                      <strong>Product Name:</strong>{" "}
                      {selectedTransaction.product_name}
                    </p>
                    <p>
                      <strong>Product Price:</strong> ₦
                      {selectedTransaction.product_price}
                    </p>
                    <p>
                      <strong>Product Quantity:</strong>{" "}
                      {selectedTransaction.product_quantity}
                    </p>
                    <p>
                      <strong>Transaction ID:</strong>{" "}
                      {selectedTransaction.transaction_id}
                    </p>
                    <p>
                      <strong>Transaction Status:</strong>{" "}
                      {selectedTransaction.transaction_status}
                    </p>
                    <p>
                      <strong>Transaction Type:</strong>{" "}
                      {selectedTransaction.transaction_type}
                    </p>
                    <p>
                      <strong>Purchase Date:</strong>{" "}
                      {selectedTransaction.createdAt?.slice(0, 10)}
                    </p>
                    <p>
                      <strong>Purchase Time:</strong>{" "}
                      {selectedTransaction.createdAt?.slice(11, 19)}
                    </p>
                    <p>
                      <strong>Buyer Email:</strong>{" "}
                      {selectedTransaction.buyer_email}
                    </p>
                    <p>
                      <strong>Delivery Address:</strong>{" "}
                      {selectedTransaction.delivery_address}
                    </p>
                  </>
                )}
              </>
            ) : (
              <p>No transaction details available.</p>
            )}
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export const RecentTransactionTableData = (props) => {
  // FIXED: Direct access to email
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail = userInfo?.email;

  console.log("Current userInfo in TableData:", userInfo);
  console.log("Current userEmail in TableData:", userEmail);

  const {
    product_name,
    vendor_name,
    vendor_email,
    buyer_email,
    createdAt,
    product_price,
    transaction_total,
    transaction_id,
    status,
    status_color,
    status_message,
    transaction_type,
    transaction_status,
    seller_confirm_status,
    onViewMore,
  } = props;

  const navigate = useNavigate();

  let maxWidth = window.innerWidth;

  if (maxWidth < 250) {
    maxWidth = "5rem";
  } else if (maxWidth < 330) {
    maxWidth = "9rem";
  } else if (maxWidth < 450) {
    maxWidth = "12rem";
  }

  const style = {
    maxWidth,
  };

  return (
    <>
      <tr className="border-bottom">
        <td className="border-0 border-md-bottom d-none d-md-table-cell py-md-3 px-0">
          {product_name}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {vendor_name}
        </td>
        <td className="py-md-3 text-center lightTextColor">
          {createdAt?.slice(0, 10)}
        </td>

        <td className="d-none d-md-table-cell py-md-3 text-center">
          ₦{transaction_type === "buy" ? transaction_total : product_price}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {transaction_type}
        </td>

        <td className="d-none d-md-table-cell py-md-3 text-center">
          {transaction_status}
        </td>

        {userEmail === vendor_email &&
        buyer_email !== vendor_email &&
        seller_confirm_status === false &&
        transaction_status !== "inDispute" &&
        transaction_status !== "cancelled" ? (
          <td className="d-none d-md-table-cell py-md-3 text-center">
            <Button
              variant="outline-primary"
              className="rounded-1 fs-sm"
              onClick={() =>
                navigate(
                  `/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-details-form/${transaction_id}`
                )
              }>
              Confirm Transaction
            </Button>

            <Button
              variant="outline-danger"
              className="rounded-1 fs-sm ms-2"
              onClick={() =>
                navigate(
                  `/userdashboard/disputes/${transaction_id}/initiate-dispute`
                )
              }>
              Raise Dispute
            </Button>
          </td>
        ) : transaction_status === "inDispute" ? (
          <td className="d-none d-md-table-cell py-md-3 text-center">
            <Button
              variant="outline-primary"
              className="rounded-1 fs-sm"
              onClick={() =>
                navigate(
                  `/userdashboard/transaction-history/resolve-conflict/${transaction_id}`
                )
              }>
              Resolve Conflict
            </Button>
          </td>
        ) : (
          <td className="d-none d-md-table-cell py-md-3 text-center">
            <Button
              variant="outline-primary"
              className="rounded-1 fs-sm"
              onClick={onViewMore}>
              View More
            </Button>
          </td>
        )}
      </tr>
    </>
  );
};

export default UserTransactionHistory;
