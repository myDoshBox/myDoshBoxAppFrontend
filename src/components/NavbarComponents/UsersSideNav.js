import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  ChatIcon,
  DashboardIcon,
  DisputeIcon,
  LogoutIcon,
  NavTransactionIcon,
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

              {/* <li className="d-flex align-items-center SideNavItem mb-5">
                <div className="me-3">
                  <ChatIcon />
                </div>
                <span className="my-1">Chats</span>
              </li> */}
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
  let activeClassName = "active-link";
  let baseClassName = "inactive-link";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const nav = () => {
  //   navigate("/");
  // };

  // const { userInfo } = useSelector((state) => state.usersauth);
  // const [logout] = useLogoutMutation();
  // console.log(logout());

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
      <div className="d-none d-lg-block big-side-nav shadow">
        <Link to="/">
          <img src={doshlogo} alt="logo" className="mb-5 w-50" />
        </Link>

        <div className="d-flex justify-content-between flex-column">
          <ul className="ps-2">
            <li className="d-flex mb-5 align-items-center SideNavItem">
              <div>
                <NavLink
                  to="../../userdashboard"
                  end
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <DashboardIcon />
                  <span>Dashboards</span>
                </NavLink>
              </div>
            </li>

            <li className="d-flex mb-5 align-items-center SideNavItem">
              <div>
                <NavLink
                  to="transaction-history"
                  end
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <NavTransactionIcon />
                  <span>Transactions</span>
                </NavLink>
              </div>
            </li>

            <li className="d-flex mb-5 align-items-center SideNavItem">
              <div>
                <NavLink
                  to="transaction-history/confirm-escrow-product-transaction/transactions-in-progress-history"
                  end
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <NavTransactionIcon />
                  <span>Transactions in Progress</span>
                </NavLink>
              </div>
            </li>

            <li className="d-flex mb-5 align-items-center SideNavItem">
              <div>
                <NavLink
                  to="transaction-history/confirm-escrow-product-transaction/settled-transactions-history"
                  end
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <NavTransactionIcon />
                  <span>Settled Transactions</span>
                </NavLink>
              </div>
            </li>

            <li className="d-flex mb-5 align-items-center SideNavItem">
              <div>
                <NavLink
                  to="transaction-history/confirm-escrow-product-transaction/shipping-history"
                  end
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <NavTransactionIcon />
                  <span>Shipping Details</span>
                </NavLink>
              </div>
            </li>

            {/* <li className="d-flex align-items-center SideNavItem mb-5">
              <div className="me-3">
                <ChatIcon />
              </div>
              <span className="my-1">Chats</span>
            </li> */}
            <li className="d-flex align-items-center SideNavItem mb-5">
              <div className="me-3">
                <NavLink
                  to="notification"
                  end
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <NotificationIcon />
                  <span>Notifications</span>
                </NavLink>
              </div>
            </li>

            <li className="d-flex  align-items-center SideNavItem mb-5">
              <div>
                <NavLink
                  to="dispute"
                  end
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <DisputeIcon />
                  <span>Disputes</span>
                </NavLink>
              </div>
            </li>

            <li className="d-flex align-items-center SideNavItem mb-5">
              <div>
                <NavLink
                  to="settings"
                  end
                  className={({ isActive }) =>
                    isActive ? activeClassName : baseClassName
                  }
                >
                  <SettingsIcon />

                  <span>Settings</span>
                </NavLink>
              </div>
            </li>
          </ul>
          <ul className="ps-3">
            <li
              className="d-flex align-items-center SideNavItem mt-5 bottom position-fixed"
              // onClick={nav}
              style={{ cursor: "pointer" }}
            >
              <div className="me-3">
                <LogoutIcon />
              </div>
              <span className="inactive-link" onClick={logoutHandler}>
                Logout
              </span>
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

export default UsersSideNav;
