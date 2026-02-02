import { Button } from "react-bootstrap";
// CreateTransaction
export const CreateTransactionButton = () => {
  return (
    <Button className=" start-transaction-btn all-btn border-0 mt-3">
      START A TRANSACTION
      <svg
        width="20"
        height="12"
        viewBox="0 0 15 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-3 mb-1"
      >
        <path
          d="M14.3536 4.35355C14.5488 4.15829 14.5488 3.84171 14.3536 3.64645L11.1716 0.464466C10.9763 0.269204 10.6597 0.269204 10.4645 0.464466C10.2692 0.659728 10.2692 0.976311 10.4645 1.17157L13.2929 4L10.4645 6.82843C10.2692 7.02369 10.2692 7.34027 10.4645 7.53553C10.6597 7.7308 10.9763 7.7308 11.1716 7.53553L14.3536 4.35355ZM0 4.5H14V3.5H0V4.5Z"
          fill="white"
        />
      </svg>
    </Button>
  );
};
// NewTransactionButton
export const NewTransactionButton = () => {
  return (
    <Button className=" new-transaction-btn all-btn border-0 mt-3">
      New Transaction
    </Button>
  );
};
// ProceedButton

export const ProceedButton = () => {
  return (
    <Button
      className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
      style={{ width: "120px" }}
      type="submit"
    >
      PROCEED
    </Button>
  );
};
export const StartTransaction = () => {
  return (
    <Button className="p-3 mt-3 GeneralBtnStyle1 text-white  rounded-1   btn btn-success">
      START A TRANSACTION<i class="bi bi-arrow-right ms-2"></i>
    </Button>
  );
};

// ConfirmDelivery
export const ConfirmDeliveryButton = () => {
  return (
    <Button className="confirm-delivery-btn border-0">Confirm Delivery</Button>
  );
};
// IAgreeButton
export const IAgreeButton = () => {
  return (
    <Button
      className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white pale-red"
      style={{ width: "110px" }}
    >
      I Agree
    </Button>
  );
};
// ConfirmButton
export const ConfirmButton = () => {
  return <Button className="confirm-delivery-btn border-0">Confirm</Button>;
};
// DeliverProductButton
export const DeliverProductButton = () => {
  return (
    <Button className="confirm-delivery-btn border-0">Deliver Product</Button>
  );
};
