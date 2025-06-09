import { Link } from "react-router-dom";
import DisputesData from "../../../data/dummyData/disputeshistorydata.json";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { DisputeDetailsModal } from "../../../components/Modal";
import { BackButton } from "../../../components/ButtonsComponent/NavigationAndViewButtons";

const UserDisputeHistory = () => {
  return (
    <div className="contestPage">
      <div className="row">
        <div className="col-lg-3 col-sm-12"></div>

        <div className="col-lg-9 col-sm-12">
          <UserDashboardNavbar />
          <div className="mt-5 center-card">
            <DisputeCard />
          </div>
        </div>
      </div>
    </div>
  );
};

const DisputeCard = () => {
  return (
    <div>
      <div className="card shadow rounded-3 border-0 p-lg-5 p-3">
        <div className="row mb-4">
          <div className="col-6">
            <h5>Disputes</h5>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <Link to={"../../../userdashboard"}>
              <BackButton />
            </Link>
          </div>
        </div>
        {DisputesData.disputes_data.map((history) => {
          return <DisputeData {...history} />;
        })}
      </div>
    </div>
  );
};

const DisputeData = (props) => {
  const { date, transaction_id, status } = props;
  return (
    <div className="d-flex justify-content-between align-items-center border-bottom border-dark-subtle py-2">
      <div className="d-flex flex-column">
        <div className="">{date}</div>
        <div className="text-secondary-emphasis">
          TransactionID: <span className="text-dark">{transaction_id}</span>
        </div>
        <div className="text-secondary-emphasis">
          Status:
          <span className="text-dark">{status}</span>
        </div>
      </div>

      <div className="d-flex align-items-end flex-column">
        <DisputeDetailsModal
          openModalText="View Details"
          modalBtnStyle="GeneralBtnStyle1 btn all-btn text-white"
        />
      </div>
    </div>
  );
};

const BackIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="#fff"
      class="bi bi-arrow-left-short"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
      />
    </svg>
  );
};

export default UserDisputeHistory;
