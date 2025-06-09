import { memo } from "react";
import {
  FinancialReport,
  ComplaintType,
  Target,
  UserInflow,
  Issues,
  LineSparkline,
} from "../../../components/CardComponents/Analytics";
import {
  AnalyticsCard,
  MiniUsersCard,
} from "../../../components/CardComponents/UsersCards";
// import { FinancialReport } from "../components/Charts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CompletedTransactionIcon,
  TotalUsersIcon,
  OpenTicketsIcon,
  ClosedTicketsIcon,
} from "../../../components/IconComponent/AdminDashboardIcons";
import { UsersIcon } from "../../../components/IconComponent/SideNavIcons";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { MiniTicketsHistory } from "../../../components/TableComponents/TicketTable";
import { AdminRecentTransactionsCard } from "../../../components/TableComponents/TransactionTable";
import { TopCustomers } from "../CUSTOMER_CARE_DASHBOARD/UsersPage";

const AdminDashboard = memo(() => {
  return (
    <div className="row">
      <div className="col-lg-3 col-sm-12 px-0"></div>

      <div className="col-lg-9 col-sm-12">
        <div className="mt-3 pe-lg-5">
          <UserDashboardNavbar />
        </div>
        <div className="mx-auto w-100 px-3 pe-lg-5 ps-lg-0 mt-5">
          <div className="row gx-lg-3 justify-content-between align-items-stretch mt-5 ps-sm-2">
            <AnalyticsCard
              value="1000"
              text="New Users"
              BigIcon={<TotalUsersIcon />}
              SmallIcon={<ArrowUpIcon />}
              change="15% More"
              ResponsiveWidth={`col-md-4`}
            />
            <AnalyticsCard
              value="300"
              text="Completed Transactions"
              BigIcon={<CompletedTransactionIcon />}
              SmallIcon={<ArrowUpIcon />}
              change="5% More"
              ResponsiveWidth={`col-md-4`}
            />
            <AnalyticsCard
              text="Total Profits"
              value="500,000"
              BigIcon={<LineSparkline />}
              SmallIcon={<ArrowDownIcon />}
              change="5% Less"
              ResponsiveWidth={`col-md-4`}
            />
          </div>
          <div className="row gx-lg-3 justify-content-between align-items-stretch mt-5 ps-sm-2">
            <FinancialReport style={`col-md-6`} />
            <MiniUsersCard style={`col-md-6`} />
          </div>
          <div className="row gx-md-3 justify-content-between align-items-stretch mt-5 ps-sm-2">
            <AnalyticsCard
              value="100"
              text="Open Conflicts"
              BigIcon={<OpenTicketsIcon />}
              ResponsiveWidth={`col-md-6`}
            />
            <AnalyticsCard
              value="350"
              text="Closed Conflicts"
              BigIcon={<ClosedTicketsIcon />}
              ResponsiveWidth={`col-md-6`}
            />
          </div>
          <div className="row gx-lg-3 justify-content-between align-items-stretch mt-5 ps-sm-2">
            <MiniTicketsHistory style={`col-md-6`} />
            <AdminRecentTransactionsCard style={`col-md-6`} />
          </div>
          <TopCustomers />
        </div>
      </div>
    </div>
  );
});

export default AdminDashboard;
