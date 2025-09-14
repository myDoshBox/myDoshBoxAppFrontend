import { useState, useEffect } from "react";
// import { Button, Form } from "react-bootstrap";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { CancelButton } from "../../../components/ButtonsComponent/OtherButtons";
import { ProceedButton } from "../../../components/ButtonsComponent/TransactionButtons";
import { Button, Form, Card, Row, Col, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import { setEscrowProduct } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
import { setShippingInfo } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
import { useAppContext } from "../../../context/appContext";
import { toast } from "react-toastify";

const ShippingDetailsForm = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row">
          <div className="col-lg-3 col-sm-12"></div>

          <div className="col-lg-9 col-sm-12">
            <UserDashboardNavbar />
            <div className="mt-5">
              <ShippingDetailsFormLogic />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const ShippingDetailsFormLogic = () => {
  const location = useLocation();
  const { transactionId: paramId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get transaction from state, fallback to URL param for id
  const transaction = location.state?.transaction;
  const transactionId = transaction?.transaction_id || paramId || "";

  const { shippingInfo } = useSelector((state) => state.escrowProductInfo);

  const initialValues = {
    transaction_id: transactionId,
    shipping_company: "",
    delivery_person_name: "",
    delivery_person_number: "",
    delivery_person_email: "",
    delivery_date: "",
    pick_up_address: "",
  };

  // Ensure transaction_id is always set from route/state even if shippingInfo exists
  const [shippingValues, setShippingValues] = useState(() => ({
    ...(shippingInfo || initialValues),
    transaction_id: transactionId,
  }));

  const [formErrors, setFormErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  // Keep transaction_id in sync if route changes
  useEffect(() => {
    setShippingValues((prev) => ({ ...prev, transaction_id: transactionId }));
  }, [transactionId]);

  // Guard: prevent direct access without a valid transaction id
  useEffect(() => {
    if (!transactionId) {
      toast.error("Invalid access. Please select a transaction first.");
      navigate("/userdashboard/transaction-history");
    }
  }, [transactionId, navigate]);

  // Live validation on change
  useEffect(() => {
    setFormErrors(validate(shippingValues));
  }, [shippingValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingValues({ ...shippingValues, [name]: value });
  };

  const handleCancel = () => {
    dispatch(setShippingInfo(null));
    navigate("/userdashboard/transaction-history");
  };

  const handleProceed = (e) => {
    e.preventDefault();
    const errs = validate(shippingValues);
    setFormErrors(errs);
    if (Object.keys(errs).length === 0) {
      setShowSummary(true); // ✅ Show summary modal
    }
  };

  const handleConfirmSubmit = () => {
    dispatch(setShippingInfo(shippingValues));
    setShowSummary(false);
    navigate(
      `/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-details-form/shipping-details-summary/${shippingValues?.transaction_id}`
    );
  };

  const validate = (values) => {
    const errors = {};
    if (!values.transaction_id) errors.transaction_id = "Transaction id is required";
    if (!values.shipping_company) errors.shipping_company = "Shipping company is required";
    if (!values.delivery_person_name) errors.delivery_person_name = "Delivery person name is required";
    if (!values.delivery_person_number) errors.delivery_person_number = "Delivery person phone number is required";
    if (
      values.delivery_person_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(values.delivery_person_email)
    ) {
      errors.delivery_person_email = "Invalid email address";
    }
    if (!values.delivery_date) errors.delivery_date = "Delivery date is required";
    if (!values.pick_up_address) errors.pick_up_address = "Pickup address is required";
    return errors;
  };

  return (
    <div className="px-lg-5">
      <h3 className="fw-bold mb-3">Seller Transaction Confirmation</h3>
      <p className="text-muted">
        Please provide the shipping details to confirm this transaction.
      </p>

      <Card className="shadow-sm border-0 rounded p-4">
        <Form onSubmit={handleProceed}>
          {/* Transaction ID (Prefilled & Readonly) */}
          <Form.Group className="mb-3">
            <Form.Label>Transaction ID</Form.Label>
            <Form.Control
              type="text"
              name="transaction_id"
              value={shippingValues.transaction_id}
              readOnly
              className="bg-light"
              isInvalid={!!formErrors.transaction_id}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.transaction_id}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Company</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. DHL, FedEx"
                  name="shipping_company"
                  value={shippingValues.shipping_company}
                  onChange={handleChange}
                  isInvalid={!!formErrors.shipping_company}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.shipping_company}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Date</Form.Label>
                <Form.Control
                  type="date"
                  name="delivery_date"
                  value={shippingValues.delivery_date}
                  onChange={handleChange}
                  isInvalid={!!formErrors.delivery_date}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.delivery_date}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name of Delivery Person</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter delivery person name"
                  name="delivery_person_name"
                  value={shippingValues.delivery_person_name}
                  onChange={handleChange}
                  isInvalid={!!formErrors.delivery_person_name}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.delivery_person_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number of Delivery Person</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  name="delivery_person_number"
                  value={shippingValues.delivery_person_number}
                  onChange={handleChange}
                  isInvalid={!!formErrors.delivery_person_number}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.delivery_person_number}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email of Delivery Person</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter delivery person email"
              name="delivery_person_email"
              value={shippingValues.delivery_person_email}
              onChange={handleChange}
              isInvalid={!!formErrors.delivery_person_email}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.delivery_person_email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Agreed Pickup Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter pickup address"
              name="pick_up_address"
              value={shippingValues.pick_up_address}
              onChange={handleChange}
              isInvalid={!!formErrors.pick_up_address}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.pick_up_address}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-danger" className="px-4" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="px-4 btn-success">
              Proceed
            </Button>
          </div>
        </Form>
      </Card>

      {/* ✅ Summary Modal (refactored, clean labels) */}
      <Modal show={showSummary} onHide={() => setShowSummary(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Shipping Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover size="sm" className="mb-0">
            <tbody>
              <tr>
                <td>Transaction ID</td>
                <td>{shippingValues.transaction_id}</td>
              </tr>
              <tr>
                <td>Shipping Company</td>
                <td>{shippingValues.shipping_company || "-"}</td>
              </tr>
              <tr>
                <td>Delivery Person Name</td>
                <td>{shippingValues.delivery_person_name || "-"}</td>
              </tr>
              <tr>
                <td>Delivery Person Phone</td>
                <td>{shippingValues.delivery_person_number || "-"}</td>
              </tr>
              <tr>
                <td>Delivery Person Email</td>
                <td>{shippingValues.delivery_person_email || "-"}</td>
              </tr>
              <tr>
                <td>Delivery Date</td>
                <td>{shippingValues.delivery_date || "-"}</td>
              </tr>
              <tr>
                <td>Pickup Address</td>
                <td>{shippingValues.pick_up_address || "-"}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSummary(false)}>
            Edit
          </Button>
          <Button variant="success" onClick={handleConfirmSubmit}>
            Confirm & Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ShippingDetailsForm;
