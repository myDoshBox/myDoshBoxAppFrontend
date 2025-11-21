import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useBuyerConfirmsProductMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
// import { useVerifyEscrowProductTransactionPaymentMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";

// import { useFetchAllShippingDetailsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice"; // Assume this is the query hook for fetching transactions
import { useFetchDisputeDetailsQuery } from "../../../redux/slices/disputeSlices/disputeAPISlice"; // Assume this is the query hook for fetching disputes
import { useSelector } from "react-redux";

const DisputesInProgressHistory = () => {
  return (
    <div className="contestPage" style={{ "background-color": "#F9F9FB" }}>
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>

        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5 center-card">
            <RecentDisputeTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecentDisputeTable = () => {
  // user detail for single user
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail =
    userInfo?.email || userInfo?.user?.email || userInfo?.organization_email;
  console.log("userEmail:", userEmail);

  const {
    data: disputeResponse,
    error,
    isLoading,
  } = useFetchDisputeDetailsQuery(userEmail, {
    refetchOnMountOrArgChange: true,
    skip: !userEmail,
  });

  const dropdownBtnValues = [
    { label: "All Data", value_1: "Last 7 days", value_2: "Over $1000" },
    { label: "2021", value_1: "2022", value_2: "2023" },
  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const [selectedTransaction, setSelectedTransaction] = useState(null); // For modal
  const [selectedDispute, setSelectedDispute] = useState(null); // For modal
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);

  // const location = useLocation();

  // transactions fetched
  const fetchedDisputes = disputeResponse?.data?.disputes || [];
  const pagination = disputeResponse?.data?.pagination;

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleShowMore = (transactionId) => {
    // const selectedTransaction = fetchedTransactions?.find(
    //   (transaction) => transaction.id === transactionId
    // );
    setSelectedDispute(transactionId);
    setShow(true);

    // console.log("selectedTransaction", selectedTransaction);
    // console.log("transactionid", transactionId);
  };

  const handleShowDisputeResolution = (transactionId) => {
    // const selectedTransaction = fetchedTransactions?.find(
    //   (transaction) => transaction.id === transactionId
    // );
    setSelectedDispute(transactionId);
    setDisplay(true);

    // console.log("selectedTransaction", selectedTransaction);
    // console.log("transactionid", transactionId);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedDispute(null);
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
    if (!fetchedDisputes || fetchedDisputes?.length === 0) {
      return []; // Return an empty array if there is no data
    }

    const completedDisputes = fetchedDisputes?.filter(
      (transaction) =>
        // transaction?.transaction_status === "completed" &&
        // userEmail === transaction?.vendor_email &&
        // transaction?.buyer_email !== transaction?.vendor_email &&
        // transaction?.seller_confirm_status === false
        transaction?.dispute_status !== "resolved" &&
        transaction?.dispute_status !== "cancelled"
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return completedDisputes?.slice(startIndex, endIndex);
  };

  // console.log("getSlicedData", getSlicedData()?.length);

  // console.log("getSlicedData", getSlicedData());

  // if (isLoading) return <p>Loading disputes...</p>;
  // if (error) return <p>Error loading disputes: {JSON.stringify(error)}</p>;

  return (
    <div className="bg-white rounded-1 p-3" style={{ width: "100%" }}>
      <div>
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h3 className="fs-6 m-0 mb-3 mb-md-0" style={{}}>
            All Dispute History Details
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
                Raise a Dispute
              </Button>
            </Link>

            <Link to={"../initiate-escrow"} className="text-decoration-none">
              <Button
                className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block"
                style={{
                  backgroundColor: "#006747EB",
                }}>
                Download Dispute Detail
              </Button>
            </Link>
          </div>
        </div>

        <table className="table fs-sm">
          <thead>
            <tr className="lightTextColor">
              {/* <th className="px-0 d-none d-md-table-cell">Transaction ID</th>
              <th className="text-center d-none d-md-table-cell">Dispute ID</th> */}
              <th className="px-0 d-none d-md-table-cell">Product Name</th>

              {/* <th className="text-center d-none d-md-table-cell">
                Reason for Dispute
              </th> */}
              <th className="text-center d-none d-md-table-cell">
                Resolution Method
              </th>
              <th className="text-center d-none d-md-table-cell">
                Dispute Status
              </th>
              {/* <th className="text-center d-none d-md-table-cell">
                Dispute Description
              </th> */}
              <th className="text-center d-none d-md-table-cell">
                Dispute Date
              </th>
              <th className="text-center d-none d-md-table-cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Use the getSlicedData function to map over only the data for the current page */}
            {getSlicedData()?.map((history) => {
              return (
                <RecentDisputeTableData
                  {...history}
                  key={history.id}
                  // transaction_id={history?.product?.transaction_id}
                  // transaction_id={history?.dispute?.transaction_id}
                  // transaction_status={history?.dispute?.dispute_status}
                  onViewMore={() => handleShowMore(history)}
                  // verifyProduct={() => handleShowProductVerification(history)}
                  resolveDispute={() => handleShowDisputeResolution(history)}
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
          data={fetchedDisputes || "no disputes"}
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
          <Modal.Title>Dispute Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Modal.Body>
            {selectedDispute ? (
              <>
                {/* <p>
                  <strong>Transaction ID:</strong>{" "}
                  {selectedDispute?.dispute?.transaction_id}
                </p>

                <p>
                  <strong>Dispute ID:</strong> {selectedDispute?.dispute?._id}
                </p> */}

                {/* 
                
buyer_email
: 
"muoghaluchidinma@gmail.com"
createdAt
: 
"2025-07-06T15:13:15.326Z"
dispute_description
: 
"hgkkjkfejkrkredfjvgdjfnvdj"
dispute_resolution_method
: 
"mediator"
dispute_status
: 
"resolving"
mediator
: 
"686126249307bac080ea77b9"
product_image
: 
"C:\\fakepath\\WhatsApp"
product_name
: 
"Fan"
reason_for_dispute
: 
"hgkkjkfejkrkredfjvgdjfnvdj"
transaction
: 
"686a925f155dd5a83e7fc092"
transaction_id
: 
"b70682e8-b7f7-4240-bfe1-ff32b12e5def"
updatedAt
: 
"2025-07-06T15:13:35.946Z"
user
: 
"67e7d069d31731cb0f8f018c"
vendor_email
: 
"diamondheartconcepts@gmail.com"
vendor_name
: 
"Chi Stores"
vendor_phone_number
: 
"39896659944"
                */}

                <p>
                  <strong>Transaction ID:</strong>{" "}
                  {selectedDispute?.transaction_id}
                </p>
                <p>
                  <strong>Dispute ID:</strong> {selectedDispute?._id}
                </p>
                <p>
                  <strong>Buyer Email:</strong> {selectedDispute?.buyer_email}
                </p>
                <p>
                  <strong>Vendor Email:</strong> {selectedDispute?.vendor_email}
                </p>
                <p>
                  <strong>Dispute Time:</strong>{" "}
                  {selectedDispute?.createdAt?.slice(11, 19)}
                </p>
                <p>
                  <strong>Reason for Dispute:</strong>{" "}
                  {selectedDispute?.reason_for_dispute}
                </p>
                {/* <p>
                  <strong>Transaction Total:</strong> ₦
                  {selectedTransaction?.product?.transaction_total}
                </p> */}

                <p>
                  <strong>Dispute Description:</strong>{" "}
                  {selectedDispute?.dispute_description}
                </p>
                <p>
                  <strong>Product Image:</strong>{" "}
                  {selectedDispute?.product_image}
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
            to={`/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-history/${selectedDispute?.dispute?.transaction_id}/initiate-dispute`}
            className="border-0 mt-3 btn text-white pale-red">
            Yes, I will like resolve this dispute
          </Link>

          {/* redirect to agreement page */}
          <Button
            className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
            onClick={(e) =>
              handleSubmit(selectedDispute?.dispute?.transaction_id, e)
            }>
            I will like to involve a mediator
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export const RecentDisputeTableData = (props) => {
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail = userInfo?.user?.email;

  const {
    product_name,
    dispute_resolution_method,
    dispute_status,
    // dispute_date,
    // pick_up_address,
    // transaction_status,
    // product_name,
    // vendor_name,
    vendor_email,
    buyer_email,
    createdAt,
    // purchase_by,
    // product_price,
    // transaction_total,
    // status,
    // status_color,
    // status_message,
    // transaction_type,
    // seller_confirm_status,
    onViewMore,
    resolveDispute,
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
        {/* <td className="d-none d-md-table-cell py-md-3 text-center">{_id}</td> */}
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {dispute_resolution_method}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {dispute_status}
        </td>
        {/* <td className="d-none d-md-table-cell py-md-3 text-center">
          {delivery_date}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {pick_up_address}
        </td> */}
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {createdAt?.slice(0, 10)}
        </td>

        {userEmail === buyer_email &&
        buyer_email !== vendor_email &&
        dispute_status === "resolving" ? (
          <td className="d-none d-md-table-cell py-md-3 text-center">
            <Button
              variant="outline-primary"
              className="rounded-1 fs-sm"
              onClick={resolveDispute}>
              Resolve Dispute
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

export default DisputesInProgressHistory;
