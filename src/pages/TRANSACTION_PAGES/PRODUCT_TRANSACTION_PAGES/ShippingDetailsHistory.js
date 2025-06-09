import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TransactionData from "../../../data/dummyData/transactionData.json";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import buyerImage from "../../../images/transact_person.png";
import {
  useBuyerConfirmsProductMutation,
  useFetchSingleTransactionsQuery,
} from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
import { useVerifyEscrowProductTransactionPaymentMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";

import { useFetchAllShippingDetailsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
import { useSelector } from "react-redux";

const ShippingDetailsHistory = () => {
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
  // user detail for single user
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail = userInfo?.user?.email;
  console.log("userEmail", userEmail);

  // transaction detail for single user
  // const { escrowProductInfo } = useSelector((state) => state.escrowProductInfo);
  // const transactionId = escrowProductInfo;

  // console.log("transactionId", transactionId);

  const {
    data: shippingDetails,
    error,
    isLoading,
  } = useFetchAllShippingDetailsQuery(userEmail, {
    refetchOnMountOrArgChange: true,
  });

  console.log("shippingDetails", shippingDetails?.transactions);
  // console.log("transactions_ss", transactions?.transactions);
  // console.log("error", error);

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
  const [display, setDisplay] = useState(false);

  // const location = useLocation();

  // transactions fetched
  const fetchedTransactions = shippingDetails?.transactions;
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

  const handleShowProductVerification = (transactionId) => {
    // const selectedTransaction = fetchedTransactions?.find(
    //   (transaction) => transaction.id === transactionId
    // );
    setSelectedTransaction(transactionId);
    setDisplay(true);

    // console.log("selectedTransaction", selectedTransaction);
    // console.log("transactionid", transactionId);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedTransaction(null);
  };

  const handleClose = () => setShow(false);
  const handleCloseDisplay = () => setDisplay(false);

  const navigate = useNavigate();

  const [buyerconfirmProduct, { data }] = useBuyerConfirmsProductMutation();

  const handleSubmit = async (transaction_id, e) => {
    e.preventDefault();

    await buyerconfirmProduct(transaction_id)
      .unwrap()
      .then((res) => {
        // console.log(res);
        toast.success(res?.message);
        navigate(
          `/userdashboard/transaction-history/confirm-escrow-product-transaction/settled-transactions-history`
        );
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      });
  };

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
  // if (verifyingEscrow) return <h1>Loading...</h1>;
  return (
    <div className="bg-white rounded-1 p-3" style={{ width: "100%" }}>
      <div>
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h3 className="fs-6 m-0 mb-3 mb-md-0" style={{}}>
            All Shipping Details
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
              <th className="px-0 d-none d-md-table-cell">Transaction ID</th>
              <th className="text-center d-none d-md-table-cell">
                Shipping Company
              </th>
              <th className="text-center d-none d-md-table-cell">
                Delivery Person Name
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
                Delivery Person Number
              </th>
              <th className="text-center d-none d-md-table-cell">
                Delivery Date
              </th>
              <th className="text-center d-none d-md-table-cell">
                Pick Up Address
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
                  transaction_id={history?.product?.transaction_id}
                  transaction_status={history?.product?.transaction_status}
                  onViewMore={() => handleShowMore(history)}
                  verifyProduct={() => handleShowProductVerification(history)}
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
                <p>
                  <strong>Transaction ID:</strong>{" "}
                  {selectedTransaction?.product?.transaction_id}
                </p>

                <p>
                  <strong>Product Name:</strong>{" "}
                  {selectedTransaction?.product?.product_name}
                </p>

                <p>
                  <strong>Shipping Company:</strong>{" "}
                  {selectedTransaction?.shipping_company}
                </p>
                <p>
                  <strong>Delivery Person Name:</strong>{" "}
                  {selectedTransaction?.delivery_person_name}
                </p>
                <p>
                  <strong>Delivery Person Number:</strong>{" "}
                  {selectedTransaction?.delivery_person_number}
                </p>
                <p>
                  <strong>Delivery Date:</strong>{" "}
                  {selectedTransaction?.delivery_date}
                </p>
                <p>
                  <strong>Pick Up Address:</strong>{" "}
                  {selectedTransaction?.pick_up_address}
                </p>
                {/* <p>
                  <strong>Transaction Total:</strong> ₦
                  {selectedTransaction?.product?.transaction_total}
                </p> */}

                <p>
                  <strong>Purchase Date:</strong>{" "}
                  {selectedTransaction?.product.createdAt?.slice(0, 10)}
                </p>
                <p>
                  <strong>Purchase Time:</strong>{" "}
                  {selectedTransaction?.product?.createdAt?.slice(11, 19)}
                </p>

                <p>
                  <strong>Delivery Address:</strong>{" "}
                  {selectedTransaction?.product?.delivery_address}
                </p>
                <p>
                  <strong>Transaction Status:</strong>{" "}
                  {selectedTransaction?.product?.transaction_status}
                </p>
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

      <Modal show={display} onHide={handleCloseDisplay}>
        <Modal.Header closeButton>
          <Modal.Title>Verification of Product Received</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Modal.Body>
            <p>
              Are satisfied with your order? If you are, click yes, accept the
              agreement so that the buyer can be paid. If not, click no and open
              a dispute with the buyer
            </p>
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          {/* redirect to dispute form */}
          {/* <Link
            variant="secondary"
            className="GeneralBtnStyle1"
            onClick={handleClose}
          >
            No, I will like to ope a dispute
          </Link> */}

          <Link
            to={`/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-history/${selectedTransaction?.product?.transaction_id}/initiate-dispute`}
            className="border-0 mt-3 btn text-white pale-red"
          >
            No, I will like to open a dispute
          </Link>

          {/* redirect to agreement page */}
          <Button
            className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
            onClick={(e) =>
              handleSubmit(selectedTransaction?.product?.transaction_id, e)
            }
          >
            Yes, I am satisfied
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export const RecentTransactionTableData = (props) => {
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail = userInfo?.user?.email;

  const {
    transaction_id,
    shipping_company,
    delivery_person_name,
    delivery_person_number,
    delivery_date,
    pick_up_address,
    transaction_status,
    // product_name,
    vendor_name,
    vendor_email,
    buyer_email,
    createdAt,
    // purchase_by,
    product_price,
    transaction_total,
    // status,
    // status_color,
    // status_message,
    transaction_type,
    seller_confirm_status,
    onViewMore,
    verifyProduct,
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
          {transaction_id}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {shipping_company}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {delivery_person_name}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {delivery_person_number}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {delivery_date}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {pick_up_address}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {transaction_status}
        </td>

        {userEmail === buyer_email &&
        buyer_email !== vendor_email &&
        transaction_status === "processing" ? (
          <td className="d-none d-md-table-cell py-md-3 text-center">
            <Button
              variant="outline-primary"
              className="rounded-1 fs-sm"
              onClick={verifyProduct}
            >
              Verify Product
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

export default ShippingDetailsHistory;
