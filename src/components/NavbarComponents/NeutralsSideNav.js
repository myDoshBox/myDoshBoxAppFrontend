import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  DashboardIcon,
  LogoutIcon,
  NavTransactionIcon,
  NotificationIcon,
  SettingsIcon,
} from "../IconComponent/SideNavIcons";
import doshlogo from "../../images/doshlogolight.png";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Link, Outlet, NavLink } from "react-router-dom";

const NeutralsSideNav = () => {
  return (
    <>
      <SmallShow />
      <BigShow />
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

const SmallShowExample = ({ name, ...props }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);
  let activeClassName = "active-link";
  let baseClassName = "text-decoration-none text-white";

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
                  to="neutraldashboardpage"
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li className="d-flex mb-4 align-items-center SideNavItem">
                <div className="me-3">
                  <NavTransactionIcon />
                </div>
                <span>
                  {["end"].map((direction) => (
                    <DropdownButton
                      key={direction}
                      id={`dropdown-button-drop-${direction}`}
                      drop={direction}
                      variant="secondary"
                      title={`Conflicts`}
                      className="SideNavDropdown"
                    >
                      <Dropdown.Item eventKey="1">
                        <NavLink
                          to="open-conflicts"
                          exact
                          className={({ isActive }) =>
                            isActive ? activeClassName : baseClassName
                          }
                        >
                          Open Conflicts
                        </NavLink>
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="2">
                        <NavLink
                          to="ongoing-conflicts"
                          exact
                          className={({ isActive }) =>
                            isActive ? activeClassName : baseClassName
                          }
                        >
                          Ongoing Conflicts
                        </NavLink>
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="3">
                        <NavLink
                          to="closed-conflicts"
                          exact
                          className={({ isActive }) =>
                            isActive ? activeClassName : baseClassName
                          }
                        >
                          Closed Conflicts
                        </NavLink>
                      </Dropdown.Item>
                    </DropdownButton>
                  ))}
                </span>
              </li>
              <li className="d-flex align-items-center SideNavItem mb-4">
                <div className="me-3">
                  <NotificationIcon />
                </div>
                <NavLink
                  to="notification"
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <span>Notifications</span>
                </NavLink>
              </li>
              <li className="d-flex align-items-center SideNavItem mb-5">
                <div className="me-3">
                  <SettingsIcon />
                </div>
                <NavLink
                  to="neutralsetting"
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
            <ul className="ps-3">
              <li className="d-flex align-items-center SideNavItem mt-5 position-fixed bottom">
                <div className="me-3">
                  <LogoutIcon />
                </div>
                <span>Logout</span>
              </li>
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const BigShowExample = ({ name, ...props }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);
  let activeClassName = "active-link";
  let baseClassName = "text-decoration-none text-white";

  return (
    <>
      <Button
        onClick={toggleShow}
        className="me-2 bg-white border-0 d-none d-lg-block position-fixed start-0 top-0"
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
        {...props}
        className="d-none d-lg-block"
      >
        <Offcanvas.Header>
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
                  to="neutraldashboardpage"
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li className="d-flex mb-4 align-items-center SideNavItem">
                <div className="me-3">
                  <NavTransactionIcon />
                </div>
                <span>
                  {["end"].map((direction) => (
                    <DropdownButton
                      key={direction}
                      id={`dropdown-button-drop-${direction}`}
                      drop={direction}
                      variant="secondary"
                      title={`Conflicts`}
                      className="SideNavDropdown"
                    >
                      <Dropdown.Item eventKey="1">
                        <NavLink
                          to="open-conflicts"
                          exact
                          className={({ isActive }) =>
                            isActive ? activeClassName : baseClassName
                          }
                        >
                          Open Conflicts
                        </NavLink>
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="2">
                        <NavLink
                          to="ongoing-conflicts"
                          exact
                          className={({ isActive }) =>
                            isActive ? activeClassName : baseClassName
                          }
                        >
                          Ongoing Conflicts
                        </NavLink>
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="3">
                        <NavLink
                          to="closed-conflicts"
                          exact
                          className={({ isActive }) =>
                            isActive ? activeClassName : baseClassName
                          }
                        >
                          Closed Conflicts
                        </NavLink>
                      </Dropdown.Item>
                    </DropdownButton>
                  ))}
                </span>
              </li>
              <li className="d-flex align-items-center SideNavItem mb-4">
                <div className="me-3">
                  <NotificationIcon />
                </div>
                <NavLink
                  to="notification"
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <span>Notifications</span>
                </NavLink>
              </li>
              <li className="d-flex align-items-center SideNavItem mb-5">
                <div className="me-3">
                  <SettingsIcon />
                </div>
                <NavLink
                  to="neutralsetting"
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
            <ul className="ps-3">
              <li className="d-flex align-items-center SideNavItem mt-5 bottom position-fixed">
                <div className="me-3">
                  <LogoutIcon />
                </div>
                <span>Logout</span>
              </li>
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const BigShow = () => {
  return (
    <>
      {options.map((props, idx) => (
        <BigShowExample key={idx} {...props} />
      ))}
    </>
  );
};
const SmallShow = () => {
  return (
    <>
      {options.map((props, idx) => (
        <SmallShowExample key={idx} {...props} />
      ))}
    </>
  );
};

export default NeutralsSideNav;