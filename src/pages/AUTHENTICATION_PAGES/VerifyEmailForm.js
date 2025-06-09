import { useState, useEffect } from "react";
import logo from "../../images/doshlogolight.png";

import { Link, useNavigate } from "react-router-dom";
import ResetPassword from "./resetPassword";

const ForgetPassword = () => {
  return (
    <>
      <div className="contestPage container-fluid">
        <div className="row">
          <div className="col-lg-6 col-sm-12">
            <Side />
          </div>
          <div className="col-lg-6 col-sm-12 container `">
            <VerifyEmailForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;

const VerifyEmailForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send request to server to verify email
    if (email) {
      // If verified, set isVerified to true
      setIsVerified(true);
      setError(null);
    } else {
      setError("Please enter a valid email");
    }
  };
  return (
    <div className="pt-5 container mt-lg-5">
      <div>
        <h3 className="titleStyle text-center">Verify Your Email</h3>
        <p className="text-center">
          Welcome back to MyDoshBox! Please enter your Email
        </p>
      </div>
      <form className="container" onSubmit={handleSubmit}>
        <div class="mb-2">
          <input
            type={email}
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter Email"
            onChange={(event) => setEmail(event.target.value)}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          {isVerified && (
            <p style={{ color: "green" }}>Email verified successfully</p>
          )}
        </div>
        <div className="text-center">
          <button
            type="submit"
            class="ll-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white "
          >
            Verify Account
          </button>

          <Link
            to={"../ResetPassword"}
            className="text-success text-decoration-none"
            style={{ fontSize: "14px" }}
          >
            Reset Password
          </Link>
        </div>
      </form>
    </div>
  );
};

export const Side = () => {
  return (
    <div className="">
      <div className="signUp-bg text-white">
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
    </div>
  );
};
