import React from "react";
import { UserDashboardCardsTwo } from "../../components/CardComponents/UsersCards";
import {
  BuyingIcon,
  SellingIcon,
} from "../../components/IconComponent/UserdashboardIcons";
import UsersSideNav from "../../components/NavbarComponents/UsersSideNav";

const InitiateTransactionPage = () => {
  return (
    <div>
      <div className="row">
        <div className="col-md-3">
          <UsersSideNav />
        </div>
        <div className="col-md-9">
          <InitiateCard />
        </div>
      </div>
    </div>
  );
};

const InitiateCard = () => {
  return (
    <div className="row mt-5 container">
      <div className="col-md-6 col-sm-12">
        <UserDashboardCardsTwo value={`BUYING`} icon={<BuyingIcon />} />
      </div>
      <div className="col-md-6 col-sm-12">
        <UserDashboardCardsTwo value={`SELLING`} icon={<SellingIcon />} />
      </div>
    </div>
  );
};

export default InitiateTransactionPage;
