import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Card, Alert, Spinner } from "react-bootstrap";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { toast } from "react-toastify";
import { useSellerFillOutShippingDetailsMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";

const FillShippingDetailsPage = () => {
  const { transaction_id } = useParams();
  const navigate = useNavigate();

  const [sellerFillOutShippingDetails, { isLoading }] =
    useSellerFillOutShippingDetailsMutation();

  const [formData, setFormData] = useState({
    shipping_company: "",
    delivery_person_name: "",
    delivery_person_number: "",
    delivery_person_email: "",
    delivery_date: "",
    pick_up_address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await sellerFillOutShippingDetails({
        ...formData,
        transaction_id,
      }).unwrap();

      if (response.status === "success") {
        toast.success("Shipping details submitted successfully!");
        setTimeout(() => {
          navigate("/userdashboard/transaction-history");
        }, 2000);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit shipping details");
      console.error("Error:", err);
    }
  };

  return (
    <div className="contestPage" style={{ backgroundColor: "#F9F9FB" }}>
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>
        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />

          <div className="mt-5 px-3 px-md-4">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {/* Header */}
                <div className="mb-4">
                  <Button
                    variant="link"
                    className="text-decoration-none p-0 mb-3"
                    onClick={() => navigate(-1)}
                    style={{ color: "#006747EB", fontSize: "0.95rem" }}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Transaction
                  </Button>
                  <h2 className="fw-bold" style={{ color: "#1a1a1a" }}>
                    <i
                      className="bi bi-truck me-3"
                      style={{ color: "#006747EB" }}></i>
                    Fill Shipping Details
                  </h2>
                  <p className="text-muted mb-0">
                    Transaction ID:{" "}
                    <code style={{ color: "#006747EB" }}>{transaction_id}</code>
                  </p>
                </div>

                {/* Form Card */}
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                      {/* Shipping Company */}
                      <div className="mb-4">
                        <Form.Label
                          className="fw-semibold"
                          style={{ fontSize: "0.95rem" }}>
                          <i
                            className="bi bi-building me-2"
                            style={{ color: "#006747EB" }}></i>
                          Shipping Company
                          <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="shipping_company"
                          value={formData.shipping_company}
                          onChange={handleChange}
                          placeholder="e.g., FedEx Logistics, DHL, UPS"
                          required
                          disabled={isLoading}
                          style={{
                            fontSize: "0.95rem",
                            padding: "12px 16px",
                            borderColor: "#dee2e6",
                          }}
                        />
                      </div>

                      {/* Delivery Person Details */}
                      <div className="mb-4">
                        <h6
                          className="fw-bold mb-3"
                          style={{ color: "#006747EB", fontSize: "1rem" }}>
                          <i className="bi bi-person-badge me-2"></i>
                          Delivery Person Information
                        </h6>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <Form.Label
                              className="fw-semibold"
                              style={{ fontSize: "0.875rem" }}>
                              Full Name
                              <span className="text-danger ms-1">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="delivery_person_name"
                              value={formData.delivery_person_name}
                              onChange={handleChange}
                              placeholder="John Doe"
                              required
                              disabled={isLoading}
                              style={{
                                fontSize: "0.95rem",
                                padding: "12px 16px",
                              }}
                            />
                          </div>

                          <div className="col-md-6">
                            <Form.Label
                              className="fw-semibold"
                              style={{ fontSize: "0.875rem" }}>
                              Phone Number
                              <span className="text-danger ms-1">*</span>
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="delivery_person_number"
                              value={formData.delivery_person_number}
                              onChange={handleChange}
                              placeholder="+2348023456789"
                              required
                              disabled={isLoading}
                              style={{
                                fontSize: "0.95rem",
                                padding: "12px 16px",
                              }}
                            />
                          </div>

                          <div className="col-12">
                            <Form.Label
                              className="fw-semibold"
                              style={{ fontSize: "0.875rem" }}>
                              Email Address
                              <span className="text-danger ms-1">*</span>
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="delivery_person_email"
                              value={formData.delivery_person_email}
                              onChange={handleChange}
                              placeholder="johndoe@company.com"
                              required
                              disabled={isLoading}
                              style={{
                                fontSize: "0.95rem",
                                padding: "12px 16px",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pickup & Delivery Details */}
                      <div className="mb-4">
                        <h6
                          className="fw-bold mb-3"
                          style={{ color: "#006747EB", fontSize: "1rem" }}>
                          <i className="bi bi-geo-alt me-2"></i>
                          Pickup & Delivery Information
                        </h6>

                        <div className="row g-3">
                          <div className="col-12">
                            <Form.Label
                              className="fw-semibold"
                              style={{ fontSize: "0.875rem" }}>
                              Pickup Address
                              <span className="text-danger ms-1">*</span>
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="pick_up_address"
                              value={formData.pick_up_address}
                              onChange={handleChange}
                              placeholder="12, Broad Street, Victoria Island, Lagos"
                              required
                              disabled={isLoading}
                              style={{
                                fontSize: "0.95rem",
                                padding: "12px 16px",
                              }}
                            />
                          </div>

                          <div className="col-md-6">
                            <Form.Label
                              className="fw-semibold"
                              style={{ fontSize: "0.875rem" }}>
                              Expected Delivery Date
                              <span className="text-danger ms-1">*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="delivery_date"
                              value={formData.delivery_date}
                              onChange={handleChange}
                              min={new Date().toISOString().split("T")[0]}
                              required
                              disabled={isLoading}
                              style={{
                                fontSize: "0.95rem",
                                padding: "12px 16px",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Info Alert */}
                      <Alert
                        variant="info"
                        className="border-0"
                        style={{ backgroundColor: "#e7f5f1" }}>
                        <small style={{ color: "#006747EB" }}>
                          <i className="bi bi-info-circle me-2"></i>
                          Make sure all shipping details are accurate. Both
                          buyer and delivery person will receive email
                          notifications with these details.
                        </small>
                      </Alert>

                      {/* Submit Buttons */}
                      <div className="d-flex gap-3 mt-4">
                        <Button
                          type="button"
                          variant="outline-secondary"
                          onClick={() => navigate(-1)}
                          disabled={isLoading}
                          className="px-4"
                          style={{ fontSize: "0.95rem" }}>
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-grow-1 border-0"
                          style={{
                            backgroundColor: "#006747EB",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            padding: "12px",
                          }}>
                          {isLoading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              Submit Shipping Details
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>

                {/* Help Section */}
                <Card
                  className="border-0 shadow-sm mt-4"
                  style={{ backgroundColor: "#f8f9fa" }}>
                  <Card.Body className="p-4">
                    <h6
                      className="fw-bold mb-3"
                      style={{ fontSize: "0.95rem" }}>
                      <i className="bi bi-question-circle me-2"></i>
                      Need Help?
                    </h6>
                    <ul
                      className="mb-0"
                      style={{ fontSize: "0.875rem", color: "#6c757d" }}>
                      <li className="mb-2">
                        Ensure the shipping company name is accurate
                      </li>
                      <li className="mb-2">
                        Provide valid contact details for the delivery person
                      </li>
                      <li className="mb-2">Double-check the pickup address</li>
                      <li>Set a realistic delivery date</li>
                    </ul>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FillShippingDetailsPage;
