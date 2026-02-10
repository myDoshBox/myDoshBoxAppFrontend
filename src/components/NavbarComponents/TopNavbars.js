// import {
//   Nav,
//   Navbar,
//   Container,
//   Form,
//   Row,
//   Col,
//   Dropdown,
// } from "react-bootstrap";
// import logo from "../../images/Homepage Img/logo.png";
// import image from "../../images/Image.jpg";
// import { Link, Outlet } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useRef } from "react";
// import { HomePageSignUpBtn } from "../ButtonsComponent/AuthenticationButtons";
// import { logout } from "../../redux/slices/userSlices/allUsersAuthSlice";
// import { clearProfileInfo } from "../../redux/slices/profileSlice/profileAuthslice";
// import { useLogoutMutation } from "../../redux/slices/userSlices/allUsersAPISlice";
// import { usersAPISlice } from "../../redux/slices/userSlices/allUsersAPISlice";
// import { profileAPISlice } from "../../redux/slices/profileSlice/profileAPISlice";
// import { escrowProductsAPISlice } from "../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
// import { disputeAPISlice } from "../../redux/slices/disputeSlices/disputeAPISlice";
// import { paymentAPISlice } from "../../redux/slices/paymentSlices/paymentAPISlice";
// import { persistor } from "../../redux/store";

// export const GuestNavbar = () => {
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const disappearEl = useRef(null);
//   const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

//   const handleDisappear = () => {
//     if (disappearEl.current) {
//       disappearEl.current.style.display = "none";
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       // 1. Call API logout
//       await logoutApi().unwrap();
//     } catch (error) {
//       console.error("Logout API error:", error);
//       // Continue with logout even if API fails
//     } finally {
//       // 2. Reset all RTK Query caches
//       dispatch(usersAPISlice.util.resetApiState());
//       dispatch(profileAPISlice.util.resetApiState());
//       dispatch(escrowProductsAPISlice.util.resetApiState());
//       dispatch(disputeAPISlice.util.resetApiState());
//       dispatch(paymentAPISlice.util.resetApiState());

//       dispatch(clearProfileInfo());

//       dispatch(logout());

//       await persistor.purge();

//       localStorage.clear();
//       sessionStorage.clear();

//       navigate("/", { replace: true });

//       setTimeout(() => {
//         window.location.reload();
//       }, 100);
//     }
//   };

//   return (
//     <>
//       <Navbar expand="lg" className="guest-nav sticky-top bg-white mb-2">
//         <Navbar.Toggle
//           aria-controls="basic-navbar-nav"
//           className="hamburgerIcon"
//         >
//           <svg
//             width="30"
//             height="20"
//             viewBox="0 0 30 20"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M0 8.33333H22.5V11.6667H0V8.33333ZM0 0H30V3.33333H0V0ZM0 20H13.5656V16.6667H0V20Z"
//               fill="#006747"
//             />
//           </svg>
//         </Navbar.Toggle>
//         <Navbar.Brand>
//           <Link to="/">
//             <img src={logo} alt="logo" className="my-auto" />
//           </Link>
//         </Navbar.Brand>
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto nav-text" ref={disappearEl}>
//             <Link
//               to="/"
//               className="nav-link nav-links"
//               onClick={handleDisappear}
//             >
//               Home
//             </Link>
//             <Link
//               to="/aboutus"
//               className="nav-link nav-links"
//               onClick={handleDisappear}
//             >
//               About Us
//             </Link>
//             <Link
//               to="/pricingpage"
//               className="nav-link nav-links"
//               onClick={handleDisappear}
//             >
//               Pricing
//             </Link>
//             <Link
//               to="/faqs"
//               className="nav-link nav-links"
//               onClick={handleDisappear}
//             >
//               FAQs
//             </Link>
//             <Link
//               to="/contactus"
//               className="nav-link nav-links"
//               onClick={handleDisappear}
//             >
//               Contact Us
//             </Link>

//             {/* Conditional rendering based on auth state */}
//             {userInfo ? (
//               <>
//                 <Link
//                   to="/userdashboard"
//                   className="nav-link nav-links"
//                   onClick={handleDisappear}
//                 >
//                   Dashboard
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   disabled={isLoggingOut}
//                   className="nav-links nav-btn btn btn-outline-success ms-2"
//                 >
//                   {isLoggingOut ? "Logging out..." : "Logout"}
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/signin"
//                   className="nav-link nav-links"
//                   onClick={handleDisappear}
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="nav-links nav-btn"
//                   onClick={handleDisappear}
//                 >
//                   <HomePageSignUpBtn />
//                 </Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Navbar>
//       <Outlet />
//     </>
//   );
// };

// // Truncate function: Show first 17 characters, then add "..."
// const truncateEmailAfter17 = (email, maxLength = 17) => {
//   if (!email) return "";
//   return email.length > maxLength ? email.slice(0, maxLength) + "..." : email;
// };

// export const UserDashboardNavbar = () => {
//   const { userInfo } = useSelector((state) => state.usersauth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { profileInfo } = useSelector((state) => state.profileAuth);
//   const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

//   const profileImage = profileInfo?.image;
//   const userEmail = userInfo?.email || userInfo?.organization_email || "";
//   const userPhone = userInfo?.phone_number || userInfo?.contact_number || "";
//   const userImage =
//     userInfo?.picture && userInfo.picture.trim() !== ""
//       ? userInfo.picture
//       : null;

//   const getProfileImage = () => {
//     // Priority order: userImage > profileImage > defaultImage
//     if (userImage) return userImage;
//     if (profileImage) return profileImage;
//     return image; // default fallback image
//   };

//   const logoutHandler = async () => {
//     try {
//       // 1. Call API logout
//       await logoutApi().unwrap();
//     } catch (error) {
//       console.error("Logout API error:", error);
//       // Continue with logout even if API fails
//     } finally {
//       // 2. Reset all RTK Query caches
//       dispatch(usersAPISlice.util.resetApiState());
//       dispatch(profileAPISlice.util.resetApiState());
//       dispatch(escrowProductsAPISlice.util.resetApiState());
//       dispatch(disputeAPISlice.util.resetApiState());
//       dispatch(paymentAPISlice.util.resetApiState());

//       // 3. Clear profile info
//       dispatch(clearProfileInfo());

//       // 4. Dispatch logout (this triggers store reset via rootReducer)
//       dispatch(logout());

//       // 5. Purge redux-persist cache
//       await persistor.purge();

//       // 6. Clear all storage
//       localStorage.clear();
//       sessionStorage.clear();

//       // 7. Navigate to home
//       navigate("/", { replace: true });

//       // 8. Reload page to ensure clean slate
//       setTimeout(() => {
//         window.location.reload();
//       }, 100);
//     }
//   };

//   return (
//     <Container fluid className="mt-5">
//       <Row className="align-items-center">
//         {/* Search Form - Always on the left on md+ */}
//         <Col xs={12} md={8} className="mb-3 mb-md-0">
//           <Form>
//             <Form.Control
//               type="text"
//               placeholder="Search"
//               className="w-100 border"
//               style={{ minWidth: "100%" }}
//             />
//           </Form>
//         </Col>

//         {/* User Info - Right side on md+, top-right on sm */}
//         <Col
//           xs={12}
//           md={4}
//           className="d-flex justify-content-md-end justify-content-end"
//         >
//           <Dropdown align="end">
//             <Dropdown.Toggle
//               variant="light"
//               className="d-flex align-items-center gap-2 border"
//               id="user-dropdown"
//             >
//               <img
//                 src={getProfileImage()}
//                 alt="User"
//                 className="rounded-circle"
//                 style={{ width: "35px", height: "35px", objectFit: "cover" }}
//                 onError={(e) => {
//                   // If the current image fails, try the next fallback
//                   if (e.target.src === userImage && profileImage) {
//                     e.target.src = profileImage;
//                   } else if (e.target.src === profileImage) {
//                     e.target.src = image; // final fallback
//                   }
//                 }}
//               />

//               <span className="d-none d-sm-inline fw-semibold">
//                 {truncateEmailAfter17(userEmail)}
//               </span>
//             </Dropdown.Toggle>

//             <Dropdown.Menu>
//               <Dropdown.ItemText className="fw-semibold">
//                 {truncateEmailAfter17(userEmail)}
//               </Dropdown.ItemText>

//               <Dropdown.ItemText className="text-muted">
//                 {userPhone}
//               </Dropdown.ItemText>
//               <Dropdown.Divider />
//               <Dropdown.Item href="settings">Account Settings</Dropdown.Item>
//               <Dropdown.Item onClick={logoutHandler} disabled={isLoggingOut}>
//                 {isLoggingOut ? "Logging out..." : "Logout"}
//               </Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </Col>
//       </Row>
//     </Container>
//   );
// };
//

import { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Dropdown,
  Form,
  Offcanvas,
} from "react-bootstrap";
import logo from "../../images/Homepage Img/logo.png";
import image from "../../images/Image.jpg";
import { Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HomePageSignUpBtn } from "../ButtonsComponent/AuthenticationButtons";
import { logout } from "../../redux/slices/userSlices/allUsersAuthSlice";
import { clearProfileInfo } from "../../redux/slices/profileSlice/profileAuthslice";
import { useLogoutMutation } from "../../redux/slices/userSlices/allUsersAPISlice";
import { usersAPISlice } from "../../redux/slices/userSlices/allUsersAPISlice";
import { profileAPISlice } from "../../redux/slices/profileSlice/profileAPISlice";
import { escrowProductsAPISlice } from "../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { disputeAPISlice } from "../../redux/slices/disputeSlices/disputeAPISlice";
import { paymentAPISlice } from "../../redux/slices/paymentSlices/paymentAPISlice";
import { persistor } from "../../redux/store";

export const GuestNavbar = () => {
  const { userInfo } = useSelector((state) => state.usersauth);
  console.log(userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    handleClose();
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      dispatch(usersAPISlice.util.resetApiState());
      dispatch(profileAPISlice.util.resetApiState());
      dispatch(escrowProductsAPISlice.util.resetApiState());
      dispatch(disputeAPISlice.util.resetApiState());
      dispatch(paymentAPISlice.util.resetApiState());
      dispatch(clearProfileInfo());
      dispatch(logout());
      await persistor.purge();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/", { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        className={`sticky-top bg-white shadow-sm ${
          scrolled ? "py-2" : "py-3"
        }`}
        style={{ transition: "all 0.3s ease" }}
      >
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src={logo}
              alt="MyDoshBox"
              style={{ height: "40px" }}
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          {/* Mobile Toggle */}
          <Navbar.Toggle
            onClick={handleShow}
            aria-controls="offcanvasNavbar"
            className="border-0 shadow-none"
          >
            <span
              className="d-flex flex-column gap-1"
              style={{ width: "28px" }}
            >
              <span
                className="bg-success d-block"
                style={{ height: "3px", borderRadius: "2px" }}
              ></span>
              <span
                className="bg-success d-block"
                style={{ height: "3px", borderRadius: "2px" }}
              ></span>
              <span
                className="bg-success d-block"
                style={{ height: "3px", borderRadius: "2px" }}
              ></span>
            </span>
          </Navbar.Toggle>

          {/* Desktop Navigation */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
            <Nav className="mx-auto gap-1">
              <Nav.Link
                as={Link}
                to="/"
                className="px-3 py-2 fw-medium text-dark position-relative"
                style={{
                  transition: "color 0.2s ease",
                }}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/aboutus"
                className="px-3 py-2 fw-medium text-dark"
                style={{ transition: "color 0.2s ease" }}
              >
                About Us
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/pricingpage"
                className="px-3 py-2 fw-medium text-dark"
                style={{ transition: "color 0.2s ease" }}
              >
                Pricing
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/faqs"
                className="px-3 py-2 fw-medium text-dark"
                style={{ transition: "color 0.2s ease" }}
              >
                FAQs
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contactus"
                className="px-3 py-2 fw-medium text-dark"
                style={{ transition: "color 0.2s ease" }}
              >
                Contact Us
              </Nav.Link>
              {userInfo && (
                <Nav.Link
                  as={Link}
                  to="/userdashboard"
                  className="px-3 py-2 fw-medium text-dark"
                  style={{ transition: "color 0.2s ease" }}
                >
                  Dashboard
                </Nav.Link>
              )}
            </Nav>

            <Nav className="gap-2">
              {userInfo ? (
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="outline-success"
                  className="px-4 py-2 fw-semibold rounded-pill"
                  style={{
                    transition: "all 0.3s ease",
                  }}
                >
                  {isLoggingOut ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Logging out...
                    </>
                  ) : (
                    "Logout"
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/signin"
                    variant="link"
                    className="px-4 py-2 text-success fw-semibold text-decoration-none"
                    style={{ transition: "all 0.2s ease" }}
                  >
                    Sign In
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    variant="success"
                    className="px-4 py-2 fw-semibold rounded-pill"
                    style={{
                      transition: "all 0.3s ease",
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>

          {/* Mobile Offcanvas */}
          <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            className="w-75"
          >
            <Offcanvas.Header
              closeButton
              className="border-bottom pb-3"
              style={{ borderColor: "#e0e0e0" }}
            >
              <Offcanvas.Title>
                <img src={logo} alt="MyDoshBox" style={{ height: "35px" }} />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
              <Nav className="flex-column">
                <Nav.Link
                  as={Link}
                  to="/"
                  onClick={handleClose}
                  className="px-4 py-3 text-dark fw-medium border-bottom d-flex align-items-center justify-content-between"
                  style={{
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <span>Home</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-success"
                  >
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/aboutus"
                  onClick={handleClose}
                  className="px-4 py-3 text-dark fw-medium border-bottom d-flex align-items-center justify-content-between"
                >
                  <span>About Us</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-success"
                  >
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/pricingpage"
                  onClick={handleClose}
                  className="px-4 py-3 text-dark fw-medium border-bottom d-flex align-items-center justify-content-between"
                >
                  <span>Pricing</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-success"
                  >
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/faqs"
                  onClick={handleClose}
                  className="px-4 py-3 text-dark fw-medium border-bottom d-flex align-items-center justify-content-between"
                >
                  <span>FAQs</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-success"
                  >
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contactus"
                  onClick={handleClose}
                  className="px-4 py-3 text-dark fw-medium border-bottom d-flex align-items-center justify-content-between"
                >
                  <span>Contact Us</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-success"
                  >
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Nav.Link>
                {userInfo && (
                  <Nav.Link
                    as={Link}
                    to="/userdashboard"
                    onClick={handleClose}
                    className="px-4 py-3 text-dark fw-medium border-bottom d-flex align-items-center justify-content-between"
                  >
                    <span>Dashboard</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="text-success"
                    >
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Nav.Link>
                )}
              </Nav>

              <div className="px-4 py-4 mt-auto">
                {userInfo ? (
                  <Button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    variant="outline-success"
                    className="w-auto py-2 px-3 rounded-sm text-danger rounded-3 text-hover-white"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    <Button
                      as={Link}
                      to="/signin"
                      onClick={handleClose}
                      variant="outline-success"
                      className="w-100 py-3 fw-semibold rounded-pill"
                    >
                      Sign In
                    </Button>
                    <Button
                      as={Link}
                      to="/signup"
                      onClick={handleClose}
                      variant="success"
                      className="w-100 py-3 fw-semibold rounded-pill"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>

      {/* Add hover styles */}
      <style>{`
        .nav-link:hover {
          color: #006747 !important;
        }
        
        .btn-outline-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 103, 71, 0.2);
        }
        
        .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 103, 71, 0.3);
        }
        
        .offcanvas .nav-link:hover {
          background-color: #f8f9fa;
        }
      `}</style>

      <Outlet />
    </>
  );
};

// Truncate function
const truncateEmailAfter17 = (email, maxLength = 17) => {
  if (!email) return "";
  return email.length > maxLength ? email.slice(0, maxLength) + "..." : email;
};

export const UserDashboardNavbar = () => {
  const { userInfo } = useSelector((state) => state.usersauth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profileInfo } = useSelector((state) => state.profileAuth);
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const profileImage = profileInfo?.image;
  const userEmail = userInfo?.email || userInfo?.organization_email || "";
  const userPhone = userInfo?.phone_number || userInfo?.contact_number || "";
  const userImage =
    userInfo?.picture && userInfo.picture.trim() !== ""
      ? userInfo.picture
      : null;

  const getProfileImage = () => {
    if (userImage) return userImage;
    if (profileImage) return profileImage;
    return image;
  };

  const logoutHandler = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      dispatch(usersAPISlice.util.resetApiState());
      dispatch(profileAPISlice.util.resetApiState());
      dispatch(escrowProductsAPISlice.util.resetApiState());
      dispatch(disputeAPISlice.util.resetApiState());
      dispatch(paymentAPISlice.util.resetApiState());
      dispatch(clearProfileInfo());
      dispatch(logout());
      await persistor.purge();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/", { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <>
      <Container fluid className="py-1 bg-white border-bottom sticky-top">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          {/* Search Form */}
          <div className="flex-grow-1" style={{ maxWidth: "600px" }}>
            <Form.Group className="position-relative mb-0 d-none d-md-block">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="position-absolute text-muted"
                style={{
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <path
                  d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 19L14.65 14.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Form.Control
                type="text"
                placeholder="Search..."
                className="ps-5 py-2 border rounded-pill"
                style={{
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
              />
            </Form.Group>
          </div>

          {/* User Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              className="d-flex align-items-center gap-3 border rounded-pill px-3 py-2 bg-white"
              id="user-dropdown"
              style={{
                transition: "all 0.3s ease",
              }}
            >
              <img
                src={getProfileImage()}
                alt="User"
                className="rounded-circle"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  border: "2px solid #006747",
                }}
                onError={(e) => {
                  if (e.target.src === userImage && profileImage) {
                    e.target.src = profileImage;
                  } else if (e.target.src === profileImage) {
                    e.target.src = image;
                  }
                }}
              />

              <div className="d-none d-md-flex flex-column align-items-start text-start">
                <span
                  className="fw-semibold text-dark"
                  style={{ fontSize: "14px" }}
                >
                  {truncateEmailAfter17(userEmail)}
                </span>
                <span className="text-muted" style={{ fontSize: "12px" }}>
                  {userPhone}
                </span>
              </div>

              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-muted"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="border shadow-lg rounded-3 mt-2"
              style={{ minWidth: "280px" }}
            >
              <div className="px-4 py-3 border-bottom">
                <div
                  className="fw-semibold text-dark mb-1"
                  style={{ fontSize: "14px" }}
                >
                  {truncateEmailAfter17(userEmail)}
                </div>
                <div className="text-muted" style={{ fontSize: "13px" }}>
                  {userPhone}
                </div>
              </div>

              <Dropdown.Item
                href="userdashboard/settings"
                className="px-4 py-3 d-flex align-items-center gap-3"
                style={{ transition: "background-color 0.2s ease" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.55 11.25C14.4783 11.4844 14.4619 11.7321 14.5023 11.9738C14.5428 12.2156 14.6388 12.4441 14.7825 12.6412L14.8125 12.6787C14.9319 12.8408 15.0205 13.0251 15.0734 13.2214C15.1263 13.4178 15.1426 13.6226 15.1214 13.8252C15.1002 14.0277 15.0419 14.2243 14.9497 14.4045C14.8574 14.5846 14.7329 14.7451 14.5825 14.8775C14.432 15.0099 14.2585 15.1119 14.071 15.1782C13.8835 15.2445 13.6855 15.2738 13.4871 15.2644C13.2888 15.2551 13.0939 15.2072 12.9125 15.1237C12.7311 15.0403 12.5665 14.9229 12.4275 14.7787L12.39 14.7487C12.193 14.605 11.9644 14.509 11.7226 14.4685C11.4809 14.4281 11.2332 14.4445 10.9988 14.5162C10.7681 14.5839 10.5563 14.7049 10.3802 14.8698C10.2042 15.0348 10.0687 15.2391 9.98376 15.4662L9.98376 15.4662C9.92558 15.6488 9.83178 15.8177 9.70814 15.9629C9.5845 16.1081 9.43347 16.2268 9.26395 16.3123C9.09444 16.3979 8.90982 16.4486 8.72046 16.4617C8.53109 16.4748 8.34091 16.4501 8.16126 16.3887C7.80557 16.2694 7.50535 16.0289 7.31626 15.7087C7.12716 15.3886 7.06153 15.0089 7.13126 14.6437V14.58C7.20293 14.3456 7.21933 14.0979 7.17883 13.8562C7.13833 13.6144 7.04215 13.386 6.89876 13.1887C6.75536 12.9915 6.56902 12.8309 6.35415 12.7188C6.13927 12.6067 5.90184 12.5461 5.66001 12.5412C5.41441 12.5412 5.17211 12.4723 4.96001 12.3412L4.92251 12.3112C4.72555 12.1675 4.49709 12.0715 4.25533 12.031C4.01358 11.9905 3.76595 12.0069 3.53251 12.0787C3.29907 12.1505 3.08602 12.2759 2.90897 12.4452C2.73191 12.6145 2.59563 12.823 2.51126 13.0537C2.42688 13.2845 2.39643 13.5316 2.42209 13.7763C2.44775 14.0209 2.52885 14.2568 2.65926 14.4662C2.78967 14.6757 2.96599 14.8533 3.17501 14.9858C3.38402 15.1183 3.62042 15.2024 3.86626 15.2325L3.93001 15.2325C4.29525 15.3024 4.62499 15.4975 4.85775 15.7832C5.09051 16.0689 5.21155 16.4275 5.19751 16.7925C5.19751 17.0381 5.26645 17.2804 5.39751 17.4925L5.42751 17.53C5.54664 17.727 5.70726 17.8956 5.89794 18.0234C6.08862 18.1513 6.30449 18.2353 6.53017 18.2697C6.75585 18.3041 6.98613 18.2881 7.20529 18.2227C7.42445 18.1573 7.62715 18.0441 7.80001 17.8912C8.00757 17.7162 8.16986 17.4924 8.27251 17.2387C8.37516 16.985 8.41512 16.7095 8.38876 16.4362V16.3725C8.38876 16.1307 8.44936 15.8933 8.56509 15.6827C8.68082 15.4721 8.84809 15.2954 9.05167 15.1694C9.25525 15.0433 9.48816 14.9723 9.72813 14.963C9.96811 14.9537 10.2058 15.0064 10.4175 15.1162L10.4175 15.1162C10.6296 15.2473 10.8719 15.3162 11.1175 15.3162C11.4825 15.3022 11.8411 15.1811 12.1388 14.9662L12.1763 14.9362C12.4962 14.7471 12.7367 14.4469 12.856 14.0912C12.9754 13.7356 12.9661 13.3478 12.8298 12.998C12.6935 12.6482 12.4387 12.3597 12.1109 12.1827C11.7831 12.0056 11.4026 11.9505 11.0363 12.0262L10.9725 12.0262C10.7371 12.0979 10.4894 12.1143 10.2477 12.0738C10.0059 12.0333 9.77751 11.9371 9.58026 11.7937C9.38301 11.6503 9.22242 11.464 9.11033 11.2491C8.99824 11.0342 8.93765 10.7968 8.93251 10.555C8.93251 10.3094 8.86357 10.0671 8.73251 9.855L8.70251 9.8175C8.55883 9.62054 8.37282 9.45991 8.15826 9.34727C7.9437 9.23463 7.70634 9.17297 7.46376 9.16727C7.22119 9.16158 6.98122 9.21199 6.76213 9.31463C6.54304 9.41727 6.35059 9.56951 6.19876 9.75875C5.90612 10.1313 5.78088 10.6082 5.85441 11.075C5.92795 11.5417 6.1936 11.9575 6.58876 12.2175C6.74059 12.3162 6.87426 12.4423 6.98251 12.5887"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="fw-medium">Account Settings</span>
              </Dropdown.Item>

              <Dropdown.Divider className="my-0" />

              <Dropdown.Item
                onClick={logoutHandler}
                disabled={isLoggingOut}
                className="px-4 py-3 d-flex align-items-center gap-3 text-danger"
                style={{ transition: "background-color 0.2s ease" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12.75L15.75 9L12 5.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.75 9H6.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="fw-medium">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>

      <style>{`
        .dropdown-toggle::after {
          display: none;
        }
        
        .dropdown-toggle:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          transform: translateY(-1px);
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
        
        .form-control:focus {
          border-color: #006747;
          box-shadow: 0 0 0 0.2rem rgba(0, 103, 71, 0.15);
        }
      `}</style>
    </>
  );
};
