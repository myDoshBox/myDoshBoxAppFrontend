// the text and design(design|text) used for this component includes:
// completed|Completed, canceled|Canceled, refunded|Refunded, dispute|In Dispute, pending-confirmation|Pending Confirmation, awaiting|Awaiting Delivery, pending-payment|Pending Payment, resolved|Resolved, unresolved|Unresolved
import TransactionData from "../../data/dummyData/transactionData.json";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { searchFilter } from "../utils/searchFilter";
import { useState } from "react";
import { useMemo } from "react";




export const Notifications = ({ text, styles }) => {
  return (
    <div
      className={`text-center d-flex justify-content-center align-items-center rounded-pill ${styles}`}
    >
      {text}
    </div>
  );
};

export const Styling = ({ text, styles }) => {
  return (
    <div
      className={`text-center d-flex justify-content-center align-items-center ${styles}`}
    >
      {text}
    </div>
  );
};

export const RecentNotification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const keysToSearch = [
    "goal_type",
    "subject",
    "target_achievement",
    "date",
    "status",
  ];

  const filteredData = useMemo(() => {
    return searchFilter(TransactionData.recent_notification, searchQuery, keysToSearch);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="border-0 shadow p-3 bg-white rounded" style={{ width: "100%" }}>
        <div className="row align-items-center mb-3">
          {/* Left Title */}
          <div className="col-12 col-md-4 mb-2 mb-md-0">
            <h5 className="mb-0">Recent Notification</h5>
          </div>

          {/* Right Controls */}
          <div className="col-12 col-md-8 ">
            <div className="d-flex flex-column flex-sm-row justify-content-md-end align-items-sm-center gap-2">
               <div className="d-flex">
               <Form.Control
                type="text"
                placeholder="Search..."
                className="form-control-sm"
                style={{ maxWidth: "180px"}}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />

              <Form.Select
                className="form-select-sm"
                style={{maxWidth: "180px"}}
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>Show 10</option>
                <option value={25}>Show 25</option>
                <option value={35}>Show 35</option>
              </Form.Select>

              </div>
              <Link to="./notification">
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
        </div>

      <div className="table-responsive">
        <table className="table table-hover table-striped text-center align-middle">
        <thead className="table-light text-center">
          <tr>
            <th>Goal Type</th>
            <th className="d-none d-md-table-cell">Subject</th>
            <th className="d-none d-lg-table-cell">Target Achievement</th>
            <th>Date</th>
            <th>Status</th>
            <th className="text-center">Action</th>
          </tr>
      </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <UserDashboardNotification key={item.id} {...item} />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
        <small className="text-muted ms-2">
          Showing {paginatedData.length} of {filteredData.length} results
        </small>

        <div className="pagination justify-content-end me-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "success" : "outline-success "}
              size="sm"
              className="mx-1"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserDashboardNotification = (props) => {
  const {
    goalType,
    subject,
    targetAchievement,
    date,
    status_style,
    status,
    action,
  } = props;

  return (
    <tr className="text-center border-bottom">
      <td className="p-md-3 text-small">{goalType}</td>

      {/* Hide subject on small screens */}
      <td className="p-md-3 d-none d-md-table-cell text-small">{subject}</td>

      {/* Hide achievement on small + medium */}
      <td className="p-md-3 d-none d-lg-table-cell text-small">
        {targetAchievement}
      </td>

      <td className="p-md-3 text-small">{date}</td>

      <td className="p-md-3 text-small">
        <Styling text={status} styles={status_style} />
      </td>

      {/* Action column should always show */}
      <td className="py-md-3 text-center">
        <div className="d-grid">
            <Button
            variant="outline-success"
            size="sm"
            className="rounded-1  py-1 text-nowrap"
          >
            {action}
          </Button>
        </div>
    </td>

    </tr>
  );
};


// the code below shows how to use the component above
// <Notifications
// 	text="Pending Confirmation"
// 	styles="pending-confirmation"
// />;
