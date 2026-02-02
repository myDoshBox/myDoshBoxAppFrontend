import { Notifications } from "../NotificationComponent/NotificationComponents";
import AdminTicketDetails from "../../data/TicketData.json";
import { PaginationBar } from "../PaginationComponent";
import { Link } from "react-router-dom";
import { ViewMoreButton } from "../ButtonsComponent/NavigationAndViewButtons";
import { useState } from "react";

export const TicketHistoryTable = () => {
  return (
    <>
      <div className="border-0 rounded shadow p-4">
        <table className="table transaction-table">
          <thead>
            <tr className="text-center">
              <th className="fsw-light">Date Issued</th>
              <th className="fsw-light">Ticket ID</th>
              <th className="fsw-light">Transaction ID</th>
              <th className="small-hide">Complaint Type</th>
              <th className="small-hide">Complainer</th>
              <th className="small-hide">Complainer ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {AdminTicketDetails.AdminTicketDetails.map((data) => {
              return <TicketHistoryData {...data} key={data.id} />;
            })}
          </tbody>
        </table>
        <PaginationBar />
      </div>
    </>
  );
};

export const CustomerCareTickets = () => {
  const data = AdminTicketDetails.AdminTicketDetails.slice(0, 5);
  return (
    <>
      <div className="border-0 rounded shadow container p-3 mb-5">
        <table className="table transaction-table">
          <thead>
            <tr className="text-center">
              <th className="fsw-light">Date Issued</th>
              <th className="fsw-light">Ticket ID</th>
              <th className="fsw-light">Transaction ID</th>
              <th className="small-hide">Complaint Type</th>
              <th className="small-hide">Complainer</th>
              <th className="small-hide">Complainer ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((data) => {
              return <TicketHistoryData {...data} key={data.id} />;
            })}
          </tbody>

          <Link to={"tickets-history"}>
            <ViewMoreButton />
          </Link>
        </table>
      </div>
    </>
  );
};

const TicketHistoryData = (props) => {
  const {
    date,
    ticket_id,
    transaction_id,
    complaint_type,
    complainer,
    complainer_id,
    status_name,
    status_style,
  } = props;
  return (
    <tr className="text-center border-bottom">
      <td className="py-3">{date}</td>
      <td className="py-3">{ticket_id}</td>
      <td className="py-3">{transaction_id}</td>
      <td className="small-hide py-3">{complaint_type}</td>
      <td className="small-hide py-3">{complainer}</td>
      <td className="small-hide py-3">{complainer_id}</td>
      <td className="d-flex justify-content-center align-items-center py-3">
        <Notifications text={status_name} styles={status_style} />
      </td>
    </tr>
  );
};

export const SmallAdminTicketHistory = () => {
  return (
    <>
      <div className="card border-0 shadow p-4">
        <h6 className="border-bottom pb-3">Ticket History</h6>
        <table className="">
          <thead>
            <tr className="text-center text-body-tertiary fw-semibold">
              <th>Ticket ID</th>
              <th>Date Issued</th>
              <th>Date Resolved</th>
            </tr>
          </thead>
          <tbody>
            {AdminTicketDetails.SmallTicketHistory.map((history) => {
              return (
                <SmallAdminTicketHistoryData {...history} key={history.id} />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const SmallAdminTicketHistoryData = (props) => {
  const { ticket_id, start_date, complete_date } = props;

  return (
    <>
      <tr className="text-center">
        <td className="pt-2">{ticket_id}</td>
        <td className="pt-2">{start_date}</td>
        <td className="pt-2">{complete_date}</td>
      </tr>
    </>
  );
};

export const SmallAdminRecentTransactions = () => {
  return (
    <>
      <div className="card border-0 shadow p-4">
        <h6 className="border-bottom pb-3">Recent Transaction</h6>
        <table className="">
          <thead>
            <tr className="text-center text-body-tertiary fw-semibold">
              <th>Transaction ID</th>
              <th>Status</th>
              <th>...</th>
            </tr>
          </thead>
          <tbody>
            {AdminTicketDetails.SmallRecentTransactions.map((history) => {
              return (
                <SmallAdminRecentTransactionsData
                  {...history}
                  key={history.id}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const SmallAdminRecentTransactionsData = (props) => {
  const { transaction_id, status, view } = props;

  return (
    <>
      <tr className="text-center">
        <td className="pt-4">{transaction_id}</td>
        <td className="pt-4">{status}</td>
        <td className="pt-4">{view}</td>
      </tr>
    </>
  );
};
