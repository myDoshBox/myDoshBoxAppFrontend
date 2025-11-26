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
import { Collapse } from "react-bootstrap";

const NotifictionPage = () => {
  return (
    <div className="container-fluid px-0">
      <div className="row gx-0">
        {/* Sidebar */}
        <div className="col-lg-3 d-none d-lg-block bg-white border-end" />

        {/* Main Content */}
        <div className="col-12">
          <UserDashboardNavbar />

          <div className="container-fluid px-3 px-md-4 mt-4">
            <Notification />
          </div>
        </div>
      </div>
    </div>
  );
};

const Notification = () => {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-12 col-md-11 col-lg-11 col-xl-11">
        <div className="card shadow-sm border-0 p-3 p-md-4 mt-4">
          {/* Header */}
          <div className="card-body d-flex justify-content-between align-items-center border-bottom pb-3 pt-0">
            <h5 className="m-0 fw-bold">Notifications</h5>
          </div>

          {/* Notification List */}
          <div className="mt-3">
            {usersData.notificationData.map((notificationData) => (
              <NotificationCard
                key={notificationData.id}
                {...notificationData}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// const NotifictionPage = () => {
//   return (
//     <div className="container-fluid bg-light min-vh-100 px-0 ">
//       <div className="row gx-0">
//         <div className="col-lg-3 d-none d-lg-block bg-white border-end"></div>
//         <div className="col-lg-9 col-12 mt-5">
//           <UserDashboardNavbar />
//           <div className="mt-3">
//             <Notification />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Notification = () => {
//   return (
//     <div className="row ms-4 " style={{width:"100%"}}>
//       <div className="card mx-auto mt-4 p-4 shadow border-0">
//         <div className="card-body d-flex justify-content-between pb-3 border-bottom pt-0">
//           <h5 className="m-0">Notifications</h5>
//           {/* <CustomButton
//             value="Sort by: Recent"
//             className="btn border text-success text-small viewBtn"
//             lefticon={<SortIcon />}
//             righticon={<ArrowDownIcon />}
//           /> */}
//         </div>
//         <div>
//           {usersData.notificationData.map((notificationData) => {
//             return (
//               <div className="" key={notificationData.id}>
//                 <NotificationCard {...notificationData} />
//               </div>
//             );
//           })}
//         </div>
//         <div className="px-lg-5 py-4">{/* <PaginationBar /> */}</div>
//       </div>
//     </div>
//   );
// };

export default NotifictionPage;
