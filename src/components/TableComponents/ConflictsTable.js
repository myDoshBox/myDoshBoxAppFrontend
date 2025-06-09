import { Dropdown, Button } from "react-bootstrap";

// AllConflictsCard
import conflictsData from "../../data/dummyData/conflictsData.json";
import { PaginationBar } from "../PaginationComponent";
import complainantImg from "../../images/transact_person.png";
import { useState } from "react";

export const AllConflictsTable = ({ conflictType }) => {
  const dropdownBtnValues = [
    { label: "Filter", value_1: "Last 7 days", value_2: "Over $1000" },
    { label: "Sort", value_1: "Newest", value_2: "Oldest" },
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

    return conflictsData.conflicts.slice(startIndex, endIndex);
  };

  return (
    <div className="bg-white rounded-1 p-3" style={{ width: "100%" }}>
      {/* <div className="col-lg-9 border shadow" style={{ width: "100%" }}> */}
      <div>
        <div className="d-md-flex justify-content-between align-items-center mb-3">
          <h3 className="fs-6 m-0 mb-3 mb-md-0" style={{}}>
            {conflictType} Conflicts
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
          </div>
        </div>
        <table className="table fs-sm">
          <thead>
            <tr className="lightTextColor">
              <th className="d-none d-md-table-cell">Complainant</th>
              <th className="text-center d-none d-md-table-cell">Email</th>
              <th className="text-center d-none d-md-table-cell">Date</th>
              <th className="text-center d-none d-md-table-cell">
                Complaint Type
              </th>
              {/* </div> */}
              <th className="text-center d-none d-md-table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Use the getSlicedData function to map over only the data for the current page */}
            {getSlicedData().map((conflict) => {
              return (
                <ConflictsTableData {...conflict} key={conflict.ticket_id} />
              );
            })}
          </tbody>
        </table>
        <PaginationBar
          data={conflictsData.conflicts}
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

export const ConflictsTableData = (props) => {
  const { date_issued, email, name, complaint_type, ticket_id } = props;

  return (
    <>
      <tr className="border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <td className="py-md-1 text-start d-md-flex align-items-center fw-medium fw-md-normal lightTextColor-md">
            <img
              src={complainantImg}
              alt={name}
              className="pe-2 d-none d-md-block"
            />
            <div className="col">
              <div className="fw-medium blueTextColor">{name}</div>
              <div>#{ticket_id}</div>
            </div>
          </td>
        </div>
        {/* </div> */}
        <td className="py-md-3 text-center lightTextColor">{email}</td>
        <td className="py-md-3 text-center lightTextColor">{date_issued}</td>
        <td className="py-md-3 text-center lightTextColor">{complaint_type}</td>

        <td className="d-none d-md-table-cell py-md-3 text-center">
          <Button variant="outline-primary" className="rounded-1 fs-sm">
            View More
          </Button>
        </td>
      </tr>
    </>
  );
};
