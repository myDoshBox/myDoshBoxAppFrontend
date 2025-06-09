import {
  SmallAdminRecentTransactions,
  CustomerCareTickets,
} from "../../../components/TableComponents/AdminTicketHistory";
import {
  OpenTicketsIcon,
  ClosedTicketsIcon,
} from "../../../components/IconComponent/AdminDashboardIcons";
import {
  MiniUsersCard,
  AnalyticsCard,
} from "../../../components/CardComponents/UsersCards";
import { TopCustomers } from "./UsersPage";
// import { AdminRecentTransactionsCard } from "../../../components/NotificationComponent/TableComponents/TransactionTable";

import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";

const CustomerCareDashboardPage = () => {
  return (
    <div className="contestPage">
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>

        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5 center-card">
            <CustomerCareDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerCareDashboard = () => {
  return (
    <>
      <div>
        <CustomerCareTickets />
        <div className="row align-items-stretch">
          <div className="col-lg-4 col-sm-12 mt-0 mt-lg-0 h-100">
            <SmallAdminRecentTransactions />
          </div>
          <div className="col-lg-5 col-sm-12 mt-5 mt-lg-0 h-100">
            <MiniUsersCard />
          </div>
          <div className="col-lg-3 col-sm-12 h-100">
            <AnalyticsCard
              value="100"
              text="Open Conflicts"
              BigIcon={<OpenTicketsIcon />}
              //   ResponsiveWidth={`col-md-6`}
            />
            <AnalyticsCard
              value="350"
              text="Closed Conflicts"
              BigIcon={<ClosedTicketsIcon />}
              ResponsiveWidth={`mt-3`}
            />
          </div>
        </div>
        <TopCustomers />
      </div>
    </>
  );
};

export default CustomerCareDashboardPage;
