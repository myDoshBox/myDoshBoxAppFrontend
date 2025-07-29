import { memo } from "react";
import { Notifications } from "../NotificationComponent/NotificationComponents";
import TransactionData from "../../data/dummyData/transactionData.json";
import { RecentTransactionTableData } from "../../pages/TRANSACTION_PAGES/PRODUCT_TRANSACTION_PAGES/UserTransactionHistory";
import { Link } from "react-router-dom";
import { ViewMoreButton } from "../ButtonsComponent/NavigationAndViewButtons";

export const NotificationCard = (props) => {
  const { image, title, description, link } = props;
  return (
    <div className="d-flex justify-content-around align-items-center border-bottom p-2">
      <img src={image} alt="SampleUserImg" className="" />
      <h6 className="d-none d-lg-block mx-3 text-small mb-0">{title}</h6>
      <div className="d-inline">
        <p className="w-100 ps-3 ps-md-0 text-small m-0">{description}</p>
      </div>
      {/* <CustomBtn
        value={link}
        className="btn border text-success text-small viewBtn"
        style={{ "whiteSpace": "nowrap" }}
          /> */}
    </div>
  );
};

//RecentTransactionTable

export const MiniRecentTransactionTable = () => {
  return (
    <div className="rounded-3 shadow p-3" style={{ width: "100%" }}>
      {/* <div className="col-lg-9 border shadow" style={{ width: "100%" }}> */}
      <div>
        {/* <div className="px-4 mb-3">
          <Link to={"../transaction"}>
            <GeneralBtnStyle1 text="New Transaction" />
          </Link>
        </div> */}

        <table className="table transaction-table">
          <thead className="text-center">
            <tr>
              <th>Product Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TransactionData.mini_transaction.map((mini) => {
              return <RecentTransactionTableData {...mini} key={mini.id} />;
            })}
          </tbody>
        </table>
        <div className="p-4 text-md-end d-none d-md-block">
          <Link to={"./transaction"}>
            <ViewMoreButton />
          </Link>
        </div>
        <div className="text-center d-lg-none .d-xl-block">
          <Link to={"./transaction"}>
            <ViewMoreButton />
          </Link>
        </div>
      </div>
    </div>
  );
};

// AdminRecentTransactionsCard
export const AdminRecentTransactionsCard = memo(({ style }) => {
  console.count("AdminRecentTransactionsCard: ");
  return (
    <div className={`${style} mb-3 mb-md-0`}>
      <div className={`card p-3 shadow rounded border-0 h-100`}>
        <h6 className="pb-3 m-0">Recent Transactions</h6>
        <table class="table m-0 h-100">
          <thead>
            <tr>
              <th scope="col" className="opacity-50 text-center">
                Transaction Id
              </th>
              <th scope="col" className="opacity-50 text-center">
                Status
              </th>
              <th scope="col" className="opacity-50 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody className="h-100">
            {TransactionData.mini_transaction.map((mini) => {
              return (
                <>
                  <tr key={mini.id} className="text-center border-bottom">
                    <td className="p-md-3 text-small">{mini.id}</td>
                    {/* <td className="p-md-3 text-small">{mini.status_name}</td> */}
                    <td className="p-md-3 d-flex justify-content-center align-items-center border-0">
                      <Notifications
                        value={mini.status_name}
                        className={`text-small ${mini.status_style} border-0`}
                      />
                    </td>
                    <td className="p-md-3 text-small">View</td>
                  </tr>
                </>
              );
            })}
            <Link
              to="../transaction"
              className="d-flex justify-content-center pt-3 text-decoration-none w-100"
              style={{ whiteSpace: "nowrap" }}
            >
              <ViewMoreButton />
            </Link>
          </tbody>
        </table>
      </div>
    </div>
  );
});
