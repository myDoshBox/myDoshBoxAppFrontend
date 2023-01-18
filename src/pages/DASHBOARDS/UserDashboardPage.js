import React from "react";
import { MiniProfileCard } from "../../components/CardComponents/UsersCards";
import { UserDashboardCard2 } from "../../components/CardComponents/UsersCards";
import {
  InitiateTransactionIcon,
  SettledTransactionIcon,
  CustomerCareIcon,
  InitiateDisputeIcon,
} from "../../components/IconComponent/UserdashboardIcons";
import { LearnMoreCard } from "../../components/CardComponents/InfoCards";
import UsersSideNav from "../../components/NavbarComponents/UsersSideNav";
import { MiniDisputesCard } from "../../components/CardComponents/ConflictIssuesCards";
import { AllConflictsTable } from "../../components/TableComponents/ConflictsTable";

const UserDashboardPage = () => {
  return (
    <div className="contestPage">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <UserDashboard />
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  return (
    <div className="row pt-5">
      <div className="col-md-5 d-none d-md-block">
        <MiniProfileCard />
      </div>
      <div className="col-lg-7 col-sm-12 row">
        <div className="col-12 row">
          <div className="col-sm-12 mb-3 mb-md-2 col-lg-6 mt-4 mt-lg-0">
            <UserDashboardCard2
              icon={<InitiateTransactionIcon />}
              text={`Initiate
Transaction`}
            />
          </div>
          <div className="col-sm-12 mb-3 mb-md-2 col-lg-6">
            <UserDashboardCard2
              text={`Settled Transactions`}
              icon={<SettledTransactionIcon />}
            />
          </div>
        </div>
        <div className="col-12 row">
          <div className="col-sm-12 mb-3 mb-md-2 col-lg-6">
            <UserDashboardCard2
              text={`Initiate Transaction`}
              icon={<InitiateTransactionIcon />}
            />
          </div>
          <div className="col-sm-12 mb-3 mb-md-2 col-lg-6">
            <UserDashboardCard2
              text={`Settled Transactions`}
              icon={<SettledTransactionIcon />}
            />
          </div>
        </div>
        {/* <div className="col-12 w-100 mx-auto d-md-none">
          <LearnMoreCard />
        </div>
        <div className="col-12 w-100 d-none d-md-block">
          <LearnMoreCard />
        </div> */}
      </div>
      <div>
        <MiniTransaction />
      </div>
    </div>
  );
};

const MiniTransaction = () => {
  return (
    <div>
      <div className="row container">
        <div className="col-md-7 mt-5">{/* <AllConflictsTable /> */}</div>
        <div className="mt-5 pb-5 col-md-5">
          <div>
            <MiniDisputesCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
