import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal, Accordion, Badge } from "react-bootstrap";
import { useCancelTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useBuyerConfirmsProductMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useFetchAllTransactionsQuery } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useFetchDisputeDetailsQuery } from "../../../redux/slices/disputeSlices/disputeAPISlice";
import { useSellerConfirmsTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useInitiatePaymentMutation } from "../../../redux/slices/paymentSlices/paymentAPISlice";
import { useSelector } from "react-redux";
import { searchFilter } from "../../../components/utils/searchFilter";

// Import the table component and filter
import { RecentTransactionTable } from "./UserTransactionHistory";
import { TRANSACTION_FILTERS } from "./TransactionFilter";

const TransactionInProgressHistory = () => {
  return (
    <div
      className="container-fluid px-0"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />
          <div className="px-3 px-lg-4 py-2">
            {/* Use the table component with IN_PROGRESS filter */}
            <RecentTransactionTable
              customFilter={TRANSACTION_FILTERS.IN_PROGRESS}
              showHeaderActions={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInProgressHistory;
