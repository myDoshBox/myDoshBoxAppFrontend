import React from "react";
// Import necessary components and icons
import {
  UserDashboardCard2,
  OpenConflitCard,
} from "../../../components/CardComponents/UsersCards";
// import {
//   InitiateTransactionIcon,
//   SettledTransactionIcon,
//   CustomerCareIcon,
//   InitiateDisputeIcon,
// } from "../../../components/IconComponent/UserdashboardIcons";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { RecentNotification } from "../../../components/NotificationComponent/NotificationComponents";
import { UserdashboardTransaction } from "../../../components/TableComponents/TransactionHistory";
import { RecentDispute } from "../../../components/CardComponents/TransactionDetails";

// Main Dashboard Page Component
const UserDashboardPage = () => {
  return (
    <div
      className="container-fluid user-dashboard-page"
      style={{
        backgroundColor: "rgb(249, 249, 251)", // Embedded style line here
        minHeight: "100vh", // Good practice to ensure it covers the full viewport height
      }}
    >
      <div className="row">
        {/* Potentially a fixed sidebar/left panel for user profile or navigation, if col-lg-3 is for that */}
        <div className="col-lg-3 d-none d-lg-block">
          {/* This column is currently empty. You could place a user profile card or main navigation here. */}
          {/* <MiniProfileCard /> */}
          {/* Or main navigation links */}
        </div>

        <div className="col-lg-9 col-12">
          {/* Use col-12 for smaller screens to take full width */}
          <UserDashboardNavbar /> {/* Top navigation for the dashboard */}
          <div className="dashboard-content mt-4">
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
    <div className="user-dashboard-main">
      {/* --- Section 1: Overview and Quick Actions --- */}
      <section className="dashboard-overview mb-5"> 
        
        {/* Row for Primary Action Cards */}
        <div className="row g-3">
          {/* Use g-3 for consistent guttering */}
          <div className="col-sm-6 col-md-3">
            {/* Adjust column sizes for better spacing */}
              <UserDashboardCard2
                icon={<i className="bi bi-play-circle-fill fs-2 text-success"></i>}
                text="Start a Transaction"
                link="initiate-escrow"
              />
          </div>
          <div className="col-sm-6 col-md-3">
          <UserDashboardCard2
              icon={<i className="bi bi-hourglass-split fs-2 text-warning"></i>}
              text="Ongoing Transaction"
              link="transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history"
            />
          </div>
          <div className="col-sm-6 col-md-3">
          <UserDashboardCard2
              icon={<i className="bi bi-check-circle-fill fs-2 text-primary"></i>}
              text="Closed Transaction"
              link="transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
            />
          </div>
          <div className="col-sm-6 col-md-3">
          <UserDashboardCard2
            icon={<i className="bi bi-exclamation-triangle-fill fs-2 text-danger"></i>}
            text="Initiate Disputes"
            link="initiate-dispute"
          />
          </div>
        </div>
      </section>
      {/* --- Section 2: Recent Activity (Disputes & Transactions) --- */}
      <section className="recent-activity mb-5">
        <div className="row g-4">
          {" "}
          {/* Use g-4 for slightly more spacing between these main content blocks */}
          <div className="col-lg-4 col-12">
            {/* Adjust column sizes to give RecentDispute more space */}
            <h3 className="sub-section-title mb-3 fs-4">Recent Disputes</h3>
            <RecentDispute />
          </div>
          <div className="col-lg-8 col-12">
            {" "}
            {/* Give more space to the transaction table */}
            <h3 className="sub-section-title mb-3 fs-4">Transaction History</h3>
            <UserdashboardTransaction />
          </div>
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




























// import React from "react";
// // import { MiniProfileCard } from "../../../components/CardComponents/UsersCards";
// import {
//   UserDashboardCard2,
//   OpenConflitCard,
// } from "../../../components/CardComponents/UsersCards";
// import {
//   InitiateTransactionIcon,
//   SettledTransactionIcon,
//   CustomerCareIcon,
//   InitiateDisputeIcon,
// } from "../../../components/IconComponent/UserdashboardIcons";
// import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
// import { RecentNotification } from "../../../components/NotificationComponent/NotificationComponents";
// import { UserdashboardTransaction } from "../../../components/TableComponents/TransactionHistory";
// import { RecentDispute } from "../../../components/CardComponents/TransactionDetails";

// const UserDashboardPage = () => {
//   return (
//     <div className="contestPage">
//       <div className="row">
//         <div className="col-lg-3"></div>
//         <div className="col-lg-9 col-sm-12">
//           <UserDashboardNavbar />
//           <div className="mt-5">
//             <UserDashboard />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const UserDashboard = () => {
//   return (
//     <div className="row">
//       <div className="col-lg-12 col-sm-12">
//         <div className="row mb-3">
//           <div className="col-sm-12 mb-4 mb-md-2 col-lg-3 mt-4 mt-lg-0">
//             <UserDashboardCard2
//               icon={<InitiateTransactionIcon />}
//               text={`Initiate Transaction`}
//               link={"initiate-escrow"}
//             />
//           </div>
//           <div className="col-sm-12 mb-4 mb-md-2 col-lg-3">
//             <UserDashboardCard2
//               text={`Transactions in Progress`}
//               icon={<CustomerCareIcon />}
//               link={
//                 "transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history"
//               }
//             />
//           </div>
//           <div className="col-sm-12 mb-4 mb-md-2 col-lg-3">
//             <UserDashboardCard2
//               text={`Settled Transactions`}
//               icon={<SettledTransactionIcon />}
//               link={
//                 "transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
//               }
//             />
//           </div>

//           <div className="col-sm-12 mb-3 mb-md-2 col-lg-3">
//             <UserDashboardCard2
//               text={`Initiate Disputes`}
//               icon={<InitiateDisputeIcon />}
//               link={"initiate-dispute"}
//             />
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-lg-12 col-sm-12">
//             <div className="row">
//               <div className="col-lg-4 col-sm-12">
//                 <RecentDispute />
//               </div>

//               <div className="col-lg-8 col-sm-12 mt-3">
//                 <UserdashboardTransaction />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-5 mb-5">
//         <RecentNotification />
//       </div>
//     </div>
//   );
// };

// export default UserDashboardPage;
