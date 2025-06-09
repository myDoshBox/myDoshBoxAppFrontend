import React from "react";
// import { MiniProfileCard } from "../../../components/CardComponents/UsersCards";
import {
  UserDashboardCard2,
  OpenConflitCard,
} from "../../../components/CardComponents/UsersCards";
import {
  InitiateTransactionIcon,
  SettledTransactionIcon,
  CustomerCareIcon,
  InitiateDisputeIcon,
} from "../../../components/IconComponent/UserdashboardIcons";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { RecentNotification } from "../../../components/NotificationComponent/NotificationComponents";
import { UserdashboardTransaction } from "../../../components/TableComponents/TransactionHistory";
import { RecentDispute } from "../../../components/CardComponents/TransactionDetails";

const UserDashboardPage = () => {
  return (
    <div className="contestPage">
      <div className="row">
        <div className="col-lg-3"></div>
        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5">
            <UserDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  return (
    <div className="row">
      <div className="col-lg-12 col-sm-12">
        <div className="row mb-3">
          <div className="col-sm-12 mb-4 mb-md-2 col-lg-3 mt-4 mt-lg-0">
            <UserDashboardCard2
              icon={<InitiateTransactionIcon />}
              text={`Initiate Transaction`}
              link={"initiate-escrow"}
            />
          </div>
          <div className="col-sm-12 mb-4 mb-md-2 col-lg-3">
            <UserDashboardCard2
              text={`Transactions in Progress`}
              icon={<CustomerCareIcon />}
              link={
                "transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history"
              }
            />
          </div>
          <div className="col-sm-12 mb-4 mb-md-2 col-lg-3">
            <UserDashboardCard2
              text={`Settled Transactions`}
              icon={<SettledTransactionIcon />}
              link={
                "transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
              }
            />
          </div>

          <div className="col-sm-12 mb-3 mb-md-2 col-lg-3">
            <UserDashboardCard2
              text={`Initiate Disputes`}
              icon={<InitiateDisputeIcon />}
              link={"initiate-dispute"}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-sm-12">
            <div className="row">
              <div className="col-lg-4 col-sm-12">
                <RecentDispute />
              </div>

              <div className="col-lg-8 col-sm-12 mt-3">
                <UserdashboardTransaction />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 mb-5">
        <RecentNotification />
      </div>
    </div>
  );
};

export default UserDashboardPage;
