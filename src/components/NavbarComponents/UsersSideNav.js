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
import { Collapse } from "react-bootstrap"; // For collapsible section
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons"; // Optional
import { AiOutlineClockCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import {
  FiHome,
  FiLayers,
  FiActivity,
  FiTruck,
  FiBell,
  FiAlertCircle,
  FiSettings,
  FiLogOut,
  FiArrowDown,
  FiArrowUp,
  FiFolder,
  FiRepeat,
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiArrowRightCircle 
} from "react-icons/fi";
import { FcCancel } from "react-icons/fc";
import { PiSealWarningDuotone } from "react-icons/pi";
import { GrInProgress } from "react-icons/gr";
import { LiaHandshake } from "react-icons/lia";

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


const MobileScreenSideNav = () => {
  const [show, setShow] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false); // For collapse
  const [isDisputeOpen, setIsDisputeOpen] = useState(false); // For disputes collapse
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow(!show);
  const toggleDispute = () => setIsDisputeOpen(!isDisputeOpen); // Toggle disputes

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };
   const offcanvasWidth = window.innerWidth <= 768 ? "80vw" : "300px";

    const offcanvasStyle = {
      width: offcanvasWidth,
      backgroundColor: "#fff",
      zIndex: 1055,
    };

    const backdropStyle = {
      position: "fixed",
      top: 0,
      left: offcanvasWidth, // align perfectly
      width: `calc(100vw - ${offcanvasWidth})`,
      height: "100vh",
      backdropFilter: "blur(1px)",
      backgroundColor: "rgba(0, 0, 0, 0.13)",
      zIndex: 1050,
      cursor: "pointer",
    };

  const navLinkStyle = (isActive) => ({
    textDecoration: "none",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    color: isActive ? "#198754" : "#212529",
    fontWeight: isActive ? "600" : "400",
  });

  // Define styles for dispute navigation items
  const activeClassName = "text-success fw-semibold";
  const baseClassName = "text-dark";

  // Tooltip render function (you might need to import this or define it)
  const renderTooltip = (text) => (
    <Tooltip id="tooltip">{text}</Tooltip>
  );

  return (
    <>
      {/* Hamburger toggle */}
      <Button
        onClick={toggleShow}
        className="bg-white border-0 d-lg-none position-fixed start-0 top-0 z-3"
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

      {/* Custom blur backdrop */}
      {show && <div style={backdropStyle} onClick={handleClose} />}

      {/* Offcanvas */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        backdrop={false}
        style={offcanvasStyle}
        className="d-lg-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src={doshlogo} alt="Logo" style={{ maxHeight: "40px", width:"70%" }} />
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          <ul className="list-unstyled px-2">

            {/* Dashboard */}
            <li className="mb-4">
              <NavLink
                to="/userdashboard"
                style={({ isActive }) => navLinkStyle(isActive)}
                onClick={handleClose}
                end
              >
                <span className="me-3"><DashboardIcon /></span>
                <span>Dashboard</span>
              </NavLink>
            </li>

            {/* All Transactions Collapse */}
             {/* Inside your component JSX: */}
              <li className="mb-3">
                <Button
                variant="link"
                className="d-flex align-items-center justify-content-between text-dark ps-0 w-100"
                style={{
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
                onClick={() => setShowTransaction(!showTransaction)}
                aria-controls="transaction-collapse"
                aria-expanded={showTransaction}
              >
                <div className="d-flex align-items-center">
                  <span className="me-3">< FiRepeat size={20}/></span>
                  <span className="fs-6">All Transactions</span>
                </div>
                <div>
                  {showTransaction ? <FiArrowUp size={18} /> : <FiArrowDown size={18} />}
                </div>
              </Button>
                <Collapse in={showTransaction}>
                  <div id="transaction-collapse" className="ps-4 mt-2">
                   <ul className="list-unstyled">
                    <li className="mb-3">
                      <NavLink
                        end
                        to="transaction-history"
                        className={({ isActive }) =>
                          isActive
                            ? "d-flex align-items-center text-success fw-semibold text-decoration-none"
                            : "d-flex align-items-center text-dark text-decoration-none"
                        }
                        onClick={handleClose}
                      >
                        <span className="me-2"><FiLayers  size={20} fill="#838894" /></span>
                        <span className="fs-6">Transactions</span>
                      </NavLink>
                    </li>
                    <li className="mb-3">
                      <NavLink
                        to="transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history"
                        className={({ isActive }) =>
                          isActive
                            ? "d-flex align-items-center text-success fw-semibold text-decoration-none"
                            : "d-flex align-items-center text-dark text-decoration-none"
                        }
                        onClick={handleClose}
                      >
                        <span className="me-2"><AiOutlineClockCircle size={20} fill="#838894" /></span>
                        <span className="fs-6">In Progress</span>
                      </NavLink>
                    </li>
                    <li className="mb-3">
                      <NavLink
                        to="transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
                        className={({ isActive }) =>
                          isActive
                            ? "d-flex align-items-center text-success fw-semibold text-decoration-none"
                            : "d-flex align-items-center text-dark text-decoration-none"
                        }
                        onClick={handleClose}
                      >
                        <span className="me-2"><AiOutlineCheckCircle size={20} fill="#838894" /></span>
                        <span className="fs-6">Settled</span>
                      </NavLink>
                    </li>
                    <li className="mb-3">
                      <NavLink
                        to="transaction-history/confirm-escrow-product-transaction/shipping-history"
                        className={({ isActive }) =>
                          isActive
                            ? "d-flex align-items-center text-success fw-semibold text-decoration-none"
                            : "d-flex align-items-center text-dark text-decoration-none"
                        }
                        onClick={handleClose}
                      >
                        <span className="me-2"><FaTruck size={20} fill="#838894" /></span>
                        <span className="fs-6">Shipping</span>
                      </NavLink>
                    </li>
                    {/* cancel transaction */}
                    <li className="mb-3">
                      <NavLink
                        to="transaction-history/cancelled-transactions"
                        className={({ isActive }) =>
                          isActive
                            ? "d-flex align-items-center text-success fw-semibold text-decoration-none"
                            : "d-flex align-items-center text-dark text-decoration-none"
                        }
                        onClick={handleClose}
                      >
                        <span className="me-2"><FcCancel  size={20} fill="#838894" /></span>
                        <span className="fs-6">Cancelled</span>
                      </NavLink>
                    </li> 
                    {/* cancel transaction end here */}
                  </ul>

                  </div>
                </Collapse>

              </li>

            {/* Notifications */}
            <li className="mb-3">
              <NavLink
                to="notification"
                style={({ isActive }) => navLinkStyle(isActive)}
                onClick={handleClose}
              >
                <span className="me-3"><FiBell size={20}  /></span>
                <span>Notifications</span>
              </NavLink>
            </li>

            {/* Disputes - Updated with expandable list */}
            <li className="mb-3"> 
              <OverlayTrigger placement="right" overlay={renderTooltip("Toggle Disputes")}>
                <Button
                  variant="link"
                  onClick={toggleDispute}
                  className="d-flex align-items-center text-decoration-none w-100 text-secondary gap-2 ps-0"
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  <span className="me-2"><FiAlertCircle size={20} /></span>  
                  <span className="fs-6">Disputes</span>
                  <span className={`ms-auto transition-transform`}>
                    {isDisputeOpen ? <FiArrowUp /> : <FiArrowDown />}
                  </span>
                </Button>
              </OverlayTrigger>
              <Collapse in={isDisputeOpen}>
                <ul className="list-unstyled ps-3 mt-2">
                  <li className="mb-2">
                    <NavLink
                      to="disputes"
                      end
                      className={({ isActive }) =>
                        `d-flex align-items-center p-2 rounded text-decoration-none ${
                          isActive ? activeClassName : baseClassName
                        }`
                      }
                      aria-label="Disputes"
                      onClick={handleClose}
                    >
                      <PiSealWarningDuotone className="me-2" size={20}  />
                      <span className="fs-6">All Disputes</span>
                    </NavLink>
                  </li>

                  <li className="mb-3 SideNavItem">
                    <NavLink
                      to="disputes/disputes-in-progress"
                      end
                      className={({ isActive }) =>
                        `d-flex align-items-center p-2 rounded text-decoration-none ${
                          isActive ? activeClassName : baseClassName
                        }`
                      }
                      onClick={handleClose}
                    >
                      <GrInProgress className="me-2" size={20} />
                      <span className="fs-6">In Progress</span>
                    </NavLink>
                  </li>

                  <li className="mb-3 SideNavItem">
                    <NavLink
                      to="disputes/completed-disputes"
                      end
                      className={({ isActive }) =>
                        `d-flex align-items-center p-2 rounded text-decoration-none ${
                          isActive ? activeClassName : baseClassName
                        }`
                      }
                      aria-label="Disputes"
                      onClick={handleClose}
                    >
                      <LiaHandshake className="me-2" size={25} fill="#838894" />
                      <span className="fs-6">Resolved</span>
                    </NavLink>
                  </li>

                  <li className="mb-2">
                    <NavLink
                       to="disputes/:transaction_id/initiate-dispute"
                      className={({ isActive }) =>
                        `d-flex align-items-center p-2 rounded gap-2 text-decoration-none ${isActive ? activeClassName : baseClassName}`
                      }
                      onClick={handleClose}
                    >
                       <FiArrowRightCircle size={20}  /> <span className="fs-6">Initiate Dispute</span>
                    </NavLink>
                  </li> 
                </ul>
              </Collapse>
            </li>
            

            {/* Settings */}
            <li className="mb-4">
              <NavLink
                to="settings"
                style={({ isActive }) => navLinkStyle(isActive)}
                onClick={handleClose}
              >
                <span className="me-3"><SettingsIcon /></span>
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>

          {/* Logout */}
          <div className="px-3">
            <Button
              onClick={logoutHandler}
              variant="outline-danger"
              className="w-100 d-flex align-items-center justify-content-center"
            >
              <FiLogOut /> <span className="ms-1">Logout</span>
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};


const DesktopScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTransactionOpen, setIsTransactionOpen] = useState(true);
  const [isDisputeOpen, setIsDisputeOpen] = useState(true);

  const activeClassName = "bg-success text-white fw-bold text-decoration-none";
  const baseClassName = "text-secondary text-decoration-none";

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleTransaction = () => setIsTransactionOpen(!isTransactionOpen);
  const toggleDispute = () => setIsDisputeOpen(!isDisputeOpen);

  const renderTooltip = (text) => (props) => <Tooltip {...props}>{text}</Tooltip>;

  return (
    <div
          className="d-none d-lg-flex flex-column vh-100 big-side-nav"
      style={{ width: "10rem", padding: "1.5rem" }}
    >
      <div className="text-center mb-4">
        <Link to="/">
          <img src={doshlogo} alt="Dosh Logo" className="img-fluid" style={{ maxWidth: "9rem" }} />
        </Link>
      </div>

      <div className="flex-grow-1 overflow-auto">
        <ul className="list-unstyled">
          <li className="mb-2">
            <NavLink
              to="/userdashboard"
              end
              className={({ isActive }) =>
                `d-flex align-items-center p-2 rounded gap-2 ${isActive ? activeClassName : baseClassName}`
              }
            >
              <FiHome /> <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <OverlayTrigger placement="right" overlay={renderTooltip("Toggle Transactions")}>
              <Button
                variant="link"
                onClick={toggleTransaction}
                className="d-flex align-items-center text-decoration-none w-100 text-secondary gap-2"
              >
                <FiRepeat />
                <span>Transactions</span>
                <span className={`ms-auto transition-transform`}>
                  {isTransactionOpen ? <FiArrowUp /> : <FiArrowDown />}
                </span>
              </Button>
            </OverlayTrigger>
            <Collapse in={isTransactionOpen}>
              <ul className="list-unstyled ps-3 mt-2">
                <li className="mb-2">
                  <NavLink
                    to="transaction-history"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded gap-2 ${isActive ? activeClassName : baseClassName}`
                    }
                  >
                    <FiLayers /> <span>All Transactions</span>
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history"
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded gap-2 ${isActive ? activeClassName : baseClassName}`
                    }
                  >
                    <FiClock /> <span>In Progress</span>
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded gap-2 ${isActive ? activeClassName : baseClassName}`
                    }
                  >
                    <FiCheckCircle /> <span>Settled</span>
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="transaction-history/cancelled-transactions"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Cancelled Transactions"
                  >

                    <FcCancel className="me-2" />
                    <span>Cancelled</span>
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="transaction-history/confirm-escrow-product-transaction/shipping-history"
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded gap-2 ${isActive ? activeClassName : baseClassName}`
                    }
                  >
                    <FiTruck /> <span>Shipping</span>
                  </NavLink>
                </li>
              </ul>
            </Collapse>
          </li>

          <li className="mb-2">
            <NavLink
              to="notification"
              className={({ isActive }) =>
                `d-flex align-items-center p-2 rounded gap-2 ${isActive ? activeClassName : baseClassName}`
              }
            >
              <FiBell /> <span>Notifications</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <OverlayTrigger placement="right" overlay={renderTooltip("Toggle Disputes")}>
              <Button
                variant="link"
                onClick={toggleDispute}
                className="d-flex align-items-center text-decoration-none w-100 text-secondary gap-2"
              >
                <FiAlertCircle  />
                <span>Disputes</span>
                <span className={`ms-auto transition-transform`}>
                  {isDisputeOpen ? <FiArrowUp /> : <FiArrowDown />}
                </span>
              </Button>
            </OverlayTrigger>
            <Collapse in={isDisputeOpen}>
              <ul className="list-unstyled ps-3 mt-2">
                <li className="mb-2">
                  <NavLink
                    to="disputes"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Disputes"
                  >
                    <PiSealWarningDuotone className="me-2" />
                    <span>All Disputes</span>
                  </NavLink>
                </li>

                <li className="mb-3 SideNavItem">
                  <NavLink
                    to="disputes/disputes-in-progress"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                  >
                    <GrInProgress className="me-2" />
                    <span>In Progress</span>
                  </NavLink>
                </li>

                <li className="mb-3 SideNavItem">
                  <NavLink
                    to="disputes/completed-disputes"
                    end
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded ${
                        isActive ? activeClassName : baseClassName
                      }`
                    }
                    aria-label="Disputes"
                  >
                    <LiaHandshake className="me-2" />
                    <span>Resolved</span>
                  </NavLink>
                </li>

                <li className="mb-2">
                  <NavLink
                     to="disputes/:transaction_id/initiate-dispute"
                    className={({ isActive }) =>
                      `d-flex align-items-center p-2 rounded gap-2 ${isActive ? activeClassName : baseClassName}`
                    }
                  >
                     <FiArrowRightCircle /> <span>Initiate Dispute</span>
                  </NavLink>
                </li> 
              </ul>
            </Collapse>
          </li>

          <li className="mb-2">
            <NavLink
              to="settings"
              className={({ isActive }) =>
                `d-flex align-items-center p-2 rounded gap-2 ${isActive ? activeClassName : baseClassName}`
              }
            >
              <FiSettings /> <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="pt-3 border-top">
        <OverlayTrigger placement="right" overlay={renderTooltip("Logout")}>
          <Button
            onClick={logoutHandler}
            className="w-100 d-flex align-items-center justify-content-center text-danger border border-danger bg-white fw-semibold gap-2"
          >
            <FiLogOut /> <span>Logout</span>
          </Button>
        </OverlayTrigger>
      </div>
    </div>
  );
};

// const DesktopScreen = ({ name, ...props }) => {
//   const activeClassName = "active-link";
//   const baseClassName = "inactive-link";
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isTransactionOpen, setIsTransactionOpen] = useState(true);
//   const [isDisputeOpen, setIsDisputeOpen] = useState(true);

//   const logoutHandler = async () => {
//     try {
//       dispatch(logout());
//       navigate("/");
//     } catch (error) {
//       // Optional: Add toast notification for error
//       console.error("Logout failed:", error);
//     }
//   };

//   const toggleTransaction = () => {
//     setIsTransactionOpen(!isTransactionOpen);
//   };

//   const toggleDispute = () => {
//     setIsDisputeOpen(!isDisputeOpen);
//   };

//   const renderTooltip = (props) => (
//     <Tooltip id="logout-tooltip" {...props}>
//       Sign out of your account
//     </Tooltip>
//   );

//   return (
//     <div
//       className="d-none d-lg-flex flex-column vh-100 big-side-nav"
//       style={{ width: "10rem", padding: "1.5rem" }}
//       role="navigation"
//       aria-label="Main navigation"
//     >
//       {/* Logo Section */}
//       <div className="d-flex justify-content-center align-items-center mb-4">
//         <Link to="/" aria-label="Home">
//           <img
//             src={doshlogo}
//             alt="Dosh Logo"
//             className="img-fluid"
//             style={{ maxWidth: "8rem", transition: "transform 0.3s ease" }}
//           />
//         </Link>
//       </div>

//       {/* Nav Links (Scrollable) */}
//       <div className="flex-grow-1 overflow-auto">
//         <ul className="ps-0 mb-0 list-unstyled">
//           <li className="mb-3 SideNavItem">
//             <NavLink
//               to="/userdashboard"
//               end
//               className={({ isActive }) =>
//                 `d-flex align-items-center p-2 rounded ${
//                   isActive ? activeClassName : baseClassName
//                 }`
//               }
//               aria-label="Dashboards"
//             >
//               <DashboardIcon className="me-2" />
//               <span className="fw-medium">Dashboards</span>
//             </NavLink>
//           </li>

//           {/* Transaction Section (Collapsible) */}
//           <li className="mb-3 SideNavItem">
//             <button
//               className="d-flex align-items-center p-2 rounded-3 w-100 bg-transparent border-0 text-start"
//               onClick={toggleTransaction}
//               aria-expanded={isTransactionOpen}
//               aria-controls="transaction-collapse"
//               aria-label="Toggle Transactions"
//             >
//               <TransactionSideNavIcon />
//               <span className="fw-medium text-secondary ms-2">
//                 Transactions
//               </span>
//               <i
//                 className={`bi bi-chevron-${
//                   isTransactionOpen ? "up" : "down"
//                 } ms-auto`}
//               ></i>
//             </button>
//             <Collapse in={isTransactionOpen}>
//               <ul id="transaction-collapse" className="list-unstyled mt-2 ps-3">
//                 <li className="mb-2">
//                   <NavLink
//                     to="transaction-history"
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Transactions"
//                   >
//                     <AllTransactionIcon className="me-2" />
//                     <span>All Transactions</span>
//                   </NavLink>
//                 </li>
//                 <li className="mb-2">
//                   <NavLink
//                     to="transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history"
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Transactions in Progress"
//                   >
//                     <TransactionProgressIcon className="me-2" />
//                     <span>In Progress</span>
//                   </NavLink>
//                 </li>
//                 <li className="mb-2">
//                   <NavLink
//                     to="transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Settled Transactions"
//                   >
//                     <SettledTransactionIcon className="me-2" />
//                     <span>Settled Transaction</span>
//                   </NavLink>
//                 </li>
//                 <li className="mb-2">
//                   <NavLink
//                     to="transaction-history/confirm-escrow-product-transaction/shipping-history"
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Shipping Details"
//                   >
//                     <ShippingDetailsTransactionIcon className="me-2" />
//                     <span>Shipping Details</span>
//                   </NavLink>
//                 </li>
//               </ul>
//             </Collapse>
//           </li>
//           {/* other code here */}
//           <li className="mb-3 SideNavItem">
//             <NavLink
//               to="notification"
//               end
//               className={({ isActive }) =>
//                 `d-flex align-items-center p-2 rounded ${
//                   isActive ? activeClassName : baseClassName
//                 }`
//               }
//               aria-label="Notifications"
//             >
//               <NotificationIcon className="me-2 " />
//               <span>Notifications</span>
//             </NavLink>
//           </li>

//           {/* */}
//           {/* Dispute Section (Collapsible) */}
//           <li className="mb-3 SideNavItem">
//             <button
//               className="d-flex align-items-center p-2 rounded-3 w-100 bg-transparent border-0 text-start"
//               onClick={toggleDispute}
//               aria-expanded={isDisputeOpen}
//               aria-controls="transaction-collapse"
//               aria-label="Toggle Transactions"
//             >
//               <TransactionSideNavIcon />
//               <span className="fw-medium text-secondary ms-2">Disputes</span>
//               <i
//                 className={`bi bi-chevron-${
//                   isDisputeOpen ? "up" : "down"
//                 } ms-auto`}
//               ></i>
//             </button>
//             <Collapse in={isDisputeOpen}>
//               <ul id="transaction-collapse" className="list-unstyled mt-2 ps-3">
//                 <li className="mb-3 SideNavItem">
//                   <NavLink
//                     to="disputes"
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Disputes"
//                   >
//                     <DisputeIcon className="me-2" />
//                     <span>All Disputes</span>
//                   </NavLink>
//                 </li>

//                 <li className="mb-3 SideNavItem">
//                   <NavLink
//                     to="disputes-in-progress"
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Disputes"
//                   >
//                     <DisputeIcon className="me-2" />
//                     <span>Disputes In Progress</span>
//                   </NavLink>
//                 </li>

//                 <li className="mb-3 SideNavItem">
//                   <NavLink
//                     to="completed-disputes"
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Disputes"
//                   >
//                     <DisputeIcon className="me-2" />
//                     <span>Resolved Disputes</span>
//                   </NavLink>
//                 </li>

//                 <li className="mb-2">
//                   <NavLink
//                     to="./ticket"
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Transactions in Progress"
//                   >
//                     <TransactionProgressIcon className="me-2" />
//                     <span>Ticket</span>
//                   </NavLink>
//                 </li>
//                 <li className="mb-2">
//                   <NavLink
//                     to="./open-conflicts"
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Settled Transactions"
//                   >
//                     <SettledTransactionIcon className="me-2" />
//                     <span>Open Conflicts</span>
//                   </NavLink>
//                 </li>
//                 <li className="mb-2">
//                   <NavLink
//                     to=""
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Settled Transactions"
//                   >
//                     <SettledTransactionIcon className="me-2" />
//                     <span>Settled</span>
//                   </NavLink>
//                 </li>
//                 {/* <li className="mb-2">
//                   <NavLink
//                     to="transaction-history/confirm-escrow-product-transaction/shipping-history"
//                     end
//                     className={({ isActive }) =>
//                       `d-flex align-items-center p-2 rounded-3 text-decoration-none ${
//                         isActive ? activeClassName : baseClassName
//                       }`
//                     }
//                     aria-label="Shipping Details"
//                   >
//                     <ShippingDetailsTransactionIcon className="me-2" />
//                     <span>All Disputes</span>
//                   </NavLink>
//                 </li> */}
//               </ul>
//             </Collapse>
//           </li>
//           {/* other code here */}
//           <li className="mb-3 SideNavItem">
//             <NavLink
//               to="settings"
//               end
//               className={({ isActive }) =>
//                 `d-flex align-items-center p-2 rounded ${
//                   isActive ? activeClassName : baseClassName
//                 }`
//               }
//               aria-label="Settings"
//             >
//               <SettingsIcon className="me-2" />
//               <span>Settings</span>
//             </NavLink>
//           </li>
//         </ul>
//       </div>

//       {/* Logout Section */}
//       <div className="pt-3 border-top mt-auto">
//         <button
//           className="d-flex align-items-center p-2 rounded bg-transparent border-0 w-100 logout-btn"
//           onClick={logoutHandler}
//           aria-label="Logout"
//         >
//           <div className="me-3 d-flex align-items-center">
//             <LogoutIcon />
//           </div>
//           <span className={baseClassName}>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

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
