import React from "react";
import { NotificationCard } from "../../../components/TableComponents/TransactionTable";
import usersData from "../../../data/usersData.json";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Bell, CheckCircle, AlertCircle, Info } from "react-feather"; // You can replace with your own icon set

const NotifictionPage = () => {
  return (
    <div className="container-fluid bg-light min-vh-100 px-0">
      <div className="row gx-0">
        <div className="col-lg-3 d-none d-lg-block bg-white border-end"></div>
        <div className="col-lg-9 col-12">
          <UserDashboardNavbar />
          <main className="p-4">
            <Notification />
          </main>
        </div>
      </div>
    </div>
  );
};

const Notification = () => {
  return (
    <section className="bg-white p-4 rounded-4 shadow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">🔔 Notifications Center</h3>
      </div>

      <ul className="list-unstyled">
        {usersData.notificationData.map((notification) => (
          <li
            key={notification.id}
            className={`p-3 mb-3 rounded-4 d-flex align-items-start shadow-sm notification-item ${
              getTypeClass(notification.type)
            }`}
            style={{ transition: "all 0.3s", backgroundColor: getBgColor(notification.type) }}
          >
            <div className="me-3">{getIcon(notification.type)}</div>
            <div className="flex-grow-1">
              <NotificationCard {...notification} />
            </div>
          </li>
        ))}
      </ul>

      <div className="pt-4 d-flex justify-content-center">
        <PaginationBar />
      </div>
    </section>
  );
};

// Utility functions for icons and styles
const getIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircle className="text-success" size={24} />;
    case "error":
      return <AlertCircle className="text-danger" size={24} />;
    case "info":
      return <Info className="text-primary" size={24} />;
    default:
      return <Bell className="text-secondary" size={24} />;
  }
};

const getTypeClass = (type) => {
  switch (type) {
    case "success":
      return "border-start border-4 border-success";
    case "error":
      return "border-start border-4 border-danger";
    case "info":
      return "border-start border-4 border-primary";
    default:
      return "border-start border-4 border-secondary";
  }
};

const getBgColor = (type) => {
  switch (type) {
    case "success":
      return "#f3fef5";
    case "error":
      return "#fff5f5";
    case "info":
      return "#f0f7ff";
    default:
      return "#f9f9f9";
  }
};

export default NotifictionPage;
