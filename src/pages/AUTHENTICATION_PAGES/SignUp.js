import { Container, Row, Col, Tab } from "react-bootstrap";
import {
  SignUpIndividual,
  SignUpOrganization,
} from "../../components/FormComponents.js/AuthenticationForms";
import { Link } from "react-router-dom";
import logo from "../../images/doshlogolight.png";
// import CustomBtn from "../../components/ButtonsComponent/GenandAuthBtn";

const SignUpPage = () => {
  return (
    <div className="">
      <SignUpForm />
      {/* <Link
              to={"../LinkVerificationMsg"}
              className="text-decoration-none ms-1 text-success"
              style={{ fontSize: "14px" }}
            >
              LinkVerificationMsg
            </Link> */}
    </div>
  );
};

const SignUpForm = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light overflow-hidden">
      <Container fluid className="p-0">
        <Row className="g-0 min-vh-100">
          {/* LEFT SIDE - INFO SECTION */}
          <Col
            xs={12}
            md={6}
            className="d-flex flex-column justify-content-center align-items-start bg-success text-white p-4 p-md-5">
            <div className="w-100">
              <h1 className="fw-bold mb-3">Start your journey with us.</h1>
              <p className="lead text-white">
                Secure, smart, and simplified transactions powered by MyDoshBox.
              </p>
            </div>
          </Col>

          {/* RIGHT SIDE - SIGN UP FORM */}
          <Col
            xs={12}
            md={6}
            className="d-flex flex-column justify-content-center align-items-center bg-white p-4 p-md-5">
            <div className="container-fluid">
              <h3 className="text-center fw-bold mb-3">
                Set up your Doshbox account
              </h3>
              <p className="text-center text-muted mb-4">
                It's quick and easy to get started.
              </p>

              <Tab.Container defaultActiveKey="first">
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <SignUpIndividual />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>

              <div className="text-center mt-4">
                <span className="me-1" style={{ fontSize: "14px" }}>
                  Already have an account?
                </span>
                <Link
                  to="/signin"
                  className="text-success text-decoration-none fw-semibold"
                  style={{ fontSize: "14px" }}>
                  Sign In
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default SignUpPage;

// const SignUpForm = () => {
//   return (
//     <div className="container sign-up-form px-lg-5 py-2 py-md-3 py-lg-4">
//       <h3 className="titleStyle mb-4 text-center">
//         Set up your Doshbox account
//       </h3>
//       <Tab.Container id="left-tabs-example" defaultActiveKey="first">
//         <Row>
//           {/* <Col sm={12}>
//             <Nav className="justify-content-center mb-4 row" variant="pills">
//               <Nav.Item className="mx-auto my-2 col-md-6 col-sm-12 text-center">
//                 <Nav.Link eventKey="first">As an Individual</Nav.Link>
//               </Nav.Item>
//               <Nav.Item className="mx-auto my-2 col-md-6 col-sm-12 text-center">
//                 <Nav.Link eventKey="second">As a Company</Nav.Link>
//               </Nav.Item>
//             </Nav>
//           </Col> */}
//           <Col sm={12}>
//             <Tab.Content>
//               <Tab.Pane eventKey="first">
//                 <SignUpIndividual />
//               </Tab.Pane>
//               {/* <Tab.Pane eventKey="second">
//                 <SignUpOrganization />
//               </Tab.Pane> */}
//             </Tab.Content>
//             <div className="d-flex justify-content-center mt-2">
//               <span style={{ fontSize: "14px" }}>Already have an account?</span>
//               <Link
//                 to={"/signin"}
//                 className="text-decoration-none ms-1 text-success"
//                 style={{ fontSize: "14px" }}
//               >
//                 Sign In
//               </Link>
//             </div>
//           </Col>
//         </Row>
//       </Tab.Container>
//     </div>
//   );
// };

// const Side = () => {
//   return (
//     <div className="pe-lg-5 signUp-bg text-white">
//       {/* <CustomBtn to="/">
//         <img src={logo} alt="" className="p-4" />
//       </CustomBtn> */}
//       <div className="p-md-5 p-3">
//         <h1 className="text-white">Start your journey with us.</h1>
//         <p className="text-white">
//           Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et
//         </p>
//       </div>
//     </div>
//   );
// };
