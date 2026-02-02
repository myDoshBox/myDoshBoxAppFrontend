import React from "react";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { RecentDisputeTable, DISPUTE_FILTERS } from "./ProductsDisputeHistory";

function CancelledDisputesHistory() {
  return (
    <div
      className="container-fluid px-0"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />
          <div className="px-3 px-lg-4 py-2">
            <RecentDisputeTable
              customFilter={DISPUTE_FILTERS.CANCELLED}
              showHeaderActions={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelledDisputesHistory;
