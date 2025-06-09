// the text and design(design|text) used for this component includes:
// completed|Completed, canceled|Canceled, refunded|Refunded, dispute|In Dispute, pending-confirmation|Pending Confirmation, awaiting|Awaiting Delivery, pending-payment|Pending Payment, resolved|Resolved, unresolved|Unresolved
import TransactionData from "../../data/dummyData/transactionData.json";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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
  return (
    <div className="border-0 shadow p-3" style={{ width: "100%" }}>
      {/* <div className="col-lg-9 border shadow" style={{ width: "100%" }}> */}
      <div>
        <div className="d-flex justify-content-between mb-3 mt-3">
          <h5 className="ms-4">Recent Notification</h5>
          <Link to={"./notification"} className="text-decoration-none">
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

        <table className="table transaction-table">
          <thead className="text-center">
            <tr>
              <th>Goal Type</th>
              <th className="d-none d-lg-table-cell">Subject</th>
              <th className="d-none d-lg-table-cell">Target Achievement</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {TransactionData.recent_notification.map((mini) => {
              return <UserDashboardNotification {...mini} key={mini.id} />;
            })}
          </tbody>
        </table>
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
    <>
      <tr className="text-center border-bottom">
        <td className="p-md-3 text-small">{goalType}</td>
        <td className="p-md-3 d-none d-lg-table-cell text-small">{subject}</td>
        <td className="p-md-3 d-none d-lg-table-cell text-small">
          {targetAchievement}
        </td>

        <td className="p-md-3 text-small">{date}</td>
        <td className="p-md-3 text-small">
          <Styling text={status} styles={status_style} />
        </td>
        <td className="d-none d-md-table-cell py-md-3 text-center">
          <Button variant="outline-primary" className="rounded-1 fs-sm">
            {action}
          </Button>
        </td>
      </tr>
    </>
  );
};

// the code below shows how to use the component above
// <Notifications
// 	text="Pending Confirmation"
// 	styles="pending-confirmation"
// />;
