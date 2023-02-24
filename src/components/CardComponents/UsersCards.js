// UserInflowCard {Postponed as it is a graph}

import { useContext, useState } from "react";
//All Buttons/Icon Import Starts
import { RatingIcon } from "../IconComponent/UserdashboardIcons";
import { FilterButton } from "../ButtonsComponent/MiscBtns";
import { GeneralBtnStyle1 } from "../ButtonsComponent/Button";
import { GeneralBtn } from "../ButtonsComponent/GenandAuthBtn";
//All Buttons/icon Import Ends

//All Image Import Starts
import Avatar from "../../images/Avatar.jpg";
//All Image Import Ends
import { Link, useNavigate } from "react-router-dom";
import TransactionData from "../../data/dummyData/transactionData.json";

// UserTransactionsCard, TotalUsersCard, AnalyticsNewUsersCard
export const AnalyticsCard = ({ ResponsiveWidth, BigIcon, SmallIcon, text, value, link, change }) => {
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
          <p className="text-small m-0">{change ? change + " than last week" : null } </p>
        </div>
        </Link>
      </div>
    </div>
  );
};

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
        style={{ width: "100%", height: "9rem" }}
      >
        <div className="row justify-content-center align-items-center mx-auto">
          <div className="col-2">{icon}</div>
          <div className="col-10">{text}</div>
        </div>
      </div>
    </Link>
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
          <p className="ms-lg-1">100 deals completed</p>
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
          <Link to={"../updateprofile"}>
            <GeneralBtn
              text="Edit Profile"
              styles="GeneralBtnStyle1 btn all-btn text-white"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

// MiniUsersCard
export const MiniUsersCard = ({ style }) => {
  const [max, setMax] = useState(5);
  return (
    <div className={`${style} mb-3 mb-md-0`}>
      <div className={`card p-3 shadow rounded border-0 h-100`}>
        <h6 className="pb-3 m-0">All Users</h6>
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="opacity-50">
              User Id
              </th>
              <th scope="col" className="opacity-50">
              Name
              </th>
              <th scope="col" className="opacity-50">
              Completed Transactions
              </th>
            </tr>
          </thead>
          <tbody>
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
          <Link to={""} className="d-flex justify-content-center pe-2 py-3 text-decoration-none w-100" style={{whiteSpace: "nowrap"}}>
                <GeneralBtn
                  text="View More"
                  styles="GeneralBtnStyle1 btn all-btn text-white"
                />
              </Link>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AllUsersCard = () => {
  return (
    <div className="col-lg-9 shadow rounded-1">
      <aside className="d-flex justify-content-end">
        <FilterButton />
      </aside>
      <table class="table table-hover">
        <thead>
          <tr>
            <th className="text-muted text-center" scope="col">
              Image
            </th>
            <th className="text-muted text-center" scope="col">
              Id
            </th>
            <th className="text-muted text-center" scope="col">
              Name
            </th>
            <th className="text-muted text-center" scope="col">
              Tel
            </th>
            <th className="text-muted text-center" scope="col">
              Email
            </th>
            <th className="text-muted text-center" scope="col">
              Address
            </th>
            <th className="text-muted text-center" scope="col">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              {/* <img src={Avatar} className="img-thumbnail col-2" alt="" /> */}
            </th>
            <td className="p-3">3345</td>
            <td className="p-3">Gabriel</td>
            <td className="p-3">09032455678</td>
            <td className="p-3">gabrielChristian@gmail.com</td>
            <td className="p-3">Lorem ipsum dolor sit.</td>
            <td>....</td>
          </tr>
          <tr>
            <th scope="row">
              {/* <img src={Avatar} className="img-thumbnail col-2 " alt="" /> */}
            </th>
            <td className="p-3">3345</td>
            <td className="p-3">Peter</td>
            <td className="p-3">07009033421</td>
            <td className="p-3">SupremePeter@gmail.com</td>
            <td className="p-3">Lorem ipsum dolor sit.</td>
            <td>....</td>
          </tr>
          <tr>
            <th scope="row">
              {/* <img src={Avatar} className="img-thumbnail col-2  " alt="" /> */}
            </th>
            <td className="p-3">6634</td>
            <td className="p-3">Andrew</td>
            <td className="p-3">0818790345</td>
            <td className="p-3">Andrewpaul@gmail.com</td>
            <td className="p-3">Lorem ipsum dolor sit.</td>
            <td className="p-3">....</td>
          </tr>
          <tr>
            <th scope="row">
              {/* <img src={Avatar} className="img-thumbnail col-2  " alt="" /> */}
            </th>
            <td className="p-3">4421</td>
            <td className="p-3">James</td>
            <td className="p-3">0818849302</td>
            <td className="p-3">Jamespaul@gmail.com</td>
            <td className="p-3">Lorem ipsum dolor sit.</td>
            <td className="p-3">....</td>
          </tr>
          <tr>
            <th scope="row">
              {/* <img src={Avatar} className="img-thumbnail" alt="" /> */}
            </th>
            <td className="p-3">3244</td>
            <td className="p-3">Mathew</td>
            <td className="p-3"> 0818790345</td>
            <td className="p-3">PhilipMathew@gmail.com</td>
            <td className="p-3">Lorem ipsum dolor sit.</td>
            <td className="p-3">....</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// UserProfileCard {Done}
export const UserProfileCard = () => {
  const history = useNavigate();

  return (
    <>
      <div class="shadow border-0 p-3 rounded-2">
        <div className="">
          <img src={Avatar} className="mx-auto" alt={Avatar} />
        </div>
        <div className="mt-4 mx-auto">
          <table className="w-100">
            <tr className="d-flex justify-content-between py-3 border-0 border-bottom">
              <td className="text-muted">User Id</td>
              <td className="text-end">34522</td>
            </tr>
            <tr className="d-flex justify-content-between py-3 border-0 border-bottom">
              <td className="text-muted w-25">Name</td>
              <td className="text-end">Christian Gabriel Ugochukwu</td>
            </tr>
            <tr className="d-flex justify-content-between py-3 border-0 border-bottom">
              <td className="text-muted w-25">Phone</td>
              <td className="text-end">+234 9032166043</td>
            </tr>
            <tr className="d-flex justify-content-between py-3 border-0 border-bottom">
              <td className="text-muted w-25">Email</td>
              <td className="text-end">gabrielChristian@gmail.com</td>
            </tr>
            <tr className="d-flex justify-content-between py-3 border-0 border-bottom">
              <td className="text-muted w-25">Address</td>
              <td className="text-end">Royal Palm villa Estate, Sangotedo</td>
            </tr>
            <tr className="d-flex justify-content-between py-3 border-0 border-bottom">
              <td className="text-muted w-25">Account No</td>
              <td>2395289752</td>
            </tr>
            <tr className="d-flex justify-content-between py-3 border-0 border-bottom">
              <td className="text-muted w-25">Bank</td>
              <td>Zenith Bank</td>
            </tr>
          </table>
        </div>
        <div className="d-flex justify-content-center  mt-5">
          <GeneralBtn
            text="Back"
            styles="w-100 GeneralBtnStyle1 btn all-btn text-white text-small"
            onclick={() => history(-1)}
          />
        </div>
      </div>
    </>
  );
};
