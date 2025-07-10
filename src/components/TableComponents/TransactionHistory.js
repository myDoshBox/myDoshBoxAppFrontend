import React from "react";
import {
  Notifications,
  Styling,
} from "../NotificationComponent/NotificationComponents";
import { ViewBtn } from "../ButtonsComponent/NavigationAndViewButtons";
import TransactionData from "../../data/dummyData/transactionData.json";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { searchFilter } from "../../components/utils/searchFilter"; // make sure this utility
import { useEffect } from "react";




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
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const keysToSearch = ["name", "email", "paid_date", "paid_amount", "status"];

  const filteredData = useMemo(() => {
    return searchFilter(TransactionData.recent_transaction, searchQuery, keysToSearch);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset page on search or rowsPerPage change
  }, [searchQuery, rowsPerPage]);

  return (
    <div className="card border-0 shadow-sm rounded-3">
      <div className="card-body">
        {/* Header and Controls */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-3">
          <h6 className="">Transactions</h6>

          <div className="d-flex justify-content-end flex-column flex-sm-row align-items-sm-center gap-2 w-100 w-md-auto">
            <div className="d-flex g-4">
            <Form.Control
              type="text"
              placeholder="Search..."
              className="form-control-sm"
              style={{ maxWidth: "180px" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Form.Select
              className="form-select-sm"
              style={{ maxWidth: "120px" }}
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value={10}>Show 10</option>
              <option value={25}>Show 25</option>
              <option value={35}>Show 35</option>
            </Form.Select>

              </div>
            {/* View All Button */}
       
            <Link to="./transaction-history">
                            {/* <Button
                              className="btn btn-sm text-white float-end "
                              style={{ backgroundColor: "#006747EB" }}
                            >
                              View All
                            </Button> */}
                          {/* Large button only on small screens (xs) */}
                              <Button
                            className="btn btn-primary w-100 py-2 fs-6 d-block d-sm-none"
                            style={{ backgroundColor: "#006747EB" }}
                              >
                                View All
                              </Button>
            
                              {/* Normal-size button for sm and up */}
                              <Button
                                className="btn btn-sm btn-primary text-white d-none d-sm-inline-block"
                                style={{ backgroundColor: "#006747EB" }}
                          >
                                View All
                              </Button>
            
                          </Link>
        
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover text-center align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th className="d-none d-lg-table-cell">Email</th>
                <th>Paid Date</th>
                <th>Paid Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((trans) => (
                  <MiniTransaction key={trans.id} {...trans} />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-muted py-3">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <small className="text-muted ms-1">
            Showing {paginatedData.length} of {filteredData.length} results
          </small>

          <div className="pagination justify-content-end mt-2 mt-md-0 me-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "success" : "outline-secondary"}
                size="sm"
                className="mx-1"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};  

// export const UserdashboardTransaction = () => {
//   const dropdownBtnValues = [
//     { label: "All Data", value_1: "Last 7 days", value_2: "Over $1000" },
//     { label: "2022", value_1: "Newest", value_2: "Oldest" },
//   ];

//   return (
//     <div className="card border-0 shadow" style={{ width: "100%" }}>
//       <div className="card-body">
//         <div className="d-flex justify-content-between">
//           <div className="">
//             <h6 className="text-nowrap mt-2 ms-3">Recent Transaction</h6>
//           </div>
//           <div className="d-flex">
//             {dropdownBtnValues.map((item) => {
//               return (
//                 <Dropdown>
//                   <Dropdown.Toggle
//                     id="dropdown-basic"
//                     className="border-1 border-gray my-1 rounded-1 btn bg-transparent text-black border-black me-3 fs-sm"
//                     style={{
//                       outline: "none",
//                       borderColor: "#E7E7E7",
//                     }}
//                   >
//                     {item.label}
//                   </Dropdown.Toggle>

//                   <Dropdown.Menu style={{ minWidth: "inherit" }}>
//                     <div key={item.label}>
//                       <Dropdown.Item className="fs-sm">
//                         {item.value_1}
//                       </Dropdown.Item>
//                       <Dropdown.Item className="fs-sm">
//                         {item.value_2}
//                       </Dropdown.Item>
//                     </div>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               );
//             })}
//           </div>
//         </div>
//         <table className="table transaction-table">
//           <thead className="text-center">
//             <tr>
//               <th>Name</th>
//               <th className="d-none d-lg-table-cell">Email</th>
//               <th>Paid Date</th>
//               <th>Paid Amount</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {TransactionData.recent_transaction.map((trans) => {
//               return <MiniTransaction {...trans} key={trans.id} />;
//             })}
//           </tbody>
//         </table>
//         <Link
//           to={"./"}
//           className="d-flex justify-content-end text-decoration-none"
//         >
//           <Button
//             className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block me-5"
//             style={{
//               backgroundColor: "#006747EB",
//             }}
//           >
//             View All
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

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
