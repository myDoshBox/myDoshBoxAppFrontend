import {
  Nav,
  Navbar,
  Container,
  Form,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import logo from "../../images/Homepage Img/logo.png";
import image from "../../images/Image.jpg";
import { Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const disappearEl = useRef(null);
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleDisappear = () => {
    if (disappearEl.current) {
      disappearEl.current.style.display = "none";
    }
  };

  const handleLogout = async () => {
    try {
      // 1. Call API logout
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API fails
    } finally {
      // 2. Reset all RTK Query caches
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
      <Navbar expand="lg" className="guest-nav sticky-top bg-white mb-2">
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="hamburgerIcon">
          <svg
            width="30"
            height="20"
            viewBox="0 0 30 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 8.33333H22.5V11.6667H0V8.33333ZM0 0H30V3.33333H0V0ZM0 20H13.5656V16.6667H0V20Z"
              fill="#006747"
            />
          </svg>
        </Navbar.Toggle>
        <Navbar.Brand>
          <Link to="/">
            <img src={logo} alt="logo" className="my-auto" />
          </Link>
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-text" ref={disappearEl}>
            <Link
              to="/"
              className="nav-link nav-links"
              onClick={handleDisappear}>
              Home
            </Link>
            <Link
              to="/aboutus"
              className="nav-link nav-links"
              onClick={handleDisappear}>
              About Us
            </Link>
            <Link
              to="/pricingpage"
              className="nav-link nav-links"
              onClick={handleDisappear}>
              Pricing
            </Link>
            <Link
              to="/faqs"
              className="nav-link nav-links"
              onClick={handleDisappear}>
              FAQs
            </Link>
            <Link
              to="/contactus"
              className="nav-link nav-links"
              onClick={handleDisappear}>
              Contact Us
            </Link>

            {/* Conditional rendering based on auth state */}
            {userInfo ? (
              <>
                <Link
                  to="/userdashboard"
                  className="nav-link nav-links"
                  onClick={handleDisappear}>
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="nav-links nav-btn btn btn-outline-success ms-2">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="nav-link nav-links"
                  onClick={handleDisappear}>
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="nav-links nav-btn"
                  onClick={handleDisappear}>
                  <HomePageSignUpBtn />
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </>
  );
};

// Truncate function: Show first 17 characters, then add "..."
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
    // Priority order: userImage > profileImage > defaultImage
    if (userImage) return userImage;
    if (profileImage) return profileImage;
    return image; // default fallback image
  };

  const logoutHandler = async () => {
    try {
      // 1. Call API logout
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API fails
    } finally {
      // 2. Reset all RTK Query caches
      dispatch(usersAPISlice.util.resetApiState());
      dispatch(profileAPISlice.util.resetApiState());
      dispatch(escrowProductsAPISlice.util.resetApiState());
      dispatch(disputeAPISlice.util.resetApiState());
      dispatch(paymentAPISlice.util.resetApiState());

      // 3. Clear profile info
      dispatch(clearProfileInfo());

      // 4. Dispatch logout (this triggers store reset via rootReducer)
      dispatch(logout());

      // 5. Purge redux-persist cache
      await persistor.purge();

      // 6. Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // 7. Navigate to home
      navigate("/", { replace: true });

      // 8. Reload page to ensure clean slate
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <Container fluid className="mt-5">
      <Row className="align-items-center">
        {/* Search Form - Always on the left on md+ */}
        <Col xs={12} md={8} className="mb-3 mb-md-0">
          <Form>
            <Form.Control
              type="text"
              placeholder="Search"
              className="w-100 border"
              style={{ minWidth: "100%" }}
            />
          </Form>
        </Col>

        {/* User Info - Right side on md+, top-right on sm */}
        <Col
          xs={12}
          md={4}
          className="d-flex justify-content-md-end justify-content-end">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              className="d-flex align-items-center gap-2 border"
              id="user-dropdown">
              <img
                src={getProfileImage()}
                alt="User"
                className="rounded-circle"
                style={{ width: "35px", height: "35px", objectFit: "cover" }}
                onError={(e) => {
                  // If the current image fails, try the next fallback
                  if (e.target.src === userImage && profileImage) {
                    e.target.src = profileImage;
                  } else if (e.target.src === profileImage) {
                    e.target.src = image; // final fallback
                  }
                }}
              />

              <span className="d-none d-sm-inline fw-semibold">
                {truncateEmailAfter17(userEmail)}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.ItemText className="fw-semibold">
                {truncateEmailAfter17(userEmail)}
              </Dropdown.ItemText>

              <Dropdown.ItemText className="text-muted">
                {userPhone}
              </Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item href="settings">Account Settings</Dropdown.Item>
              <Dropdown.Item onClick={logoutHandler} disabled={isLoggingOut}>
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
};
