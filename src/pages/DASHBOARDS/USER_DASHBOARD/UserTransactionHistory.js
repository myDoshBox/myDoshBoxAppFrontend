import { useRef, useEffect, useState } from "react";
import { Notifications } from "../../../components/NotificationComponent/NotificationComponents";
import TransactionData from "../../../data/dummyData/transactionData.json";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link } from "react-router-dom";
import { NewTransaction } from "../../../components/ButtonsComponent/NavigationAndViewButtons";
import { Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import buyerImage from "../../../images/transact_person.png";

const UserTransactionHistory = () => {
  return (
    <div className="contestPage" style={{ "background-color": "#F9F9FB" }}>
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>

        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5 center-card">
            <RecentTransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecentTransactionTable = () => {
  const dropdownBtnValues = [
    { label: "All Data", value_1: "Last 7 days", value_2: "Over $1000" },
    { label: "2021", value_1: "2022", value_2: "2023" },
  ];

const itemsPerPage = 10;

const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);

const handlePageChange = (page) => {
  if (page > 0 && page <= totalPages) {
    setCurrentPage(page);
  }
};

const getSlicedData = () => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return TransactionData.user_recent_transaction.slice(startIndex, endIndex);
};


  return (
    <div className="bg-white rounded-1 p-3" style={{ width: "100%" }}>
      <div>
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h3 className="fs-6 m-0 mb-3 mb-md-0" style={{}}>
            All Transactions
          </h3>
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
            <Link to={"../initiate-escrow"} className="text-decoration-none">
              <Button
                className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block"
                style={{
                  backgroundColor: "#006747EB",
                }}
              >
                Create Transaction
              </Button>
            </Link>
          </div>
        </div>

        <table className="table fs-sm">
          <thead>
            <tr className="lightTextColor">
              <th className="px-0 d-none d-md-table-cell">Item</th>
              <th className="text-center d-none d-md-table-cell">
                Purchase From
              </th>
              <th className="text-center d-none d-md-table-cell">
                Purchase Date
              </th>
              <div className="d-flex justify-content-between align-items-center border-md-bottom">
                <th className="text-center d-none d-md-table-cell">
                  Purchase By
                </th>
                <th className="text-center d-none d-md-table-cell">Amount</th>
              </div>
              <th className="text-center d-none d-md-table-cell">Slip</th>
              <th className="text-center d-none d-md-table-cell">Status</th>
              <th className="text-center d-none d-md-table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Use the getSlicedData function to map over only the data for the current page */}
            {getSlicedData().map((history) => {
              return (
                <RecentTransactionTableData {...history} key={history.id} />
              );
            })}
          </tbody>
        </table>
        <PaginationBar
          data={TransactionData.user_recent_transaction}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
        />
      </div>
    </div>
  );
};

export const RecentTransactionTableData = (props) => {
  const {
    item,
    purchase_from,
    purchase_date,
    purchase_by,
    amount,
    status,
    status_color,
    status_message,
  } = props;

  let maxWidth = window.innerWidth;

  if (maxWidth < 250) {
    maxWidth = "5rem";
  } else if (maxWidth < 330) {
    maxWidth = "9rem";
  } else if (maxWidth < 450) {
    maxWidth = "12rem";
  } 

  const style = {
    maxWidth,
  };

  return (
    <>
      <tr className="border-bottom">
        <td className="border-0 border-md-bottom d-none d-md-table-cell py-md-3 px-0">
          {item}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          {purchase_from}
        </td>
        <td className="py-md-3 text-center lightTextColor">{purchase_date}</td>
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <td className="py-md-1 text-center d-md-flex align-items-center fw-medium fw-md-normal lightTextColor-md">
              <img
                src={buyerImage}
                alt={purchase_by}
                className="pe-2 d-none d-md-block"
              />
              {purchase_by}
            </td>
            <td className="py-md-1 text-center lightTextColor">₦{amount}</td>
          </div>
          <td
            className="d-md-none py-md-3 text-center lightTextColor text-truncate"
            style={style}
          >
            {status_message}
          </td>
        </div>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          <Button
            className="border-0 rounded-1 btn all-btn text-white fs-sm"
            style={{
              backgroundColor: "#006747EB",
            }}
          >
            Generate Slip
          </Button>
        </td>
        <td
          className="py-md-3 text-center"
          style={{ color: `${status_color}` }}
        >
          {window.innerWidth < 768 ? (
            <span style={{ color: `${status_color}` }}>●</span>
          ) : (
            `${status}`
          )}
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          <Button variant="outline-primary" className="rounded-1 fs-sm">
            View More
          </Button>
        </td>
      </tr>
    </>
  );
};
export default UserTransactionHistory;
