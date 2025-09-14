import { useNavigate } from "react-router-dom";
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
import { Button, Container, Row, Col, Card } from "react-bootstrap";


const ProductTransactionSummaryPage = () => {
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
  const { escrowProductInfo } = useSelector((state) => state.escrowProductInfo);
  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail = userInfo?.user?.email;
  const vendorName = escrowProductInfo?.vendor_name || "Vendor";
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/userdashboard/agreement");
  };

  return (
    <Container className="py-4">
      <div className="bg-white shadow rounded p-3 p-md-5 border">
        <h4 className="text-center fw-bold text-success mb-2">Transaction Summary</h4>
        <p className="text-center text-muted mb-4">
          Review the transaction initiated by{" "}
          <strong className="text-dark">{userEmail}</strong>
        </p>

        <Row className="gy-4 align-items-start">
          <Col xs={12} md={4} className="text-center">
            <img
              src={escrowProductInfo?.product_image || "/placeholder.jpg"}
              alt="Product"
              className="img-fluid rounded shadow-sm border"
              style={{
                maxHeight: "220px",
                objectFit: "cover",
                backgroundColor: "#f8f9fa",
              }}
            />
          </Col>

          <Col xs={12} md={8}>
            <div className="mb-2">
              <strong className="text-secondary">Product:</strong>{" "}
              {escrowProductInfo.product_name}
            </div>
            <div className="mb-2">
              <strong className="text-secondary">Type:</strong>{" "}
              {escrowProductInfo.transaction_type}
            </div>
            <div className="mb-2">
              <strong className="text-secondary">Quantity:</strong>{" "}
              {escrowProductInfo.product_quantity}
            </div>
            <div className="mb-2">
              <strong className="text-secondary">Price:</strong>{" "}
              ₦{escrowProductInfo.product_price}
            </div>
            <div className="mb-2">
              <strong className="text-secondary">Total:</strong>{" "}
              <span className="text-success fw-bold">
                ₦{escrowProductInfo.transaction_total}
              </span>
            </div>
            <div className="mb-2">
              <strong className="text-secondary">Vendor Email:</strong>{" "}
              {escrowProductInfo.vendor_email}
            </div>
            <div className="mb-2">
              <strong className="text-secondary">Vendor Phone:</strong>{" "}
              {escrowProductInfo.vendor_phone_number}
            </div>
            <div className="mb-2">
              <strong className="text-secondary">Description:</strong>{" "}
              {escrowProductInfo.product_description}
            </div>
            <div className="mb-2">
              <strong className="text-secondary">Delivery Address:</strong>{" "}
              {escrowProductInfo.delivery_address}
            </div>
          </Col>
        </Row>
           
        
        <hr className="my-4" />

          <Row className="gy-2">
            <Col xs={12} md={4}>
              <div className="bg-light p-3 rounded text-center h-100">
                <strong className="text-primary">Buyer’s Name</strong>
                <div>{userEmail}</div>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="bg-light p-3 rounded text-center h-100">
                <strong className="text-success">Seller’s Name</strong>
                <div>{vendorName}</div>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="bg-light p-3 rounded text-center h-100">
                <strong className="text-warning">Escrow Platform</strong>
                <div>Doshbox App</div>
              </div>
            </Col>
          </Row>

        <div className="alert alert-warning text-center small mt-4">
          <strong className="text-dark">Note:</strong> By clicking{" "}
          <strong>Proceed</strong>, you confirm and accept the buyer's terms and conditions.
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
          <Link to="../initiate-escrow" className="w-100 w-sm-50">
            <Button
              variant="outline-danger"
              className="w-100 fw-semibold border-2"
            >
              Back
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            className="w-100 w-sm-50 fw-semibold text-white"
            style={{ backgroundColor: "rgb(0, 104, 71)", border: "none" }}
          >
            Proceed
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ProductTransactionSummaryPage;

// const TransactionSummary = () => {
//   const { escrowProductInfo } = useSelector((state) => state.escrowProductInfo);
//   // const loggedInUser = localStorage.getItem("userInfo");
//   // const userInfo = JSON.parse(loggedInUser).user.email;

//   const { userInfo } = useSelector((state) => state.usersauth);

//   // console.log("userEmail", userEmail);
//   const userEmail = userInfo?.user?.email;

//   const navigate = useNavigate();

//   const handleSubmit = () => {
//     navigate("/userdashboard/agreement");
//   };

//   return (
//     <div className="row">
//       <div>
//         <TransactionDetails
//           heading={`Transaction Summary`}
//           buyer_email={`Please Confirm the following transaction initiated by user ${userEmail}`}
//           product_image={escrowProductInfo.product_image}
//           product_name={escrowProductInfo.product_name}
//           transaction_type={escrowProductInfo.transaction_type}
//           product_price={escrowProductInfo.product_price}
//           product_quantity={escrowProductInfo.product_quantity}
//           vendor_phone_number={escrowProductInfo.vendor_phone_number}
//           vendor_email={escrowProductInfo.vendor_email}
//           transaction_total={escrowProductInfo.transaction_total}
//           product_description={escrowProductInfo.product_description}
//           delivery_address={escrowProductInfo.delivery_address}
//           alert={` By clicking proceed you are hereby accepting the terms and conditions of the buyer as stated above`}
//           leftBtn={
//             <Link to={"../initiate-escrow"}>
//               <BackButton />
//             </Link>
//           }
//           rightBtn={
//             <Button
//               className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
//               style={{ width: "120px" }}
//               onClick={handleSubmit}
//             >
//               PROCEEd
//             </Button>
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductTransactionSummaryPage;
