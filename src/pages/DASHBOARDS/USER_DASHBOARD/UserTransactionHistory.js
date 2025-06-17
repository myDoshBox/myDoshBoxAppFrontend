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

import { useFetchAllTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
import { useSelector } from "react-redux";

const UserSettledTransactions = () => {
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
  // Get the current URL's query parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Extract the 'reference' parameter from the URL
  const reference = urlParams.get("reference");

  // Log or use the 'reference'
  console.log(reference); // This will output: db917a34-7d04-4400-85fc-4c8d1918cbda

  // console.log(escrowProductInfo);
  // console.log(userInfo);

  const [
    verifyEscrowProductTransactionPayment,
    { isLoading: verifyingEscrow },
  ] = useVerifyEscrowProductTransactionPaymentMutation();

  useEffect(() => {
    if (reference) {
      const verifyEscrowProductTransaction = async () => {
        await verifyEscrowProductTransactionPayment(reference)
          .unwrap()
          .then((res) => {
            // console.log(res);

            toast.success(res?.message);
          })
          .catch((error) => {
            // console.log(error);
          });
      };
      verifyEscrowProductTransaction();
    }
  }, [reference, verifyEscrowProductTransactionPayment]);

  // user detail for single user
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail = userInfo?.user?.email;

  // transaction detail for single user
  // const { escrowProductInfo } = useSelector((state) => state.escrowProductInfo);
  // const transactionId = escrowProductInfo;

  // console.log("transactionId", transactionId);

  const {
    data: transactions,
    error,
    isLoading,
  } = useFetchAllTransactionsQuery(userEmail, {
    refetchOnMountOrArgChange: true,
  });

  // console.log("transactions", transactions);

  const dropdownBtnValues = [
    { label: "All Data", value_1: "Last 7 days", value_2: "Over $1000" },
    { label: "2021", value_1: "2022", value_2: "2023" },
  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const [selectedTransaction, setSelectedTransaction] = useState(null); // For modal
  const [selectedTransaction, setSelectedTransaction] = useState(null); // For modal
  const [show, setShow] = useState(false);

  // const location = useLocation();

  // transactions fetched
  const fetchedTransactions = transactions?.transactions;
  // console.log("fetchedTransactions", fetchedTransactions);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleShowMore = (transactionId) => {
    // const selectedTransaction = fetchedTransactions?.find(
    //   (transaction) => transaction.id === transactionId
    // );
    setSelectedTransaction(transactionId);
    setShow(true);

    // console.log("selectedTransaction", selectedTransaction);
    // console.log("transactionid", transactionId);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedTransaction(null);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getSlicedData = () => {
    if (!fetchedTransactions || fetchedTransactions?.length === 0) {
      return []; // Return an empty array if there is no data
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return fetchedTransactions?.slice(startIndex, endIndex);
  };

  // console.log("getSlicedData", getSlicedData());

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error loading transactions: {error?.data?.message}</p>;
  if (verifyingEscrow) return <h1>Loading...</h1>;
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
                <Dropdown>
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    className="border-1 border-gray my-1 rounded-1 btn bg-transparent text-black border-black me-3 fs-sm"
                    style={{
                      outline: "none",
                      borderColor: "#E7E7E7",
                    }}
                  >
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
                }}
              >
                Create Transaction
              </Button>
            </Link>

            <Link to={"../initiate-escrow"} className="text-decoration-none">
              <Button
                className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block"
                style={{
                  backgroundColor: "#006747EB",
                }}
              >
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
              {/* <div className="d-flex justify-content-between align-items-center border-md-bottom"> */}
              {/* <th className="text-center d-none d-md-table-cell">
                  Purchase By
                </th> */}
              {/* <th className="text-center d-none d-md-table-cell">
                Product Price
              </th> */}
              {/* </div> */}
              {/* <th className="text-center d-none d-md-table-cell">Slip</th> */}
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
            {/* Use the getSlicedData function to map over only the data for the current page */}
            {getSlicedData()?.map((history) => {
              return (
                <RecentTransactionTableData
                  {...history}
                  key={history.id}
                  onViewMore={() => handleShowMore(history)}
                  // onClick={console.log("hi")}
                />

                // <Button variant="primary" onClick={handleShow}>
                // </Button>
              );
            })}

            {/* {console.log("gSD", getSlicedData())} */}
          </tbody>
        </table>
        <PaginationBar
          // data={TransactionData.user_recent_transaction}
          data={fetchedTransactions || "no transactions"}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
        />

        {/* {console.log("ft", fetchedTransactions)} */}
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
                  // Render for "buy" transaction type
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
                  // Render for "sell" transaction type
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
                      {/* {selectedTransaction.createdAt} */}
                      {selectedTransaction.createdAt?.slice(0, 10)}
                    </p>
                    <p>
                      <strong>Purchase Time:</strong>{" "}
                      {/* {selectedTransaction.createdAt} */}
                      {selectedTransaction.createdAt?.slice(11, 19)}
                    </p>
                    <p>
                      <strong>Buyer Email:</strong>{" "}
                      {selectedTransaction.buyer_email}
                    </p>
                    <p>
                      <strong>Buyer Email:</strong>{" "}
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
  const {
    product_name,
    vendor_name,
    vendor_email,
    buyer_email,
    createdAt,
    // purchase_by,
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

        {vendor_email === buyer_email && seller_confirm_status === false ? (
          <td className="d-none d-md-table-cell py-md-3 text-center">
            <Button
              variant="outline-primary"
              className="rounded-1 fs-sm"
              onClick={() =>
                navigate(
                  `confirm-escrow-product-transaction/shipping-details-form/${transaction_id}`
                )
              }
            >
              Confirm Transaction
            </Button>
          </td>
        ) : (
          <td className="d-none d-md-table-cell py-md-3 text-center">
            <Button
              variant="outline-primary"
              className="rounded-1 fs-sm"
              onClick={onViewMore}
            >
              View More
            </Button>
          </td>
        )}
      </tr>
    </>
  );
};

export default UserSettledTransactions;
