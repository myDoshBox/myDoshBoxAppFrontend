import React from "react";
import { NotificationCard } from "../../../components/TableComponents/TransactionTable";
import usersData from "../../../data/usersData.json";
import { FilterButton } from "../../../components/ButtonsComponent/OtherButtons";
import { PaginationBar } from "../../../components/PaginationComponent";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { useState } from "react";
import { SortIcon } from "../../../components/IconComponent/UserdashboardIcons";
import {
  ArrowDownIcon,
  FilterIcon,
} from "../../../components/IconComponent/NavigationAndViewIcon";

const NotifictionPage = () => {
  return (
    <div className="container-fluid bg-light min-vh-100 px-0 ">
      <div className="row gx-0">
        <div className="col-lg-3 d-none d-lg-block bg-white border-end"></div>
        <div className="col-lg-9 col-12 mt-5">
          <UserDashboardNavbar />
          <div className="mt-3">
            <Notification />
          </div>
        </div>
      </div>
    </div>
  );
};

const Notification = () => {
  return (
    <div className="row pe-lg-5">
      <div className="card mx-auto mt-4 p-4 shadow border-0">
        <div className="card-body d-flex justify-content-between pb-3 border-bottom pt-0">
          <h5 className="m-0">Notifications</h5>
          {/* <CustomButton
            value="Sort by: Recent"
            className="btn border text-success text-small viewBtn"
            lefticon={<SortIcon />}
            righticon={<ArrowDownIcon />}
          /> */}
        </div>
        <div>
          {usersData.notificationData.map((notificationData) => {
            return (
              <div className="" key={notificationData.id}>
                <NotificationCard {...notificationData} />
              </div>
            );
          })}
        </div>
        <div className="px-lg-5 py-4">{/* <PaginationBar /> */}</div>
      </div>
    </div>
  );
};

export default NotifictionPage;
