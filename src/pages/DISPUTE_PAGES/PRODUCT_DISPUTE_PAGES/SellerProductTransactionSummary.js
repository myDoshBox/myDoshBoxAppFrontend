import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TransactionDetails } from "../../../components/CardComponents/TransactionDetails";
import {
  BackIcon,
  NextIcon,
} from "../../../components/IconComponent/NavigationAndViewIcon";
import { Link } from "react-router-dom";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { useSelector } from "react-redux";

import { BackButton } from "../../../components/ButtonsComponent/NavigationAndViewButtons";
import { ProceedButton } from "../../../components/ButtonsComponent/TransactionButtons";
import { Button } from "react-bootstrap";
import {
  useConfirmEscrowProductMutation,
  useFetchSingleTransactionsQuery,
} from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { toast } from "react-toastify";

const SellerProductTransactionSummary = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row">
          <div className="col-lg-3 col-sm-12"></div>

          <div className="col-lg-9 col-sm-12">
            <UserDashboardNavbar />
            <div className="mt-5 mb-5">
              <TransactionSummary />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const TransactionSummary = () => {
  // Get the current URL's query parameters
  const { transaction_id } = useParams();
  const navigate = useNavigate();

  console.log(transaction_id);

  const {
    data: transaction,
    isLoading,
    error,
  } = useFetchSingleTransactionsQuery(transaction_id);

  const singleTransaction = transaction?.transaction;

  // when user agrees
  // const navigateToShippingForm = () => {
  //   navigate(
  //     `confirm-escrow-product-transaction/shipping-details-form/${transaction_id}`
  //   );
  // };

  // navigate(`confirm-escrow-product-transaction/${transaction_id}`);

  if (isLoading) return <p>Loading transaction details...</p>;

  if (error) {
    toast.error("Failed to load transaction details");
    return <p>Error loading transaction details</p>;
  }

  // return (
  //   <div className="row">
  //     <h2>Transaction Summary</h2>
  //     {transaction ? (
  //       <TransactionDetails transaction={transaction} />
  //     ) : (
  //       <p>No transaction found</p>
  //     )}
  //   </div>
  // );

  return (
    <>
      <div className="container row mx-auto">
        <div className="col-md-12 col-sm-12">
          <header className="mt-3">
            <h4 className="text-center">
              Initiated Escrow Transaction Summary From Buyer
            </h4>
            <p className="text-center text-muted fw-light">
              {singleTransaction?.product_image}
            </p>
          </header>
          <span className="mx-auto img-fluid">
            <img
              src={singleTransaction?.product_image}
              className="mx-auto"
              style={{ width: "100%" }}
              alt=""
            />
          </span>

          <div className="card-body">
            <div className="p-3 mt-3">
              <div className="d-flex justify-content-between">
                <h5>Transaction ID</h5>
                <p>{singleTransaction?.transaction_id}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5>Product Name</h5>
                <p>{singleTransaction?.product_name}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5>Transaction Type</h5>
                <p>{singleTransaction?.transaction_type}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5>Product Price</h5>
                <p>{singleTransaction?.product_price}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5>Product Quantity</h5>
                <p>{singleTransaction?.product_quantity}</p>
              </div>

              <div className="d-flex justify-content-between">
                <h5>Transaction Time</h5>
                <p>{singleTransaction?.createdAt?.slice(11, 19)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5>Transaction Date</h5>
                <p>{singleTransaction?.createdAt?.slice(0, 10)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5>Description</h5>
                <p>{singleTransaction?.product_description}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h5>Delivery Address</h5>
                <p>{singleTransaction?.delivery_address}</p>
              </div>
            </div>
            <div className="d-flex align-items-center border-danger border-start border-5 mx-auto mt-4 alert alert-danger border-0 rounded-0">
              {/* <CautionIcon /> */}
              <p className="text-danger fs-6 fw-lighter mt-4 ms-3">
                <span className="text-danger fw-bold">Note:</span>
                {alert}
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-center text-">
            <div className="me-5">
              <Button
                // to="/userdashboard/transactionsummary"
                className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white pale-red  me-3"
                style={{ width: "110px" }}
                onClick={() =>
                  navigate(`../../userdashboard/transaction-history`)
                }
              >
                I Reject
              </Button>
            </div>
            <div>
              <Button
                className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
                style={{ width: "110px" }}
                // onClick={navigateToShippingForm}
                onClick={() => navigate(`shipping-details-form`)}
              >
                I Agree
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerProductTransactionSummary;
