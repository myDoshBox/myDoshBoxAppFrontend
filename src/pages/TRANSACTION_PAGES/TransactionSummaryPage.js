import React from "react";
import { TransactionDetails } from "../../components/CardComponents/TransactionDetails";
import { GeneralBtn } from "../../components/ButtonsComponent/GenandAuthBtn";
import {
  BackIcon,
  NextIcon,
} from "../../components/IconComponent/NavigationAndViewIcon";
import UsersSideNav from "../../components/NavbarComponents/UsersSideNav";

const TransactionSummaryPage = () => {
  return (
    <div className="contestPage">
      <div className="row">
        <div className="col-md-3">
          <UsersSideNav />
        </div>
        <div className="col-md-9">
          <TransactionSummary />
        </div>
      </div>
    </div>
  );
};

const TransactionSummary = () => {
  return (
    <div className="row">
      <div className="">
        <TransactionDetails
          heading={`Transaction Summary
`}
          sub_text={`Please Confirm the following transaction initiated by user Eland Aaronson`}
          email={`Opeyemi Andrewson`}
          id={`AXSQWEDSC`}
          description={`AXSQWEDSC`}
          quality={`30`}
          price={`N 120,000`}
          date={`14 Aug 2022`}
          total={`N3,600,000`}
          alert={` By clicking proceed you are hereby accepting the terms and conditions of the buyer as stated above`}
          leftBtn={
            <GeneralBtn
              text="Back"
              styles="CancelBtn btn all-btn text-white"
              icon={<BackIcon />}
            />
          }
          rightBtn={
            <GeneralBtn
              text="Proceed"
              styles="GeneralBtnStyle1 btn all-btn text-white"
              icon={<NextIcon />}
            />
          }
        />
      </div>
    </div>
  );
};

export default TransactionSummaryPage;
