import { Nav, Navbar, Container, Form, Row, Col, } from "react-bootstrap";
import logo from "../../images/Homepage Img/logo.png";
import image from "../../images/Image.jpg";
import { Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import {
  HomePageSignUpBtn,
  SignUpButton,
} from "../ButtonsComponent/AuthenticationButtons";


export const GuestNavbar = () => {
  const disappearEl = useRef(null);

  const handleDisappear = () => {
    disappearEl.style.display = "none";
  };

  return (
    <>
      <Navbar expand="lg" className="guest-nav sticky-top bg-white mb-2">
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="hamburgerIcon"
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
              onClick={() => handleDisappear}
            >
              Home
            </Link>
            <Link
              to="/aboutus"
              className="nav-link nav-links"
              onClick={() => handleDisappear}
            >
              About Us
            </Link>
            <Link
              to="/pricingpage"
              className="nav-link nav-links"
              onClick={() => handleDisappear}
            >
              Pricing
            </Link>
            <Link
              to="/faqs"
              className="nav-link nav-links"
              onClick={() => handleDisappear}
            >
              FAQs
            </Link>
            <Link
              to="/contactus"
              className="nav-link nav-links"
              onClick={() => handleDisappear}
            >
              Contact Us
            </Link>
            <Link
              to="/signup"
              className="nav-links nav-btn"
              onClick={() => handleDisappear}
            >
              <HomePageSignUpBtn />
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </>
  );
};

export const UserDashboardNavbar = () => {
  const { userInfo } = useSelector((state) => state.usersauth);

  return (
    <Container fluid className="px-3 px-lg-5 py-3">
      <Row className="align-items-center g-3">
        {/* Search Field - full width on mobile */}
        <Col xs={12} md={8}>
          <Form>
            <Form.Control
              type="text"
              placeholder="Search"
              className="rounded-pill px-4 py-2 border border-light w-100"
            />
          </Form>
        </Col>

        {/* User Info and Avatar */}
        <Col xs={12} md={4} className="d-flex align-items-center justify-content-md-end gap-3 flex-wrap">
          <div className="text-md-end flex-grow-1 flex-md-grow-0">
            {userInfo ? (
              <>
                <div className="small fw-semibold text-truncate">
                  {userInfo?.user?.email || userInfo?.user?.organization_email}
                </div>
                <div className="small text-muted text-truncate">
                  {userInfo?.user?.phone_number || userInfo?.user?.contact_number}
                </div>
              </>
            ) : (
              <div className="small text-muted">User not found</div>
            )}
          </div>

          {/* Avatar Wrapper (fixes squishing + responsive layout) */}
          <div style={{ width: "40px", height: "40px", flexShrink: 0 }}>
            <img
              src={image}
              alt="User Avatar"
              className="rounded-circle"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

// export const UserDashboardNavbar = () => {
//   // console.count("UserDashboardNavbar: ");

//   const { userInfo } = useSelector((state) => state.usersauth);
//   // console.log(userInfo?.user?.email);
//   // console.log(userInfo?.user?.phone_number);
//   // console.log(userInfo?.status);
//   return (
//     <Container>
//       <Nav className="justify-content-end userDashboardNav position-sticky top-0 end-0">
//         <Nav.Item className=" mx-md-5 mt-2">
//           <Form className="searchField">
//             <Form.Control
//               type="text"
//               placeholder="search"
//               className="search border-1 rounded-4 "
//             />
//           </Form>
//         </Nav.Item>
//         <Nav.Item className="d-flex ms-md-5">
//           <div>

//             {userInfo ? (
//               <>
//                 <span
//                   className="d-block text-end"
//                   title={userInfo?.status}
//                   id="email"
//                 >
//                   {userInfo?.user?.email || userInfo?.user?.organization_email}
//                   {/* <Link to={}></Link> */}
//                 </span>

//                 <span className="d-block text-end">
//                   {userInfo?.user?.phone_number ||
//                     userInfo?.user?.contact_number}
//                 </span>
//               </>
//             ) : (
//               <p>None</p>
//             )}
//           </div>
//           <div className="mt-1 ms-2">
//             <img src={image} alt="" />
//           </div>
//         </Nav.Item>
//       </Nav>
//     </Container>
//   );
// };
