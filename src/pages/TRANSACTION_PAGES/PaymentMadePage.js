import React from "react";
import { TransactionDetails } from "../../components/CardComponents/TransactionDetails";
import {
  BackIcon,
  NextIcon,
} from "../../components/IconComponent/NavigationAndViewIcon";
import UsersSideNav from "../../components/NavbarComponents/UsersSideNav";
import {
  CancelButton,
  DeleteProduct,
} from "../../components/ButtonsComponent/OtherButtons";

const PaymentMadePage = () => {
  return (
    <div className="contestPage">
      <div className="row">
        <div className="col-md-3">
          <UsersSideNav />
        </div>
        <div className="col-md-9">
          <PaymentMade />
        </div>
      </div>
    </div>
  );
};

const PaymentMade = () => {
  return (
    <div className="row">
      <div className="">
        <TransactionDetails
          heading={`Payment Made`}
          sub_text={`Buyer Elland Aaronson has made payment into MyDoshBox account for this transaction`}
          email={`Opeyemi Andrewson`}
          id={`AXSQWEDSC`}
          description={`AXSQWEDSC`}
          quality={`30`}
          price={`N 120,000`}
          date={`14 Aug 2022`}
          total={`N3,600,000`}
          alert={` By clicking proceed you are hereby accepting the terms and conditions of the buyer as stated above`}
          leftBtn={<CancelButton />}
          rightBtn={<DeleteProduct />}
        />
      </div>
    </div>
  );
};

export default PaymentMadePage;
