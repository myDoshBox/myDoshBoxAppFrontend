import { Link } from "react-router-dom";
import logo from "../../images/doshlogolight.png";

const LinkVerificationMsg = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row">
          <div className="col-lg-6 col-sm-12 ps-0">
            <Side />
          </div>
          <div className="col-lg-6 col-sm-12 container mt-lg-5 pt-lg-4">
            <div className="text Center pt-lg-5 mt-lg-4">
              <p className="text-center">
                Your account has been created! We just sent a verification link
                to your email address. Enter it to complete your registration
              </p>
              {/* <p className="text-center">
                Didn’t get the Link?
                <Link to="" className="text-decoration-none ms-1">
                  <span className="text-primary ">Resend link.</span>
                </Link>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkVerificationMsg;

const Side = () => {
  return (
    <div className="pe-lg-5 signUp-bg text-white">
      <Link to="/">
        <img src={logo} alt="" className="p-4" />
      </Link>
      <div className="p-md-5 p-3">
        <h1 className="text-white">Start your journey with us.</h1>
        <p className="text-white">
          Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et
        </p>
      </div>
    </div>
  );
};
