import React from "react";
import {
  Notifications,
  Styling,
} from "../NotificationComponent/NotificationComponents";
import { ViewBtn } from "../ButtonsComponent/NavigationAndViewButtons";
import TransactionData from "../../data/dummyData/transactionData.json";
import { Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const TransactionHistory = (props) => {
  const { trans_id, buyer_name, seller_name, products, date, status } = props;
  return (
    <>
      <tr>
        <td className="d-none d-md-table-cell text-small">{trans_id}</td>
        <td className="d-none d-sm-table-cell text-small">{buyer_name}</td>
        <td className="d-none d-lg-table-cell text-small">{seller_name}</td>
        <td className="text-small">{products}</td>
        <td className="text-small">{date}</td>
        <td className="text-small">
          <Notifications
            text={status}
            styles={`text-center  rounded-pill ${status}`}
          />
        </td>
        <td className="d-none d-sm-table-cell">
          <ViewBtn />
        </td>
      </tr>
    </>
  );
};

export const UserdashboardTransaction = () => {
  const dropdownBtnValues = [
    { label: "All Data", value_1: "Last 7 days", value_2: "Over $1000" },
    { label: "2022", value_1: "Newest", value_2: "Oldest" },
  ];

  return (
    <div className="card border-0 shadow" style={{ width: "100%" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div className="">
            <h6 className="text-nowrap mt-2 ms-3">Recent Transaction</h6>
          </div>
          <div className="d-flex">
            {dropdownBtnValues.map((item) => {
              return (
                <Dropdown>
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    className="border-1 border-gray my-1 rounded-1 btn bg-transparent text-black border-black me-3 fs-sm"
                    style={{
                      outline: "none",
                      borderColor: "#E7E7E7",
                    }}
                  >
                    {item.label}
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ minWidth: "inherit" }}>
                    <div key={item.label}>
                      <Dropdown.Item className="fs-sm">
                        {item.value_1}
                      </Dropdown.Item>
                      <Dropdown.Item className="fs-sm">
                        {item.value_2}
                      </Dropdown.Item>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              );
            })}
          </div>
        </div>
        <table className="table transaction-table">
          <thead className="text-center">
            <tr>
              <th>Name</th>
              <th className="d-none d-lg-table-cell">Email</th>
              <th>Paid Date</th>
              <th>Paid Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TransactionData.recent_transaction.map((trans) => {
              return <MiniTransaction {...trans} key={trans.id} />;
            })}
          </tbody>
        </table>
        <Link
          to={"./"}
          className="d-flex justify-content-end text-decoration-none"
        >
          <Button
            className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block me-5"
            style={{
              backgroundColor: "#006747EB",
            }}
          >
            View All
          </Button>
        </Link>
      </div>
    </div>
  );
};

const MiniTransaction = (props) => {
  const { name, email, paidDate, paidAmount, status, status_style } = props;
  return (
    <>
      <tr className="text-center border-bottom">
        <td className="p-md-3 text-small text-nowrap">{name}</td>
        <td className="p-md-3 d-none d-lg-table-cell text-small">{email}</td>
        <td className="p-md-3 text-small">{paidDate}</td>
        <td className="p-md-3 text-small">${paidAmount}</td>
        <td className="p-md-3 d-flex justify-content-center align-items-center text-small">
          <Styling text={status} styles={status_style} />
        </td>
        {/* <td className="p-md-3">{status}</td> */}
      </tr>
    </>
  );
};

export default TransactionHistory;
