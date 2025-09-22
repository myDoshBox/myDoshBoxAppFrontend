import { useState, useEffect } from "react";
import { Button, Form, Row, Col, FloatingLabel, Card, Modal   } from "react-bootstrap";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate } from "react-router-dom";
import { CancelButton } from "../../../components/ButtonsComponent/OtherButtons";
import { ProceedButton } from "../../../components/ButtonsComponent/TransactionButtons";
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setEscrowProduct } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
import { useFetchSingleTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useAppContext } from "../../../context/appContext";
import { toast } from "react-toastify";
// import { useAppContext } from "../../context/AppContext";
import { FaUser, FaPhone, FaEnvelope, FaBox, FaHashtag, FaMoneyBill, FaMapMarkerAlt, FaFileImage, FaEye} from "react-icons/fa";

const BuyerResolveTransactionDisputeForm = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row">
          <div className="col-lg-3 col-sm-12"></div>

          <div className="col-lg-9 col-sm-12">
            <UserDashboardNavbar />
            <div className="mt-5">
              <BuyerResolveDisputeForm />
            </div>
          </div>
        </div>
      </div>
    </> 
  );
};

const BuyerResolveDisputeForm = () => {
  const loggedInUser = localStorage.getItem("userInfo");
  const userInfo = JSON.parse(loggedInUser)?.user?.email;
  const { escrowProductInfo } = useSelector((state) => state.escrowProductInfo);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { transaction_id } = useParams(); // Get transaction_id from URL params
  
  // Try to get transaction from navigation state first, otherwise fetch it
  const transactionFromState = location.state?.transaction;
  
  // Fetch transaction if not available from navigation state
  const { 
    data: fetchedTransaction, 
    isLoading: isFetching, 
    error: fetchError 
  } = useFetchSingleTransactionsQuery(transaction_id, {
    skip: !!transactionFromState, // Skip if we already have transaction from state
  });

  const initialValues = {
    transaction_id: "",
    vendor_phone_number: "",
    vendor_name: "",
    vendor_email: "",
    transaction_type: "buy",
    product_name: "",
    product_quantity: 0,
    product_price: 0,
    transaction_total: 0,
    product_image: "",
    product_description: "",
    delivery_address: "",
  };

  const [transaction, setTransaction] = useState(initialValues);
  const [productImageURL, setProductImageURL] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [transactionTotal, setTransactionTotal] = useState(0);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  // Prefill form with transaction data
useEffect(() => {
  console.log("Fetched transaction:", fetchedTransaction);

  // Adjust this depending on API shape
  const sourceTransaction = transactionFromState 
    || fetchedTransaction?.data   // <- use `data` instead of `transaction`
    || fetchedTransaction;

  if (sourceTransaction) {
    const prefilledData = {
      transaction_id: sourceTransaction.transaction_id || "",
      vendor_phone_number: sourceTransaction.vendor_phone_number || "",
      vendor_name: sourceTransaction.vendor_name || "",
      vendor_email: sourceTransaction.vendor_email || "",
      transaction_type: sourceTransaction.transaction_type || "buy",
      product_name: sourceTransaction.product_name || "",
      product_quantity: sourceTransaction.product_quantity || 0,
      product_price: sourceTransaction.product_price || 0,
      transaction_total: sourceTransaction.transaction_total || 0,
      product_image: sourceTransaction.product_image || "",
      product_description: sourceTransaction.product_description || "",
      delivery_address: sourceTransaction.delivery_address || "",
    };

    setTransaction(prefilledData);

    if (sourceTransaction.product_image) {
      setProductImageURL(sourceTransaction.product_image);
    }
    setTransactionTotal(sourceTransaction.transaction_total || 0);
  }
}, [transactionFromState, fetchedTransaction]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImageURL(reader.result);
          setTransaction((prev) => ({ ...prev, product_image: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setTransaction((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const total =
      parseInt(transaction.product_quantity) * parseFloat(transaction.product_price || 0) +
      0.025 * parseFloat(transaction.product_price || 0);
    setTransactionTotal(total.toFixed(2));
    setTransaction((prev) => ({ ...prev, transaction_total: total.toFixed(2) }));
  }, [transaction.product_quantity, transaction.product_price]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show modal instead of immediately navigating
  };

  const handleConfirmProceed = () => {
    dispatch(setEscrowProduct(transaction));
    setShowModal(false);
    navigate("/userdashboard/agreement");
  };

  const handleCancel = () => {
    dispatch(setEscrowProduct(null));
    navigate("/userdashboard");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Show loading state while fetching
  if (isFetching) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <p>Loading transaction details...</p>
      </div>
    );
  }

  // Show error state if fetch failed
  if (fetchError) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <p className="text-danger">Error loading transaction details. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-center my-5">
        <Card className="p-4 shadow-sm rounded-4 w-100" style={{ maxWidth: "850px" }}>
          <h4 className="fw-bold text-center mb-4 text-success">Buyer Resolve Dispute</h4>

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label><FaHashtag className="me-2 text-secondary" /> Transaction ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="transaction_id"
                    placeholder="Enter transaction ID"
                    value={transaction.transaction_id}
                    onChange={handleChange}
                    className="rounded-3"
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label><FaUser className="me-2 text-secondary" /> Vendor Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="vendor_name"
                    placeholder="John steven"
                    value={transaction.vendor_name}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label><FaPhone className="me-2 text-secondary" /> Vendor Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="vendor_phone_number"
                    placeholder="+234 812 345 6789"
                    value={transaction.vendor_phone_number}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label><FaEnvelope className="me-2 text-secondary" /> Vendor Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="vendor_email"
                    placeholder="vendor@email.com"
                    value={transaction.vendor_email}
                    onChange={handleChange}
                    className="rounded-3"
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label><FaBox className="me-2 text-secondary" /> Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="product_name"
                    placeholder="iPhone 15 Pro"
                    value={transaction.product_name}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="product_quantity"
                    value={transaction.product_quantity}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label><FaMoneyBill className="me-2 text-secondary" /> Price (₦)</Form.Label>
                  <Form.Control
                    type="number"
                    name="product_price"
                    value={transaction.product_price}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label><FaMapMarkerAlt className="me-2 text-secondary" /> Delivery Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="delivery_address"
                    placeholder="123, Example Street, Lagos"
                    value={transaction.delivery_address}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Product Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="product_description"
                    rows={3}
                    placeholder="Write a short description of the product..."
                    value={transaction.product_description}
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label><FaFileImage className="me-2 text-secondary" /> Upload Product Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="product_image"
                    accept="image/png, image/jpeg"
                    onChange={handleChange}
                    className="rounded-3"
                  />
                </Form.Group>
                {productImageURL && (
                  <div className="text-center mt-3">
                    <Card className="border-0 shadow-sm p-2 rounded-4">
                      <img
                        src={productImageURL}
                        alt="Preview"
                        className="img-fluid rounded-4"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                    </Card>
                  </div>
                )}
              </Col>

              <Col md={12} className="text-end mt-3">
                <h5>Total: <span className="text-success fw-bold">₦{transactionTotal}</span></h5>
              </Col>

              <Col md={12} className="d-flex justify-content-center gap-3 mt-4">
                <Button
                  variant="outline-danger"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 rounded-3 bg-success border-0"
                >
                  Proceed 
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>

      {/* Summary Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-success fw-bold">
            <FaEye className="me-2" />
            Transaction Summary
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          <Card className="border-0 bg-light rounded-4 p-4">
            <Row className="g-3">
              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <FaHashtag className="me-2 text-secondary" />
                  <strong>Transaction ID:</strong>
                </div>
                <p className="ms-4 text-muted">{transaction.transaction_id || "N/A"}</p>
              </Col>

              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <FaUser className="me-2 text-secondary" />
                  <strong>Vendor Name:</strong>
                </div>
                <p className="ms-4 text-muted">{transaction.vendor_name || "N/A"}</p>
              </Col>

              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <FaPhone className="me-2 text-secondary" />
                  <strong>Vendor Phone:</strong>
                </div>
                <p className="ms-4 text-muted">{transaction.vendor_phone_number || "N/A"}</p>
              </Col>

              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <FaEnvelope className="me-2 text-secondary" />
                  <strong>Vendor Email:</strong>
                </div>
                <p className="ms-4 text-muted">{transaction.vendor_email || "N/A"}</p>
              </Col>

              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <FaBox className="me-2 text-secondary" />
                  <strong>Product Name:</strong>
                </div>
                <p className="ms-4 text-muted">{transaction.product_name || "N/A"}</p>
              </Col>

              <Col md={3}>
                <div className="d-flex align-items-center mb-2">
                  <strong>Quantity:</strong>
                </div>
                <p className="ms-2 text-muted">{transaction.product_quantity || 0}</p>
              </Col>

              <Col md={3}>
                <div className="d-flex align-items-center mb-2">
                  <FaMoneyBill className="me-2 text-secondary" />
                  <strong>Price:</strong>
                </div>
                <p className="ms-4 text-muted">₦{transaction.product_price || 0}</p>
              </Col>

              <Col md={12}>
                <div className="d-flex align-items-center mb-2">
                  <FaMapMarkerAlt className="me-2 text-secondary" />
                  <strong>Delivery Address:</strong>
                </div>
                <p className="ms-4 text-muted">{transaction.delivery_address || "N/A"}</p>
              </Col>

              <Col md={12}>
                <div className="d-flex align-items-center mb-2">
                  <strong>Product Description:</strong>
                </div>
                <p className="ms-2 text-muted">{transaction.product_description || "No description provided"}</p>
              </Col>

              {productImageURL && (
                <Col md={12}>
                  <div className="d-flex align-items-center mb-2">
                    <FaFileImage className="me-2 text-secondary" />
                    <strong>Product Image:</strong>
                  </div>
                  <div className="ms-4">
                    <img
                      src={productImageURL}
                      alt="Product"
                      className="img-fluid rounded-3 border"
                      style={{ maxHeight: "150px", maxWidth: "200px", objectFit: "cover" }}
                    />
                  </div>
                </Col>
              )}

              <Col md={12}>
                <hr className="my-3" />
                <div className="text-end">
                  <h4 className="text-success fw-bold">
                    Total: ₦{transactionTotal}
                  </h4>
                </div>
              </Col>
            </Row>
          </Card>
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-center">
          <Button 
            variant="outline-secondary" 
            onClick={handleCloseModal}
            className="px-4 py-2 rounded-3"
          >
            Edit Details
          </Button>
          <Button 
            variant="success" 
            onClick={handleConfirmProceed}
            className="px-4 py-2 rounded-3"
          >
            Confirm & Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BuyerResolveTransactionDisputeForm;
