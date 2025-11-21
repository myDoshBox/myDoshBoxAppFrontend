import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useBuyerConfirmsProductMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useFetchDisputeDetailsQuery } from "../../../redux/slices/disputeSlices/disputeAPISlice";
import { useSelector } from "react-redux";

const ProductsDisputeHistory = () => {
  return (
    <div className="contestPage" style={{ backgroundColor: "#F9F9FB" }}>
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
  const { userInfo } = useSelector((state) => state.usersauth);

  // Fix: Get email correctly from userInfo
  const userEmail =
    userInfo?.email || userInfo?.user?.email || userInfo?.organization_email;

  console.log("📧 User Email for dispute fetch:", userEmail);

  const {
    data: disputeResponse,
    error,
    isLoading,
  } = useFetchDisputeDetailsQuery(userEmail, {
    refetchOnMountOrArgChange: true,
    skip: !userEmail,
  });

  const fetchedDisputes = disputeResponse?.data?.disputes || [];
  const pagination = disputeResponse?.data?.pagination;

  const dropdownBtnValues = [
    { label: "All Data", value_1: "Last 7 days", value_2: "Over $1000" },
    { label: "2021", value_1: "2022", value_2: "2023" },
  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(pagination?.totalPages || 0);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);

  const navigate = useNavigate();
  const [buyerconfirmProduct] = useBuyerConfirmsProductMutation();

  // Update totalPages when pagination changes
  useEffect(() => {
    if (pagination?.totalPages) {
      setTotalPages(pagination.totalPages);
    }
  }, [pagination]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleShowMore = (dispute) => {
    setSelectedDispute(dispute);
    setShow(true);
  };

  const handleShowDisputeResolution = (dispute) => {
    setSelectedDispute(dispute);
    setDisplay(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedDispute(null);
  };

  const handleCloseDisplay = () => {
    setDisplay(false);
    setSelectedDispute(null);
  };

  const handleSubmit = async (transaction_id, e) => {
    e.preventDefault();
    try {
      const res = await buyerconfirmProduct(transaction_id).unwrap();
      toast.success(res?.message);
      navigate(
        `/userdashboard/transaction-history/confirm-escrow-product-transaction/settled-transactions-history`
      );
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const getSlicedData = () => {
    if (!fetchedDisputes || fetchedDisputes.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return fetchedDisputes.slice(startIndex, endIndex);
  };

  if (isLoading) return <p>Loading disputes...</p>;
  if (error)
    return (
      <p>Error loading disputes: {error?.data?.message || "Unknown error"}</p>
    );

  return (
    <div className="bg-white rounded-1 p-3" style={{ width: "100%" }}>
      <div>
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h3 className="fs-6 m-0 mb-3 mb-md-0">All Dispute Details</h3>
          <div className="d-flex">
            {dropdownBtnValues.map((item, index) => (
              <Dropdown key={index}>
                <Dropdown.Toggle
                  id={`dropdown-${index}`}
                  className="border-1 border-gray my-1 rounded-1 btn bg-transparent text-black border-black me-3 fs-sm"
                  style={{ outline: "none", borderColor: "#E7E7E7" }}>
                  {item.label}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: "inherit" }}>
                  <Dropdown.Item className="fs-sm">
                    {item.value_1}
                  </Dropdown.Item>
                  <Dropdown.Item className="fs-sm">
                    {item.value_2}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ))}
            <Link to="../initiate-escrow" className="text-decoration-none">
              <Button
                className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block me-3"
                style={{ backgroundColor: "#006747EB" }}>
                Raise a Dispute
              </Button>
            </Link>
            <Button
              className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block"
              style={{ backgroundColor: "#006747EB" }}>
              Download Dispute Detail
            </Button>
          </div>
        </div>

        <table className="table fs-sm">
          <thead>
            <tr className="lightTextColor">
              <th className="px-0 d-none d-md-table-cell">Product Name</th>
              <th className="text-center d-none d-md-table-cell">
                Resolution Method
              </th>
              <th className="text-center d-none d-md-table-cell">
                Dispute Status
              </th>
              <th className="text-center d-none d-md-table-cell">
                Dispute Date
              </th>
              <th className="text-center d-none d-md-table-cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {getSlicedData().length > 0 ? (
              getSlicedData().map((dispute) => (
                <RecentDisputeTableData
                  key={dispute._id || dispute.id}
                  {...dispute}
                  userEmail={userEmail}
                  onViewMore={() => handleShowMore(dispute)}
                  resolveDispute={() => handleShowDisputeResolution(dispute)}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No disputes found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <PaginationBar
          data={fetchedDisputes}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
        />
      </div>

      {/* View More Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Dispute Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDispute ? (
            <>
              <p>
                <strong>Transaction ID:</strong>{" "}
                {selectedDispute.transaction_id}
              </p>
              <p>
                <strong>Dispute ID:</strong> {selectedDispute._id}
              </p>
              <p>
                <strong>Product Name:</strong> {selectedDispute.product_name}
              </p>
              <p>
                <strong>Buyer Email:</strong> {selectedDispute.buyer_email}
              </p>
              <p>
                <strong>Vendor Email:</strong> {selectedDispute.vendor_email}
              </p>
              <p>
                <strong>Vendor Name:</strong> {selectedDispute.vendor_name}
              </p>
              <p>
                <strong>Dispute Status:</strong>{" "}
                {selectedDispute.dispute_status}
              </p>
              <p>
                <strong>Resolution Method:</strong>{" "}
                {selectedDispute.dispute_resolution_method}
              </p>
              <p>
                <strong>Reason for Dispute:</strong>{" "}
                {selectedDispute.reason_for_dispute}
              </p>
              <p>
                <strong>Dispute Description:</strong>{" "}
                {selectedDispute.dispute_description}
              </p>
              <p>
                <strong>Dispute Date:</strong>{" "}
                {selectedDispute.createdAt?.slice(0, 10)}
              </p>
              <p>
                <strong>Dispute Time:</strong>{" "}
                {selectedDispute.createdAt?.slice(11, 19)}
              </p>
              {selectedDispute.product_image && (
                <div>
                  <strong>Product Image:</strong>
                  <img
                    src={selectedDispute.product_image}
                    alt="Product"
                    style={{ maxWidth: "100%", marginTop: "10px" }}
                  />
                </div>
              )}
            </>
          ) : (
            <p>No dispute details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Resolve Dispute Modal */}
      <Modal show={display} onHide={handleCloseDisplay}>
        <Modal.Header closeButton>
          <Modal.Title>Resolve Dispute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Would you like to resolve this dispute? You can either resolve it
            directly or involve a mediator.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Link
            to={`/userdashboard/disputes/resolve-dispute/${selectedDispute?.transaction_id}`}
            className="border-0 btn text-white pale-red">
            Yes, resolve this dispute
          </Link>
          <Button
            className="all-btn border-0 btn text-white"
            style={{ backgroundColor: "#006747EB" }}
            onClick={(e) => handleSubmit(selectedDispute?.transaction_id, e)}>
            Involve a mediator
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export const RecentDisputeTableData = (props) => {
  const {
    product_name,
    dispute_resolution_method,
    dispute_status,
    dispute_raised_by_email,
    createdAt,
    userEmail,
    onViewMore,
    resolveDispute,
  } = props;

  // Show "Resolve Dispute" button if current user raised the dispute and status is "resolving"
  const canResolve =
    userEmail === dispute_raised_by_email && dispute_status === "resolving";

  return (
    <tr className="border-bottom">
      <td className="border-0 d-none d-md-table-cell py-md-3 px-0">
        {product_name || "N/A"}
      </td>
      <td className="d-none d-md-table-cell py-md-3 text-center">
        {dispute_resolution_method || "N/A"}
      </td>
      <td className="d-none d-md-table-cell py-md-3 text-center">
        <span
          className={`badge ${
            dispute_status === "resolved"
              ? "bg-success"
              : dispute_status === "resolving"
              ? "bg-warning"
              : "bg-secondary"
          }`}>
          {dispute_status || "N/A"}
        </span>
      </td>
      <td className="d-none d-md-table-cell py-md-3 text-center">
        {createdAt?.slice(0, 10) || "N/A"}
      </td>
      <td className="d-none d-md-table-cell py-md-3 text-center">
        {canResolve ? (
          <Button
            variant="outline-success"
            className="rounded-1 fs-sm"
            onClick={resolveDispute}>
            Resolve Dispute
          </Button>
        ) : (
          <Button
            variant="outline-primary"
            className="rounded-1 fs-sm"
            onClick={onViewMore}>
            View More
          </Button>
        )}
      </td>
    </tr>
  );
};

export default ProductsDisputeHistory;
