import { memo, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";

// AllConflictsCard
import conflictsData from "../../data/dummyData/conflictsData.json";
import { PaginationBar } from "../PaginationComponent";
import { Styling } from "../NotificationComponent/NotificationComponents";
//All Buttons/Icon Import Starts
// import {
//   TotalUsersIcon,
//   ArrowDownIcon,
//   ArrowUpIcon,
//   CompletedTransactionIcon,
// } from "../IconComponent/AdminDashboardIcons";
import { RatingIcon } from "../IconComponent/UserdashboardIcons";
// import { FilterButton } from "../ButtonsComponent/GenandAuthBtn";
// import { GeneralBtn } from "../ButtonsComponent/GenandAuthBtn";
//All Buttons/icon Import Ends

//All Image Import Starts
import Avatar from "../../images/Avatar.jpg";
//All Image Import Ends

import { Link, useNavigate } from "react-router-dom";
import TransactionData from "../../data/dummyData/transactionData.json";
import disputeshistorydata from "../../data/dummyData/disputeshistorydata.json";
import { EditProfileButton } from "../ButtonsComponent/EditButtons";
import { ViewMoreDisputeBtn } from "../ButtonsComponent/NavigationAndViewButtons";

// UserTransactionsCard, TotalUsersCard, AnalyticsNewUsersCard
export const AnalyticsCard = memo(
  ({ ResponsiveWidth, BigIcon, SmallIcon, text, value, link, change }) => {
    return (
      <div className={`${ResponsiveWidth} mb-4 mb-lg-0`}>
        <div className="px-3 shadow border-0 rounded-2 DashboardCard h-100">
          <Link to={link} className="text-decoration-none ">
            <div className="d-flex align-items-center py-3">
              {BigIcon}
              <div>
                <p className="m-0 ms-2 opacity-50">{value}</p>
                <p className="m-0 ms-2">{text}</p>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              {SmallIcon}
              <p className="text-small m-0">
                {change ? change + "than last week" : null}
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }
);

//LogoutCard /ContactCustomerCareCard /IntiateDisputeCard /ClosedConflictsCard /OngoingConflictCard,   OpenConflictsCard /Logout /Contact Us /Report App Defect /Change Bank Details /Update Profile /FAQs
export const UserDashboardCard = (props) => {
  const { text, icon, link, relative } = props;
  return (
    <Link
      to={link}
      relative={relative}
      className="text-decoration-none text-dark"
    >
      <div
        className="card shadow mx-auto border-0 rounded-2 p-3 p-lg-none row justify-content-center"
        style={{ width: "100%", height: "80%" }}
      >
        <div className="row justify-content-center align-items-center mx-auto">
          <div className="col-2">{icon}</div>
          <div className="col-10" style={{ transform: "translateX(10px)" }}>
            {text}
          </div>
        </div>
      </div>
    </Link>
  );
};

export const UserDashboardCard2 = (props) => {
  const { text, icon, link } = props;
  return (
    <Link to={link} className="text-decoration-none text-dark">
      <div
        className="card shadow mx-auto border-0 rounded-2  px-2 row justify-content-center"
        style={{ width: "100%", height: "5.7rem" }}
      >
        <div className="row justify-content-center align-items-center mx-auto">
          <div className="col-4">{icon}</div>
          <div className="col-8">{text}</div>
        </div>
      </div>
    </Link>
  );
};

export const NewConflitCard = (props) => {
  const { text, icon, link, style, styling, btnNumber, view } = props;
  return (
    <Link to={link} className="text-decoration-none text-dark">
      <div
        className="card shadow mx-auto border-0 rounded-2  px-2 row justify-content-center"
        style={{ width: "19rem", height: "9.8rem" }}
      >
        <div className="row justify-content-center align-items-center mx-auto mb-3">
          {/* <div className="col-4">{icon}</div> */}
          <img src={icon} alt="" className="w-25" />
          <div className="col-8 text-nowrap">{text}</div>
        </div>
        <div>
          <Styling styles={style} />
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <Button
              variant="outline-dark"
              className="rounded-1 fs-sm mt-3 mb-3 opacity-50"
            >
              {view}
            </Button>
          </div>
          <div>
            <Button
              className={`border-0 btn mt-3 mb-3 ${styling}`}
              style={{ width: "46px", height: "2.3rem" }}
            >
              {btnNumber}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ConflitCard = () => {
  return (
    <div className="row mx-auto px-3 pe-lg-5 ps-lg-0">
      {disputeshistorydata.new_conflictsCard.map((mini) => {
        return (
          <div className="col-lg-4 col-md-4 col-sm-12 mt-3">
            <NewConflitCard {...mini} key={mini.id} />
          </div>
        );
      })}
    </div>
  );
};

// MiniProfileCard
export const MiniProfileCard = () => {
  return (
    <>
      <div
        className="card shadow border-0 rounded-2 p-3 mx-auto"
        style={{ width: "90%" }}
      >
        <div className="d-flex flex-column ">
          <div className="d-flex justify-content-center">
            <img src={Avatar} className="img-fluid mx-auto" alt="User" />
            <span className="d-flex align-items-end">
              {/* <CameraIcon /> */}
            </span>
          </div>
          <span className="text-center">
            <h5 className="mt-2 fw-lighter">Olasunkanmi Idris</h5>
            <p>+234 801 234 5678</p>
            <p>sunkanmidris@gmail.com</p>
          </span>
        </div>
        <hr></hr>
        <div className="d-flex px-3">
          <div>{/* <CompletedDealsIcon width="30" /> */}</div>
          <p className="ms-lg-1">100 deal complete</p>
        </div>
        <div className="d-flex px-3 ">
          <span>
            <RatingIcon />
            <RatingIcon />
            <RatingIcon />
            <RatingIcon />
            <RatingIcon />
          </span>
          <p className="mx-2"> 0.0 rating </p>
        </div>
        <hr></hr>
        <div className="text-end pe-2 py-3">
          <Link to={"./updateprofile"}>
            <EditProfileButton />
          </Link>
        </div>
      </div>
    </>
  );
};
// MiniProfileCardSettind
export const MiniProfileCardSettings = () => {
  return (
    <>
      <div
        className="card shadow border-0 rounded-2 p-3 mx-auto"
        style={{ width: "90%" }}
      >
        <div className="d-flex flex-column ">
          <div className="d-flex justify-content-center">
            <img src={Avatar} className="img-fluid mx-auto" alt="User" />
            <span className="d-flex align-items-end">
              {/* <CameraIcon /> */}
            </span>
          </div>
          <span className="text-center">
            <h5 className="mt-2 fw-lighter">Olasunkanmi Idris</h5>
            <p>+234 801 234 5678</p>
            <p>sunkanmidris@gmail.com</p>
          </span>
        </div>
        <hr></hr>
        <div className="d-flex px-3">
          <div>{/* <CompletedDealsIcon width="30" /> */}</div>
          <p className="ms-lg-1">100 deals completed</p>
        </div>
        <div className="d-flex px-3 ">
          <span role="button" data-testid="rating-icons-container">
            <RatingIcon id={1} />
            <RatingIcon id={2} />
            <RatingIcon id={3} />
            <RatingIcon id={4} />
            <RatingIcon id={5} />
          </span>

          <p className="mx-2"> 0.0 rating </p>
        </div>
        <hr></hr>
        <div className="text-end pe-2 py-3">
          <Link to={"../updateprofile"}>
            {/* <GeneralBtn
              text="Edit Profile"
              styles="GeneralBtnStyle1 btn all-btn text-white"
            /> */}
          </Link>
        </div>
      </div>
    </>
  );
};

// MiniUsersCard
export const MiniUsersCard = memo(({ style }) => {
  console.count("MiniUsersCard: ");
  const [max, setMax] = useState(5);
  return (
    <div className={`${style} mb-3 mb-md-0`}>
      <div className={`card p-3 shadow rounded border-0 h-100`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="m-0">All Users</h6>
          {/* <CustomBtn
            value="View More"
            className="btn border text-success text-small viewBtn"
            to="users"
            style={{ whiteSpace: "nowrap" }}
          /> */}
        </div>
        <table className="table m-0 h-100">
          <thead>
            <tr>
              <th scope="col" className="opacity-50 text-center">
                User Id
              </th>
              <th scope="col" className="opacity-50 text-center">
                Name
              </th>
              <th scope="col" className="opacity-50 text-center">
                Completed Transactions
              </th>
            </tr>
          </thead>
          <tbody className="h-100">
            {TransactionData.mini_transaction.map((mini) => {
              return (
                <>
                  <tr key={mini.id} className="text-center border-bottom">
                    <td className="p-md-3 text-small">{mini.id}</td>
                    <td className="p-md-3 text-small">Opeyemi</td>
                    <td className="p-md-3 text-small">2000</td>
                  </tr>
                </>
              );
            })}
            <Link
              to={""}
              className="d-flex justify-content-center pt-3 text-decoration-none w-100"
              style={{ whiteSpace: "nowrap" }}
            >
              {/* <GeneralBtn
                text="View More"
                styles="GeneralBtnStyle1 btn all-btn text-white"
                link={"users"}
              /> */}
            </Link>
          </tbody>
        </table>
      </div>
    </div>
  );
});

// UserProfileCard {Done}
export const UserProfileCard = () => {
  const history = useNavigate();

  return (
    <section>
      <div className="card shadow-sm" style={{ width: "56rem" }}>
        <div className="card-body d-flex mt-4">
          <div className="d-flex align-items-center col-4">
            <img src={Avatar} className="w-75 img-fluid" alt="Avatar" />
          </div>
          <div className="">
            <h4 className="text-muted">PERSONAL INFORMATION</h4>
            {/* Personal Info Section Starts */}
            <div>
              <table className="text-muted">
                <thead>
                  <tr>
                    <th className="fw-bold" scope="col ">
                      USER ID :
                    </th>
                    <th scope="col">34522</th>
                  </tr>
                  <tr>
                    <th className="fw-bold" scope="col">
                      FULL-NAME:
                    </th>
                    <th scope="col">Christian Gabriel Ugochukwu</th>
                  </tr>
                  <tr>
                    <th className="fw-bold" scope="col">
                      PHONE NUMBER:
                    </th>
                    <th scope="col">+234 9032166043</th>
                  </tr>
                  <tr>
                    <th className="fw-bold" scope="col">
                      E-MAIL:
                    </th>
                    <th scope="col">gabrielChristian@gmail.com</th>
                  </tr>
                  <tr>
                    <th className="fw-bold" scope="col">
                      ADDRESS:
                    </th>
                    <th scope="col">Royal Palm villa Estate, Sangotedo</th>
                  </tr>
                </thead>
              </table>
            </div>
            {/* Personal Info Section Ends */}
            {/* Bank Info Section Starts*/}
            <div className="mt-5">
              <h4 className="text-muted">BANK INFORMATION</h4>
              <table className="text-muted">
                <thead className="mt-3">
                  <tr>
                    <th className="fw-bold" scope="col ">
                      ACCOUNT NUMBER:
                    </th>
                    <th scope="col">2395289752</th>
                  </tr>
                  <tr>
                    <th className="fw-bold" scope="col">
                      ACCOUNT NAME:
                    </th>
                    <th scope="col">Christian Gabriel </th>
                  </tr>
                  <tr>
                    <th className="fw-bold" scope="col">
                      BANK:
                    </th>
                    <th scope="col">Zenith Bank</th>
                  </tr>
                </thead>
              </table>
            </div>
            {/* Bank Info Section Ends */}
          </div>
          <div className="col-2 ms-lg-5">
            <button type="button" className="btn btn-success fw-bold ">
              Primary
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const TaskBoard = ({ BoardName, itemsShown }) => {
  const dropdownBtnValues = [
    { label: "Filter", value_1: "Last 7 days", value_2: "Over $1000" },
    { label: "Sort", value_1: "Newest", value_2: "Oldest" },
  ];

  const itemsPerPage = itemsShown;

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
    <div
      className="bg-white rounded-1 p-3 mb-4"
      style={{ maxWidth: "66.5rem" }}
    >
      <div className="pb-4">
        <div className="bg-white d-md-flex justify-content-between align-items-center mb-2 ms-5">
          <div className="d-flex align-items-center" aria-label="board title">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="blueTextColor me-2"
            >
              <path
                d="M13.2668 9H2.7335C1.7335 9 1.3335 9.42667 1.3335 10.4867V13.18C1.3335 14.24 1.7335 14.6667 2.7335 14.6667H13.2668C14.2668 14.6667 14.6668 14.24 14.6668 13.18V10.4867C14.6668 9.42667 14.2668 9 13.2668 9Z"
                stroke="#2E2A40"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.2668 1H2.7335C1.7335 1 1.3335 1.42667 1.3335 2.48667V5.18C1.3335 6.24 1.7335 6.66667 2.7335 6.66667H13.2668C14.2668 6.66667 14.6668 6.24 14.6668 5.18V2.48667C14.6668 1.42667 14.2668 1 13.2668 1Z"
                stroke="#2E2A40"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <h6
              className="fw-semibold m-0 mb-3 mb-md-0 blueTextColor"
              style={{ fontSize: "0.875rem" }}
            >
              {BoardName}
            </h6>
          </div>
          <div className="d-flex">
            {dropdownBtnValues.map((item) => {
              return (
                <Dropdown key={item.label}>
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
            <Link to={"./"} className="text-decoration-none">
              <Button
                className="border-0 my-1 rounded-1 btn all-btn text-white fs-sm d-none d-md-block"
                style={{
                  backgroundColor: "#006747EB",
                }}
              >
                View All
              </Button>
            </Link>
          </div>
        </div>
        <div
          className="progress rounded-3 mb-4 ms-4"
          role="progressbar"
          style={{ height: "0.0625rem" }}
        >
          <div
            class="progress-bar"
            style={{ width: "14%", backgroundColor: "#2E2A40" }}
          ></div>
        </div>
      </div>
      <div
        className="row  justify-content-between row-cols-2 g-2 g-lg-3 px-3 pb-3 mx-5"
        style={{ backgroundColor: "#F9F9FB" }}
      >
        {/* Use the getSlicedData function to map over only the data for the current page */}
        {getSlicedData().map((conflict) => {
          return <TaskCard {...conflict} key={conflict.ticket_id} />;
        })}
      </div>
      <PaginationBar
        data={conflictsData.conflicts}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        className={`m-4`}
      />
    </div>
  );
};

export const TaskCard = ({
  complainant_img,
  respondent_img,
  complaint_type,
  time,
  status,
  percent_complete,
  date_issued,
  name,
}) => {
  const progressColor = () => {
    if (status === "open") {
      return { backgroundColor: "#FFC306" };
    } else if (status === "closed") {
      return { backgroundColor: "#FF0000B2" };
    } else if (status === "resolved") {
      return { backgroundColor: "#33B843" };
    } else if (status === "pending") {
      return { backgroundColor: "#9747FF" };
    } else {
      return { backgroundColor: "#4B445380" };
    }
  };
  return (
    <div
      className="bg-white rounded-1 p-3"
      style={{ maxWidth: "18rem", maxHeight: "11.25rem" }}
    >
      <div className="d-flex justify-content-between ">
        <div>
          <h6 className="m-0 blueTextColor text-capitalize">
            {complaint_type}
          </h6>
          <p className="m-0 fs-sm lightTextColor">Time: {time}</p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.33333 6.66797C2.6 6.66797 2 7.26797 2 8.0013C2 8.73464 2.6 9.33464 3.33333 9.33464C4.06667 9.33464 4.66667 8.73464 4.66667 8.0013C4.66667 7.26797 4.06667 6.66797 3.33333 6.66797Z"
            fill="#2E2A40"
          />
          <path
            d="M12.6668 6.66797C11.9335 6.66797 11.3335 7.26797 11.3335 8.0013C11.3335 8.73464 11.9335 9.33464 12.6668 9.33464C13.4002 9.33464 14.0002 8.73464 14.0002 8.0013C14.0002 7.26797 13.4002 6.66797 12.6668 6.66797Z"
            fill="#2E2A40"
          />
          <path
            d="M7.99984 6.66797C7.2665 6.66797 6.6665 7.26797 6.6665 8.0013C6.6665 8.73464 7.2665 9.33464 7.99984 9.33464C8.73317 9.33464 9.33317 8.73464 9.33317 8.0013C9.33317 7.26797 8.73317 6.66797 7.99984 6.66797Z"
            fill="#2E2A40"
          />
        </svg>
      </div>

      <div className="d-flex justify-content-between" aria-label="progress">
        <span className="d-flex align-items-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 10.125H5.5C5.295 10.125 5.125 9.955 5.125 9.75C5.125 9.545 5.295 9.375 5.5 9.375H10.5C10.705 9.375 10.875 9.545 10.875 9.75C10.875 9.955 10.705 10.125 10.5 10.125Z"
              fill="#2E2A40"
            />
            <path
              d="M10.5 6.625H5.5C5.295 6.625 5.125 6.455 5.125 6.25C5.125 6.045 5.295 5.875 5.5 5.875H10.5C10.705 5.875 10.875 6.045 10.875 6.25C10.875 6.455 10.705 6.625 10.5 6.625Z"
              fill="#2E2A40"
            />
            <path
              d="M10.5 3.125H5.5C5.295 3.125 5.125 2.955 5.125 2.75C5.125 2.545 5.295 2.375 5.5 2.375H10.5C10.705 2.375 10.875 2.545 10.875 2.75C10.875 2.955 10.705 3.125 10.5 3.125Z"
              fill="#2E2A40"
            />
            <path
              d="M2.00021 3.62375C1.90521 3.62375 1.81021 3.58875 1.73521 3.51375L1.23521 3.01375C1.09021 2.86875 1.09021 2.62875 1.23521 2.48375C1.38021 2.33875 1.62021 2.33875 1.76521 2.48375L2.00021 2.71875L3.23521 1.48375C3.38021 1.33875 3.62021 1.33875 3.76521 1.48375C3.91021 1.62875 3.91021 1.86875 3.76521 2.01375L2.26521 3.51375C2.19021 3.58875 2.09521 3.62375 2.00021 3.62375Z"
              fill="#2E2A40"
            />
            <path
              d="M2.00021 7.12375C1.90521 7.12375 1.81021 7.08875 1.73521 7.01375L1.23521 6.51375C1.09021 6.36875 1.09021 6.12875 1.23521 5.98375C1.38021 5.83875 1.62021 5.83875 1.76521 5.98375L2.00021 6.21875L3.23521 4.98375C3.38021 4.83875 3.62021 4.83875 3.76521 4.98375C3.91021 5.12875 3.91021 5.36875 3.76521 5.51375L2.26521 7.01375C2.19021 7.08875 2.09521 7.12375 2.00021 7.12375Z"
              fill="#2E2A40"
            />
            <path
              d="M2.00021 10.6238C1.90521 10.6238 1.81021 10.5888 1.73521 10.5138L1.23521 10.0138C1.09021 9.86875 1.09021 9.62875 1.23521 9.48375C1.38021 9.33875 1.62021 9.33875 1.76521 9.48375L2.00021 9.71875L3.23521 8.48375C3.38021 8.33875 3.62021 8.33875 3.76521 8.48375C3.91021 8.62875 3.91021 8.86875 3.76521 9.01375L2.26521 10.5138C2.19021 10.5888 2.09521 10.6238 2.00021 10.6238Z"
              fill="#2E2A40"
            />
          </svg>
          <p className="fs-sm fw-medium m-0 ms-2 blueTextColor text-capitalize">
            {status} Conflict
          </p>
        </span>
        <p className="fs-sm fw-medium m-0 blueTextColor">{percent_complete}%</p>
      </div>

      <div
        className="progress rounded-3 mt-2 mb-4"
        role="progressbar"
        aria-label={`${complaint_type} ${percent_complete}% complete`}
        aria-valuenow={percent_complete}
        aria-valuemin="0"
        aria-valuemax="100"
        style={{ height: "0.25rem" }}
      >
        <div
          class="progress-bar"
          style={{ ...progressColor(), width: percent_complete + "%" }}
        ></div>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <p className="fs-sm px-2 py-1 m-0 border border-1 rounded-1 fw-medium">
          {date_issued}
        </p>

        <span className="d-flex">
          <img
            className="disputing-party complainant"
            src={complainant_img}
            alt={name}
          />
          <img
            className="disputing-party respondent border border-2 border-white rounded-circle"
            src={respondent_img}
            alt={name}
          />
        </span>
      </div>
    </div>
  );
};
