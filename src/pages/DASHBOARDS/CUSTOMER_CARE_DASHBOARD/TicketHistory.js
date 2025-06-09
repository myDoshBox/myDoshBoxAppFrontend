import { TicketHistoryTable } from "../../../components/TableComponents/AdminTicketHistory";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";

const TicketHistoryPage = () => {
  return (
    <div className="contestPage">
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>

        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5 center-card">
            <TicketHistoryTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketHistoryPage;
