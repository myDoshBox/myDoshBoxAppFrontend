import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  ChatIcon,
  DashboardIcon,
  DisputeIcon,
  LogoutIcon,
  NavTransactionIcon,
  SettledTransactionIcon,
  TransactionProgressIcon,
  TransactionSideNavIcon,
  ShippingDetailsTransactionIcon,
  AllTransactionIcon,
  NotificationIcon,
  SettingsIcon,
} from "../IconComponent/SideNavIcons";
import doshlogo from "../../images/NewDoshLogo.png";
import smdoshlogo from "../../images/doshnewlogo.png";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlices/allUsersAuthSlice";
import { useLogoutMutation } from "../../redux/slices/userSlices/allUsersAPISlice";
import { Collapse } from 'react-bootstrap'; // For collapsible section
import { Tooltip, OverlayTrigger } from 'react-bootstrap';


const UsersSideNav = () => {
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
  const disappearEl = useRef(null);

  const handleDisappear = () => {
    disappearEl.style.display = "none";
  };
  let activeClassName = "active-linkSm";
  let baseClassName = "inactive-linkSm";

  const nav = () => {
    navigate("/");
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      // await logout().unwrap();
      console.log("Dispatching logout action");
      dispatch(logout());
      console.log("Navigating to home");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
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
        className="d-lg-none text-white border-0 shadow"
        style={{ width: "6rem" }}
        {...props}
        ref={disappearEl}
        // id="off-canvas"x
      >
        <Offcanvas.Header>
          <Offcanvas.Title>
            <Link to={"/"}>
              <img src={smdoshlogo} alt="logo" className="smlogo" />
            </Link>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex justify-content-between flex-column">
            <ul className="ps-2">
              <li className="d-flex mb-5 align-items-center">
                <div>
                  <NavLink
                    to="../../userdashboard"
                    end
                    className={({ isActive }) =>
                      isActive ? activeClassName : baseClassName
                    }
                    onClick={handleDisappear}
                  >
                    <DashboardIcon />
                  </NavLink>
                </div>
              </li>
              <li className="d-flex mb-5 align-items-center SideNavItem">
                <div className="me-3">
                  <NavLink
                    to="transaction-history"
                    end
                    className={({ isActive }) =>
                      isActive ? activeClassName : baseClassName
                    }
                    onClick={handleDisappear}
                  >
                    <NavTransactionIcon />
                  </NavLink>
                </div>
              </li>

              <li className="d-flex mb-5 align-items-center SideNavItem">
                <div className="me-3">
                  <NavLink
                    to="transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history"
                    end
                    className={({ isActive }) =>
                      isActive ? activeClassName : baseClassName
                    }
                    onClick={handleDisappear}
                  >
                    <NavTransactionIcon />
                  </NavLink>
                </div>
              </li>

              <li className="d-flex mb-5 align-items-center SideNavItem">
                <div className="me-3">
                  <NavLink
                    to="transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
                    end
                    className={({ isActive }) =>
                      isActive ? activeClassName : baseClassName
                    }
                    onClick={handleDisappear}
                  >
                    <NavTransactionIcon />
                  </NavLink>
                </div>
              </li>

              <li className="d-flex mb-5 align-items-center SideNavItem">
                <div className="me-3">
                  <NavLink
                    to="transaction-history/confirm-escrow-product-transaction/shipping-history"
                    end
                    className={({ isActive }) =>
                      isActive ? activeClassName : baseClassName
                    }
                    onClick={handleDisappear}
                  >
                    <NavTransactionIcon />
                  </NavLink>
                </div>
              </li>
              <li className="d-flex align-items-center SideNavItem mb-5">
                <div>
                  <NavLink
                    to="notification"
                    end
                    className={({ isActive }) =>
                      isActive ? activeClassName : baseClassName
                    }
                    onClick={handleDisappear}
                  >
                    <NotificationIcon />
                  </NavLink>
                </div>
              </li>

              <li className="d-flex  align-items-center SideNavItem mb-5">
                <div className="me-3">
                  <NavLink
                    to="dispute"
                    end
                    className={({ isActive }) =>
                      isActive ? activeClassName : baseClassName
                    }
                    onClick={handleDisappear}
                  >
                    <DisputeIcon />
                  </NavLink>
                </div>
              </li>

              <li className="d-flex align-items-center SideNavItem mb-5">
                <div className="me-3">
                  <NavLink
                    to="settings"
                    end
                    className={({ isActive }) =>
                      isActive ? activeClassName : baseClassName
                    }
                    onClick={handleDisappear}
                  >
                    <SettingsIcon />
                  </NavLink>
                </div>
              </li>
            </ul>

            <ul className="ps-3">
              <li className="d-flex align-items-center SideNavItem mt-5 position-fixed bottom">
                <div className="me-3">
                  <LogoutIcon />
                </div>
                <li
                  className="d-flex align-items-center SideNavItem mt-5 bottom position-fixed"
                  onClick={logoutHandler}
                  style={{ cursor: "pointer" }}
                >
                  <div className="me-3">
                    <LogoutIcon />
                  </div>
                </li>
              </li>
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const DesktopScreen = ({ name, ...props }) => {
  const activeClassName = "active-link";
  const baseClassName = "inactive-link";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTransactionOpen, setIsTransactionOpen] = useState(true);
  const [isDisputeOpen, setIsDisputeOpen] = useState(true);

  const logoutHandler = async () => {
    try {
      dispatch(logout());
      navigate("/");
    } catch (error) {
      // Optional: Add toast notification for error
      console.error("Logout failed:", error);
    }
  };

  const toggleTransaction = () => {
    setIsTransactionOpen(!isTransactionOpen);
  };

  const toggleDispute = () => {
    setIsDisputeOpen(!isDisputeOpen);
  };

  const renderTooltip = (props) => (
    <Tooltip id="logout-tooltip" {...props}>
      Sign out of your account
    </Tooltip>
  );

  return (
    <div
      className="d-none d-lg-flex flex-column vh-100 big-side-nav"
      style={{ width: '10rem', padding: '1.5rem' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo Section */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <Link to="/" aria-label="Home">
          <img
            src={doshlogo}
            alt="Dosh Logo"
            className="img-fluid"
            style={{ maxWidth: '8rem', transition: 'transform 0.3s ease' }}
          />
        </Link>
      </div>

      {/* Nav Links (Scrollable) */}
      <div className="flex-grow-1 overflow-auto">
        <ul className="ps-0 mb-0 list-unstyled">
          <li className="mb-3 SideNavItem">
            <NavLink
              to="/userdashboard"
              end
              className={({ isActive }) =>
                `d-flex align-items-center p-2 rounded ${isActive ? activeClassName : baseClassName}`
              }
              aria-label="Dashboards"
            >
              <DashboardIcon className="me-2" />
              <span className="fw-medium">Dashboards</span>
            </NavLink>
          </li>

           {/* Transaction Section (Collapsible) */}
          <li className="mb-3 SideNavItem">
          <button
              className="d-flex align-items-center p-2 rounded-3 w-100 bg-transparent border-0 text-start"
              onClick={toggleTransaction}
              aria-expanded={isTransactionOpen}
              aria-controls="transaction-collapse"
              aria-label="Toggle Transactions"
            >
             <TransactionSideNavIcon/>
              <span className="fw-medium text-secondary ms-2">Transactions</span>
              <i
                className={`bi bi-chevron-${isTransactionOpen ? 'up' : 'down'} ms-auto`}
              ></i>
            </button>
            <Collapse in={isTransactionOpen}>
              <ul id="transaction-collapse" className="list-unstyled mt-2 ps-3">
                <li className="mb-2">
                  <NavLink
                    to="transaction-history"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Transactions"
                  >
                    <AllTransactionIcon className="me-2" />
                    <span>All Transactions</span>
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Transactions in Progress"
                  >
                    <TransactionProgressIcon className="me-2" />
                    <span>In Progress</span>
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Settled Transactions"
                  >
                    <SettledTransactionIcon className="me-2" />
                    <span>Settled</span>
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="transaction-history/confirm-escrow-product-transaction/shipping-history"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Shipping Details"
                  >
                    <ShippingDetailsTransactionIcon className="me-2" />
                    <span>Shipping Details</span>
                  </NavLink>
                </li>
              </ul>
            </Collapse>
          </li>
          {/* other code here */}
          <li className="mb-3 SideNavItem">
            <NavLink
              to="notification"
              end
              className={({ isActive }) =>
                `d-flex align-items-center p-2 rounded ${isActive ? activeClassName : baseClassName}`
              }
              aria-label="Notifications"
            >
              <NotificationIcon className="me-2" />
              <span>Notifications</span>
            </NavLink>
          </li>

          {/* */}
           {/* Transaction Section (Collapsible) */}
          <li className="mb-3 SideNavItem">
          <button
              className="d-flex align-items-center p-2 rounded-3 w-100 bg-transparent border-0 text-start"
              onClick={toggleDispute}
              aria-expanded={isDisputeOpen}
              aria-controls="transaction-collapse"
              aria-label="Toggle Transactions"
            >
             <TransactionSideNavIcon/>
              <span className="fw-medium text-secondary ms-2">Disputes</span>
              <i
                className={`bi bi-chevron-${isDisputeOpen ? 'up' : 'down'} ms-auto`}
              ></i>
            </button>
            <Collapse in={isDisputeOpen}>
              <ul id="transaction-collapse" className="list-unstyled mt-2 ps-3">
                 <li className="mb-3 SideNavItem">
                    <NavLink
                      to="dispute"
                      end
                      className={({ isActive }) =>
                        `d-flex align-items-center p-2 rounded ${
                        isActive ? activeClassName : baseClassName
                      }`
                      }
                      aria-label="Disputes"
                    >
                      <DisputeIcon className="me-2" />
                      <span>All Disputes</span>
                </NavLink>
                </li> 
                 <li className="mb-2">
                  
                      <NavLink
                        to="./transaction-history/confirm-escrow-product-transaction/shipping-history/:transaction_id/initiate-dispute"
                        end
                        className={({ isActive }) =>
                          `d-flex align-items-center p-2 rounded ${isActive ? activeClassName : baseClassName}`
                        }
                        aria-label="Disputes"
                      >
                        <DisputeIcon className="me-2" />
                        <span>Initaite Dispute</span>
                  </NavLink>
                </li> 
                <li className="mb-2">
                  <NavLink
                    to="./ticket"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Transactions in Progress"
                  >
                    <TransactionProgressIcon className="me-2" />
                    <span>Tcket</span>
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="./open-conflicts"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Settled Transactions"
                  >
                    <SettledTransactionIcon className="me-2" />
                    <span>Open Conflicts</span>
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to=""
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Settled Transactions"
                  >
                    <SettledTransactionIcon className="me-2" />
                    <span>Settled</span>
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="transaction-history/confirm-escrow-product-transaction/shipping-history"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Shipping Details"
                  >
                    <ShippingDetailsTransactionIcon className="me-2" />
                    <span>Shipping Details</span>
                  </NavLink>
                </li>
              </ul>
            </Collapse>
          </li>
          {/* other code here */}
          <li className="mb-3 SideNavItem">
            <NavLink
              to="settings"
              end
              className={({ isActive }) =>
                `d-flex align-items-center p-2 rounded ${isActive ? activeClassName : baseClassName}`
              }
              aria-label="Settings"
            >
              <SettingsIcon className="me-2" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Logout Section */}
        <div className="pt-3 border-top mt-auto">
          <button
            className="d-flex align-items-center p-2 rounded bg-transparent border-0 w-100 logout-btn"
            onClick={logoutHandler}
            aria-label="Logout"
          >
            <div className="me-3 d-flex align-items-center">
              <LogoutIcon />
            </div>
            <span className={baseClassName}>Logout</span>
          </button>
        </div>

    </div>
    
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

export default UsersSideNav;
