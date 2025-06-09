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
    <div className="contestPage">
      <div className="row">
        <div className="col-lg-3"></div>
        <div className="col-lg-9 col-sm-12">
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
