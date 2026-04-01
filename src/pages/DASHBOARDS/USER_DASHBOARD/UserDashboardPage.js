import React from "react";
// Import necessary components and icons
import {
  UserDashboardCard2,
  OpenConflitCard,
} from "../../../components/CardComponents/UsersCards";
import BankDetailsPromptModal from "../../../components/utils/BankDetailsPromptModal";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { RecentNotification } from "../../../components/NotificationComponent/NotificationComponents";
import { UserdashboardTransaction } from "../../../components/TableComponents/TransactionHistory";
// import { RecentDispute } from "../../../components/CardComponents/TransactionDetails";
import { RecentTransactionTable } from "../../TRANSACTION_PAGES/PRODUCT_TRANSACTION_PAGES/UserTransactionHistory";

// Main Dashboard Page Component
const UserDashboardPage = () => {
  return (
    <div
      className="container-fluid px-0"
      style={{
        backgroundColor: "#F9F9FB",
        minHeight: "100vh",
      }}
    >
      {" "}
      <BankDetailsPromptModal />
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />
          <div className="px-3 px-lg-4 py-2">
            <UserDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

// Core User Dashboard Content (this component remains unchanged in this particular update)
const UserDashboard = () => {
  return (
    <div className="">
      {/* --- Section 1: Overview and Quick Actions --- */}
      <section className="mb-4">
        {/* Row for Primary Action Cards */}
        <div className="row g-2">
          {/* Use g-3 for consistent guttering */}
          <div className="col-sm-6 col-md-3">
            {/* Adjust column sizes for better spacing */}
            <UserDashboardCard2
              icon={
                <i className="bi bi-play-circle-fill fs-2 text-success"></i>
              }
              text="Start a Transaction"
              link="initiate-escrow"
            />
          </div>
          <div className="col-sm-6 col-md-3">
            {/* <UserDashboardCard2
              icon={<i className="bi bi-hourglass-split fs-2 text-warning"></i>}
              text="Ongoing Transaction"
              link="transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history"
            /> */}
          </div>
          <div className="col-sm-6 col-md-3">
            {/* <UserDashboardCard2
              icon={
                <i className="bi bi-check-circle-fill fs-2 text-primary"></i>
              }
              text="Closed Transaction"
              link="transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
            /> */}
          </div>
          <div className="col-sm-6 col-md-3">
            <UserDashboardCard2
              icon={
                <i className="bi bi-exclamation-triangle-fill fs-2 text-danger"></i>
              }
              text="Initiate Disputes"
              link="disputes/initiate-dispute/:transaction_id"
            />
          </div>
        </div>
      </section>
      {/* --- Section 2: Recent Activity (Disputes & Transactions) --- */}
      <section className="recent-activity mb-5 mt-5">
        <h3 className="fs-4">Transaction History</h3>
        <div className=" col-12">
          {/* Give more space to the transaction table */}
          {/* <h3 className="sub-section-title mb-3 fs-4">Transaction History</h3> */}
          <RecentTransactionTable />
        </div>
      </section>
      {/* --- Section 3: Notifications --- */}
      <section className="notifications-section mb-5">
        <h2 className="section-title mb-4 fs-4">Notifications</h2>
        <RecentNotification />
      </section>
    </div>
  );
};

export default UserDashboardPage;
