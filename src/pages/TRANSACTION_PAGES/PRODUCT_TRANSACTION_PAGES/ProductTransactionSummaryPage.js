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
import { Button } from "react-bootstrap";

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
  // const loggedInUser = localStorage.getItem("userInfo");
  // const userInfo = JSON.parse(loggedInUser).user.email;

  const { userInfo } = useSelector((state) => state.usersauth);

  // console.log("userEmail", userEmail);
  const userEmail = userInfo?.user?.email;

  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/userdashboard/agreement");
  };

  return (
    <div className="row">
      <div>
        <TransactionDetails
          heading={`Transaction Summary`}
          buyer_email={`Please Confirm the following transaction initiated by user ${userEmail}`}
          product_image={escrowProductInfo.product_image}
          product_name={escrowProductInfo.product_name}
          transaction_type={escrowProductInfo.transaction_type}
          product_price={escrowProductInfo.product_price}
          product_quantity={escrowProductInfo.product_quantity}
          vendor_phone_number={escrowProductInfo.vendor_phone_number}
          vendor_email={escrowProductInfo.vendor_email}
          transaction_total={escrowProductInfo.transaction_total}
          product_description={escrowProductInfo.product_description}
          delivery_address={escrowProductInfo.delivery_address}
          alert={` By clicking proceed you are hereby accepting the terms and conditions of the buyer as stated above`}
          leftBtn={
            <Link to={"../initiate-escrow"}>
              <BackButton />
            </Link>
          }
          rightBtn={
            <Button
              className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
              style={{ width: "120px" }}
              onClick={handleSubmit}
            >
              PROCEED
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default ProductTransactionSummaryPage;
