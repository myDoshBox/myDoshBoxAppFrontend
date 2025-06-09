import React from "react";
// import { ViewMoreButton } from "../components/ButtonsComponent/NavigationAndViewButtons";
import TransactionHistory from "../../components/TableComponents/TransactionHistory";
import transactionData from "../../data/dummyData/transactionData.json";
import { DashboardConflictCards } from "../../components/CardComponents/TransactionDetails";
import { UserDashboardNavbar } from "../../components/NavbarComponents/TopNavbars";
import { Link } from "react-router-dom";
import { ConflitCard } from "../../components/CardComponents/UsersCards";
import { RecentDispute } from "../../components/CardComponents/TransactionDetails";
import { UserdashboardTransaction } from "../../components/TableComponents/TransactionHistory";
import {
  TaskBoard,
  TaskCard,
} from "../../components/CardComponents/UsersCards";

const NeutralDashboard = () => {
  return (
    <div className="row" style={{ backgroundColor: "#F9F9FB" }}>
      <div className="col-lg-3 col-sm-12 px-0"></div>

      <div className="col-lg-9 col-sm-12">
        <div className="mt-3 pe-lg-5">
          <UserDashboardNavbar />
        </div>
        <div>
          <div className="mt-5">
            <ConflitCard />
          </div>

          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="row">
                <div className="col-lg-4 col-sm-12 mt-5">
                  <RecentDispute />
                </div>

                <div className="col-lg-8 col-sm-12 mt-5">
                  <UserdashboardTransaction />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <TaskBoard BoardName={"Recent Conflict Table"} itemsShown={6} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeutralDashboard;
