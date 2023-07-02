// the text and design(design|text) used for this component includes:
// completed|Completed, canceled|Canceled, refunded|Refunded, dispute|In Dispute, pending-confirmation|Pending Confirmation, awaiting|Awaiting Delivery, pending-payment|Pending Payment, resolved|Resolved, unresolved|Unresolved
import TransactionData from "../../data/dummyData/transactionData.json";

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
    <div className="border shadow p-3" style={{ width: "100%" }}>
      {/* <div className="col-lg-9 border shadow" style={{ width: "100%" }}> */}
      <div>
        {/* <div className="px-4 mb-3">
          <Link to={"../transaction"}>
            <GeneralBtnStyle1 text="New Transaction" />
          </Link>
        </div> */}

        <table className="table transaction-table">
          <thead className="text-center">
            <h4 className="">Recent Notification</h4>
            <tr>
              <th>Goal Type</th>
              <th className="d-none d-lg-table-cell">Subject</th>
              <th className="d-none d-lg-table-cell">Target Achievement</th>
              <th>Date</th>
              <th>Slip</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TransactionData.recent_notification.map((mini) => {
              return <UserDashboardNotification {...mini} key={mini.id} />;
            })}
          </tbody>
        </table>
        {/* <div className="p-4 text-md-end d-none d-md-block">
          <Link to={"./transaction"}>
            <ViewMoreButton />
          </Link>
        </div> */}
        {/* <div className="text-center d-lg-none .d-xl-block">
          <Link to={"./transaction"}>
            <ViewMoreButton />
          </Link>
        </div> */}
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
    Slip,
    status,
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
        <td className="p-md-3 text-small">{Slip}</td>
        <td className="p-md-3 d-flex justify-content-center align-items-center text-small">
          <Styling text={status} styles={status_style} />
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
