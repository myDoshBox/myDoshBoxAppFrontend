import React from "react";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { RecentDisputeTable } from "./ProductsDisputeHistory";

function DisputesInProgressHistory() {
  // Filter configuration for in-progress disputes
  const disputeFilter = {
    status: "inProgress", // Identifier for this filter
    title: "Disputes In Progress",
    filterFunction: (disputes) => {
      return disputes.filter(
        (dispute) =>
          dispute.dispute_status === "processing" ||
          dispute.dispute_status === "resolving" ||
          dispute.dispute_status === "In_Dispute" ||
          dispute.dispute_status === "escalated_to_mediator"
      );
    },
    emptyMessage: "You don't have any disputes in progress",
    emptyDescription: "All your disputes are either resolved or cancelled",
  };

  return (
    <div
      className="container-fluid px-0"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />
          <div className="px-3 px-lg-4 py-2">
            <RecentDisputeTable
              customFilter={disputeFilter}
              showHeaderActions={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisputesInProgressHistory;
