import { useState } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserSidenav } from "../../components/NavbarComponents/SideNavbar";
import { CancelButton } from "../../components/ButtonsComponent/OtherButtons";
import { ProceedButton } from "../../components/ButtonsComponent/TransactionButtons";

const BankTransferForm = () => {
  const [bankTransfer, setBankTransfer] = useState({
    transactionId: "",
    depositorName: "",
    amountPaid: "",
    dateOfPayment: Date,
    timeOfPayment: "",
  });

  const [bankTransferDetails, setBankTransferDetails] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBankTransfer({ ...bankTransfer, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      bankTransfer.transactionId &&
      bankTransfer.depositorName &&
      bankTransfer.amountPaid &&
      bankTransfer.timeOfPayment &&
      bankTransfer.dateOfPayment
    ) {
      setBankTransferDetails([...bankTransferDetails, bankTransfer]);
      setBankTransfer({
        transactionId: "",
        depositorName: "",
        amountPaid: "",
        dateOfPayment: Date,
        timeOfPayment: "",
      });
    }
  };

  return (
    <div className="d-flex w-100">
      <div className="d-none d-lg-block">
        <UserSidenav />
      </div>
      <Form
        onSubmit={handleSubmit}
        className="mx-lg-5 mt-5 shadow InitiateEscrow w-100 p-3 p-lg-5"
      >
        <h4 className="text-center mt-1">Bank Transfer Form</h4>
        <p className="text-center confirm-delivery-pText">
          Pay the sum of [Total] into the following Bank Account
        </p>
        <div className="account-details">
          <div className="ps-3 py-3">
            <p className="text-danger">
              Account Number: <b>0456536668</b>
            </p>
            <p className="text-danger">
              Bank: <b> Guaranty Trust Bank (GTB)</b>
            </p>
            <p className="text-danger m-0">
              Account Name: <b>Olasunkanmi Mohammed IDRIS </b>
            </p>
          </div>
        </div>
        <Form.Group className="mt-5 mb-3">
          <Form.Label className="m-0">Transaction ID</Form.Label>
          <Form.Control
            type="text"
            // placeholder="Enter buyer/username email"
            id="transactionId"
            name="transactionId"
            value={bankTransfer.transactionId}
            onChange={handleChange}
            className="escrow-input-field"
          />
          <small className="small-text text-danger fst-italic fw-lighter">
            *This field is required
          </small>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="m-0">Depositor Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name of account that made payment"
            id="depositorName"
            name="depositorName"
            value={bankTransfer.depositorName}
            onChange={handleChange}
            className="escrow-input-field"
          />
          <small className="small-text text-danger fst-italic fw-lighter">
            *This field is required
          </small>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="m-0">Amount Paid</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter the amount that was paid"
            id="amountPaid"
            name="amountPaid"
            value={bankTransfer.amountPaid}
            onChange={handleChange}
            className="escrow-input-field"
          />
          <small className="small-text text-danger fst-italic fw-lighter">
            *This field is required
          </small>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="m-0">Date of Payment</Form.Label>
          <Form.Control
            type="date"
            placeholder="Enter the date payment was paid"
            id="dateOfPayment"
            name="dateOfPayment"
            value={bankTransfer.dateOfPayment}
            onChange={handleChange}
            className="escrow-input-field"
          />
          <small className="small-text text-danger fst-italic fw-lighter">
            *This field is required
          </small>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="m-0">Time of Payment</Form.Label>
          <Form.Control
            type="time"
            id="timeOfPayment"
            name="timeOfPayment"
            value={bankTransfer.timeOfPayment}
            onChange={handleChange}
            className="escrow-input-field"
          />
          <small className="small-text text-danger fst-italic fw-lighter">
            *This field is required
          </small>
        </Form.Group>
        <div className="d-flex justify-content-center mt-5">
          <Link to="/escrow">
            <CancelButton />
          </Link>
          <Link to="">
            <ProceedButton />
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default BankTransferForm;
