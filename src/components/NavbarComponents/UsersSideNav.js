import React, { useState } from "react";
import {
  Button,
  Offcanvas,
  Collapse,
  Tooltip,
  OverlayTrigger,
  Container,
} from "react-bootstrap";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlices/allUsersAuthSlice";
import {
  FiHome,
  FiLayers,
  FiTruck,
  FiBell,
  FiAlertCircle,
  FiSettings,
  FiLogOut,
  FiArrowDown,
  FiArrowUp,
  FiRepeat,
} from "react-icons/fi";
import { FcCancel } from "react-icons/fc";
import { PiSealWarningDuotone } from "react-icons/pi";
import { GrInProgress } from "react-icons/gr";
import { LiaHandshake } from "react-icons/lia";
import { AiOutlineClockCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import doshlogo from "../../images/NewDoshLogo.png";

const UsersSideNav = () => {
  return (
    <>
      <MobileSideNav />
      <div className="d-flex min-vh-100">
        <DesktopSideNav />
        {/* Main Content Area - Tight spacing */}
        <main className="flex-grow-1 bg-light" style={{ minHeight: "100vh" }}>
          <div className="content-wrapper" style={{ padding: 0 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

// ==================== NAVIGATION CONFIGURATION ====================
const navigationConfig = {
  main: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FiHome size={18} />,
      path: "/userdashboard",
      end: true,
    },
  ],
  transactions: {
    label: "Transactions",
    icon: <FiRepeat size={18} />,
    items: [
      {
        id: "all-transactions",
        label: "All Transactions",
        icon: <FiLayers size={18} />,
        path: "transaction-history",
        end: true,
      },
      {
        id: "in-progress",
        label: "In Progress",
        icon: <AiOutlineClockCircle size={18} />,
        path: "transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history",
      },
      {
        id: "settled",
        label: "Settled",
        icon: <AiOutlineCheckCircle size={18} />,
        path: "transaction-history/confirm-escrow-product-transaction/settled-transactions-history",
      },
      {
        id: "cancelled",
        label: "Cancelled",
        icon: <FcCancel size={18} />,
        path: "transaction-history/cancelled-transactions",
      },
      {
        id: "shipping",
        label: "Shipping",
        icon: <FaTruck size={18} />,
        path: "transaction-history/confirm-escrow-product-transaction/shipping-history",
      },
    ],
  },
  notifications: {
    id: "notifications",
    label: "Notifications",
    icon: <FiBell size={18} />,
    path: "notification",
  },
  disputes: {
    label: "Disputes",
    icon: <FiAlertCircle size={18} />,
    items: [
      {
        id: "all-disputes",
        label: "All Disputes",
        icon: <PiSealWarningDuotone size={18} />,
        path: "disputes",
        end: true,
      },
      {
        id: "disputes-progress",
        label: "In Progress",
        icon: <GrInProgress size={18} />,
        path: "disputes/disputes-in-progress",
      },
      {
        id: "resolved",
        label: "Resolved",
        icon: <LiaHandshake size={20} />,
        path: "disputes/completed-disputes",
      },
      {
        id: "cancelled-disputes",
        label: "Cancelled",
        icon: <FcCancel size={18} />,
        path: "disputes/cancelled-disputes",
      },
    ],
  },
  settings: {
    id: "settings",
    label: "Settings",
    icon: <FiSettings size={18} />,
    path: "settings",
  },
};

// ==================== SHARED COMPONENTS ====================

// Navigation Item Component
const NavItem = ({ item, onClick, isMobile = false }) => {
  const baseClass = isMobile
    ? "d-flex align-items-center text-decoration-none py-2 px-2 rounded transition"
    : "d-flex align-items-center text-decoration-none p-2 rounded gap-2 transition";

  const activeClass = isMobile
    ? "text-success fw-semibold bg-success bg-opacity-10"
    : "bg-success text-white fw-semibold";

  const inactiveClass = "text-dark";

  return (
    <NavLink
      to={item.path}
      end={item.end}
      className={({ isActive }) =>
        `${baseClass} ${isActive ? activeClass : inactiveClass}`
      }
      style={{
        transition: "all 0.2s ease",
        fontSize: "0.875rem",
      }}
      onClick={onClick}>
      <span className={isMobile ? "me-2" : ""}>{item.icon}</span>
      <span>{item.label}</span>
    </NavLink>
  );
};

// Collapsible Section Component
const CollapsibleSection = ({
  config,
  isOpen,
  onToggle,
  onItemClick,
  isMobile = false,
}) => {
  const buttonClass = isMobile
    ? "d-flex align-items-center justify-content-between text-dark ps-0 w-100 text-decoration-none bg-transparent border-0 py-2"
    : "d-flex align-items-center text-decoration-none w-100 text-secondary gap-2 ps-0 bg-transparent border-0 py-2";

  return (
    <>
      <Button
        variant="link"
        className={buttonClass}
        style={{
          fontSize: "0.9rem",
          fontWeight: "500",
          transition: "all 0.2s ease",
        }}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`Toggle ${config.label}`}>
        <div className="d-flex align-items-center gap-2">
          {config.icon}
          <span>{config.label}</span>
        </div>
        <span className="ms-auto transition">
          {isOpen ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
        </span>
      </Button>
      <Collapse in={isOpen}>
        <ul className="list-unstyled ps-3 mt-1">
          {config.items.map((item) => (
            <li key={item.id} className="mb-1">
              <NavItem item={item} onClick={onItemClick} isMobile={isMobile} />
            </li>
          ))}
        </ul>
      </Collapse>
    </>
  );
};

// ==================== MOBILE SIDE NAVIGATION ====================
const MobileSideNav = () => {
  const [show, setShow] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [showDisputes, setShowDisputes] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow(!show);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
    handleClose();
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <Button
        onClick={toggleShow}
        className="bg-white border-0 d-lg-none position-fixed start-0 top-0 m-2 shadow-sm rounded-1"
        style={{
          zIndex: 1056,
          padding: "6px 10px",
        }}
        aria-label="Toggle navigation menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12H21M3 6H21M3 18H15"
            stroke="#006747"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </Button>

      {/* Offcanvas Sidebar */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        style={{
          width: "280px",
          backgroundColor: "#fff",
        }}
        className="d-lg-none"
        aria-labelledby="mobile-nav-title">
        <Offcanvas.Header closeButton className="border-bottom py-2">
          <Offcanvas.Title id="mobile-nav-title">
            <img
              src={doshlogo}
              alt="DoshBox Logo"
              style={{
                height: "30px",
                width: "auto",
              }}
            />
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column p-2">
          {/* Navigation Menu */}
          <nav className="flex-grow-1 overflow-auto">
            <ul className="list-unstyled mb-0">
              {/* Dashboard */}
              {navigationConfig.main.map((item) => (
                <li key={item.id} className="mb-1">
                  <NavItem item={item} onClick={handleClose} isMobile />
                </li>
              ))}

              {/* Transactions Section */}
              <li className="mb-1">
                <CollapsibleSection
                  config={navigationConfig.transactions}
                  isOpen={showTransaction}
                  onToggle={() => setShowTransaction(!showTransaction)}
                  onItemClick={handleClose}
                  isMobile
                />
              </li>

              {/* Notifications */}
              <li className="mb-1">
                <NavItem
                  item={navigationConfig.notifications}
                  onClick={handleClose}
                  isMobile
                />
              </li>

              {/* Disputes Section */}
              <li className="mb-1">
                <CollapsibleSection
                  config={navigationConfig.disputes}
                  isOpen={showDisputes}
                  onToggle={() => setShowDisputes(!showDisputes)}
                  onItemClick={handleClose}
                  isMobile
                />
              </li>

              {/* Settings */}
              <li className="mb-1">
                <NavItem
                  item={navigationConfig.settings}
                  onClick={handleClose}
                  isMobile
                />
              </li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-2 border-top">
            <Button
              onClick={logoutHandler}
              variant="outline-danger"
              className="w-100 d-flex align-items-center justify-content-center gap-2 py-1"
              style={{ fontSize: "0.875rem" }}
              aria-label="Logout">
              <FiLogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

// ==================== DESKTOP SIDE NAVIGATION ====================
const DesktopSideNav = () => {
  const [showTransaction, setShowTransaction] = useState(true);
  const [showDisputes, setShowDisputes] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  const renderTooltip = (text) => (props) =>
    <Tooltip {...props}>{text}</Tooltip>;

  return (
    <aside
      className="d-none d-lg-flex flex-column bg-white border-end"
      style={{
        width: "250px",
        minWidth: "250px",
        height: "100vh",
        padding: "0.75rem 1rem",
        position: "sticky",
        top: 0,
        left: 0,
        overflowY: "auto",
        flexShrink: 0,
      }}
      role="navigation"
      aria-label="Main navigation">
      {/* Logo Section */}
      <div className="text-center mb-3 pb-2 border-bottom">
        <Link to="/" aria-label="Go to homepage" className="d-inline-block">
          <img
            src={doshlogo}
            alt="DoshBox Logo"
            style={{
              height: "35px",
              width: "auto",
            }}
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow-1 overflow-auto">
        <ul className="list-unstyled mb-0">
          {/* Dashboard */}
          {navigationConfig.main.map((item) => (
            <li key={item.id} className="mb-1">
              <NavItem item={item} />
            </li>
          ))}

          {/* Transactions Section */}
          <li className="mb-1">
            <CollapsibleSection
              config={navigationConfig.transactions}
              isOpen={showTransaction}
              onToggle={() => setShowTransaction(!showTransaction)}
            />
          </li>

          {/* Notifications */}
          <li className="mb-1">
            <NavItem item={navigationConfig.notifications} />
          </li>

          {/* Disputes Section */}
          <li className="mb-1">
            <CollapsibleSection
              config={navigationConfig.disputes}
              isOpen={showDisputes}
              onToggle={() => setShowDisputes(!showDisputes)}
            />
          </li>

          {/* Settings */}
          <li className="mb-1">
            <NavItem item={navigationConfig.settings} />
          </li>
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="pt-2 border-top mt-auto">
        <OverlayTrigger
          placement="right"
          overlay={renderTooltip("Sign out of your account")}>
          <Button
            onClick={logoutHandler}
            className="w-100 d-flex align-items-center justify-content-center gap-2 text-danger border-danger bg-white fw-semibold py-1"
            style={{
              transition: "all 0.2s ease",
              fontSize: "0.875rem",
            }}
            aria-label="Logout"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#dc3545";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.color = "#dc3545";
            }}>
            <FiLogOut size={16} />
            <span>Logout</span>
          </Button>
        </OverlayTrigger>
      </div>
    </aside>
  );
};

export default UsersSideNav;
