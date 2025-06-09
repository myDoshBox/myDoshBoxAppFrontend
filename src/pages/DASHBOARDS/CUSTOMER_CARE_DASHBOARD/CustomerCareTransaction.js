import { Notifications } from "../../../components/NotificationComponent/NotificationComponents";
import customercare_transaction from "../../../data/dummyData/transactionData.json";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { FilterButton } from "../../../components/ButtonsComponent/OtherButtons";
import { useState } from "react";

const CustomerCareTransaction = () => {
  return (
    <div className="contestPage">
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>

        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5 center-card">
            <CustomerCareTransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomerCareTransactionTable = () => {
  return (
    <div className="shadow p-3 rounded-3 p-4" style={{ width: "100%" }}>
      {/* <div className="col-lg-9 border shadow" style={{ width: "100%" }}> */}
      <div>
        <div className="d-flex justify-content-end pb-3">
          {/* <CustomButton
            value="Sort by: Recent"
            className="btn border text-success text-small viewBtn"
            lefticon={<SortIcon />}
            righticon={<ArrowDownIcon />}
          /> */}
        </div>

        <table className="table transaction-table">
          <thead className="text-center">
            <tr>
              <th>Transaction ID</th>
              <th>Buyer Name</th>
              <th>Seller Name</th>
              <th className="small-hide">Products</th>
              <th className="small-hide">Date</th>
              <th>Status</th>
              <th className="small-hide">...</th>
            </tr>
          </thead>
          <tbody>
            {customercare_transaction.customercare_transaction.map(
              (customercare) => {
                return (
                  <CustomerCareTransactionTableData
                    {...customercare}
                    key={customercare.id}
                  />
                );
              }
            )}
          </tbody>
        </table>
        <div className="p-4">
          <PaginationBar />
        </div>
      </div>
    </div>
  );
};

export const CustomerCareTransactionTableData = (props) => {
  const {
    transaction_id,
    buyer_name,
    seller_name,
    products,
    date,
    status_name,
    status_style,
    view,
  } = props;
  return (
    <>
      <tr className="text-center border-bottom">
        <td className="p-md-3">{transaction_id}</td>
        <td className="p-md-3">{buyer_name}</td>
        <td className="p-md-3">{seller_name}</td>
        <td className="p-md-3 small-hide">{products}</td>
        <td className="p-md-3 small-hide">{date}</td>
        <td className="p-md-3 d-flex justify-content-center align-items-center">
          <Notifications text={status_name} styles={status_style} />
        </td>
        <td className="p-md-3 small-hide">
          {/* <CustomBtn
            value={view}
            className="btn border text-success text-small viewBtn"
            style={{ whiteSpace: "nowrap" }}
          /> */}
        </td>
      </tr>
    </>
  );
};

export default CustomerCareTransaction;
