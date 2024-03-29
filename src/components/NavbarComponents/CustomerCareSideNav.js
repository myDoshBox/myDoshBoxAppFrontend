import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  ChatIcon,
  DashboardIcon,
  LogoutIcon,
  NavTransactionIcon,
  NotificationIcon,
  SettingsIcon,
  UsersIcon,
  TicketsIcon,
} from "../IconComponent/SideNavIcons";
import doshlogo from "../../images/doshlogolight.png";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";

const CustomerCareSideNav = () => {
  return (
    <>
      <MobileScreen />
      <DesktopScreen />
      <Outlet />
    </>
  );
};

const options = [
  {
    scroll: true,
    backdrop: false,
  },
];

const MobileScreenSideNav = ({ name, ...props }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);
  let activeClassName = "active-link";
  let baseClassName = "text-decoration-none text-white";
  const disappearEl = useRef(null);
  const navigate = useNavigate();
  const handleDisappear = () => {
    disappearEl.style.display = "none";
  };

  const nav = () => {
    navigate("/");
  };

  return (
    <>
      <Button
        onClick={toggleShow}
        className="me-2 bg-white border-0 d-lg-none position-fixed start-0 top-0"
      >
        <svg
          width="30"
          height="20"
          viewBox="0 0 30 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 8.33333H22.5V11.6667H0V8.33333ZM0 0H30V3.33333H0V0ZM0 20H13.5656V16.6667H0V20Z"
            fill="#006747"
          />
        </svg>
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        responsive="lg"
        className="w-75 d-lg-none text-white"
        {...props}
        ref={disappearEl}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src={doshlogo} alt="logo" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex justify-content-between flex-column">
            <ul className="ps-2">
              <li className="d-flex mb-4 align-items-center SideNavItem">
                <div className="me-3">
                  <DashboardIcon />
                </div>
                <NavLink
                  end
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                  to="../customer-care"
                  onClick={handleDisappear}
                >
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li className="d-flex mb-4 align-items-center SideNavItem">
                <div className="me-3">
                  <NavTransactionIcon />
                </div>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                  to="transactions"
                  onClick={handleDisappear}
                >
                  <span>Transactions</span>
                </NavLink>
              </li>
              <li className="d-flex mb-4 align-items-center SideNavItem">
                <div className="me-3">
                  <UsersIcon />
                </div>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                  to="users"
                  onClick={handleDisappear}
                >
                  <span>Users</span>
                </NavLink>
              </li>
              {/* <li className="d-flex align-items-center SideNavItem mb-4">
                <div className="me-3">
                  <ChatIcon />
                </div>
                <span className="my-1">Chats</span>
              </li> */}
              <li className="d-flex align-items-center SideNavItem mb-4">
                <div className="me-3">
                  <NotificationIcon />
                </div>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                  to="notification"
                  onClick={handleDisappear}
                >
                  <span>Notifications</span>
                </NavLink>
              </li>
              <li className="d-flex  align-items-center SideNavItem mb-4">
                <div className="me-3">
                  <TicketsIcon />
                </div>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                  to="tickets-history"
                  onClick={handleDisappear}
                >
                  <span>Tickets</span>
                </NavLink>
              </li>
              <li className="d-flex align-items-center SideNavItem mb-5">
                <div className="me-3">
                  <SettingsIcon />
                </div>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                  to="settings"
                  onClick={handleDisappear}
                >
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
            <ul className="ps-3">
              <li
                className="d-flex align-items-center SideNavItem mt-5 bottom position-fixed"
                onClick={nav}
                style={{ cursor: "pointer" }}
              >
                <div className="me-3">
                  <LogoutIcon />
                </div>
                <span className="text-white">Logout</span>
              </li>
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const DesktopScreen = ({ name, ...props }) => {
  let activeClassName = "active-link";
  let baseClassName = "text-decoration-none text-white";
  const navigate = useNavigate();

  const nav = () => {
    navigate("/");
  };

  return (
    <>
      <div className="d-none d-lg-block big-side-nav">
        <Link to="/">
          <img src={doshlogo} alt="logo" className="mb-5" />
        </Link>
        <div className="d-flex justify-content-between flex-column">
          <ul className="ps-2">
            <li className="d-flex mb-4 align-items-center SideNavItem">
              <div className="me-3">
                <DashboardIcon />
              </div>
              <NavLink
                end
                className={({ isActive }) =>
                  isActive ? activeClassName : baseClassName
                }
                to="../customer-care"
              >
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="d-flex mb-4 align-items-center SideNavItem">
              <div className="me-3">
                <NavTransactionIcon />
              </div>
              <NavLink
                className={({ isActive }) =>
                  isActive ? activeClassName : baseClassName
                }
                to="transactions"
              >
                <span>Transactions</span>
              </NavLink>
            </li>
            <li className="d-flex mb-4 align-items-center SideNavItem">
              <div className="me-3">
                <UsersIcon />
              </div>
              <NavLink
                className={({ isActive }) =>
                  isActive ? activeClassName : baseClassName
                }
                to="users"
              >
                <span>Users</span>
              </NavLink>
            </li>
            {/* <li className="d-flex align-items-center SideNavItem mb-4">
              <div className="me-3">
                <ChatIcon />
              </div>
              <span className="my-1">Chats</span>
            </li> */}
            <li className="d-flex align-items-center SideNavItem mb-4">
              <div className="me-3">
                <NotificationIcon />
              </div>
              <NavLink
                className={({ isActive }) =>
                  isActive ? activeClassName : baseClassName
                }
                to="notification"
              >
                <span>Notifications</span>
              </NavLink>
            </li>
            <li className="d-flex  align-items-center SideNavItem mb-4">
              <div className="me-3">
                <TicketsIcon />
              </div>
              <NavLink
                className={({ isActive }) =>
                  isActive ? activeClassName : baseClassName
                }
                to="tickets-history"
              >
                <span>Tickets</span>
              </NavLink>
            </li>
            <li className="d-flex align-items-center SideNavItem mb-5">
              <div className="me-3">
                <SettingsIcon />
              </div>
              <NavLink
                className={({ isActive }) =>
                  isActive ? activeClassName : baseClassName
                }
                to="settings"
              >
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
          <ul className="ps-3">
            <li
              className="d-flex align-items-center SideNavItem mt-5 bottom position-fixed"
              onClick={nav}
              style={{ cursor: "pointer" }}
            >
              <div className="me-3">
                <LogoutIcon />
              </div>
              <span className="text-white">Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

const MobileScreen = () => {
  return (
    <>
      {options.map((props, idx) => (
        <MobileScreenSideNav key={idx} {...props} />
      ))}
    </>
  );
};

export default CustomerCareSideNav;
