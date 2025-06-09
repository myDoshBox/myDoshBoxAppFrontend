import { useState, useEffect } from "react";
import logo from "../../images/doshlogolight.png";

import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  return (
    <>
      <div className="contestPage container-fluid">
        <div className="row">
          <div className="col-lg-6 col-sm-12">
            <Side />
          </div>
          <div className="col-lg-6 col-sm-12 container `">
            <PasswordResetForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

const PasswordResetForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordToggle, setpasswordToggle] = useState(false);
  const [passwordToggle1, setpasswordToggle1] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      // Send request to server to update password
      setError(null);
    }
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleShowHide = (e) => {
    setpasswordToggle(!passwordToggle);
    e.preventDefault();
  };
  const handleShowHide2 = (e) => {
    setpasswordToggle1(!passwordToggle1);
    e.preventDefault();
  };
  return (
    <div className="pt-5 container mt-lg-5">
      <div>
        <h3 className="titleStyle text-center">Change Password</h3>
        <p className="text-center">
          Welcome back to MyDoshBox! Please enter your Password
        </p>
      </div>
      <form className="container" onSubmit={handleSubmit}>
        <div className="form-outline d-flex">
          <input
            type={passwordToggle ? "text" : "password"}
            className="border border-end-0 rounded-start p-2 w-100 labelStyle mt-2 mb-1"
            placeholder="new password"
            id="exampleInputPassword1"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <button
            className="border rounded-end border-start-0 px-2  bg-transparent mb-1"
            onClick={handleShowHide}
          >
            {passwordToggle ? <HidePassWordIcon /> : <ShowPassWordIcon />}
          </button>
        </div>
        <div className="form-outline d-flex">
          <input
            className="border border-end-0 rounded-start p-2 w-100 labelStyle mt-2 mb-1 "
            placeholder="confirm Password"
            type={passwordToggle1 ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <button
            className="border rounded-end border-start-0 px-2 bg-transparent mt-2"
            onClick={handleShowHide2}
          >
            {passwordToggle1 ? <HidePassWordIcon /> : <ShowPassWordIcon />}
          </button>
        </div>
        <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
        <div className="text-center">
          <button
            type="submit"
            className="ll-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white "
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export const Side = () => {
  return (
    <div>
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

const ShowPassWordIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      fill="gray"
      className="bi bi-eye-slash-fill"
      viewBox="0 0 16 16"
    >
      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
    </svg>
  );
};
const HidePassWordIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      fill="gray"
      className="bi bi-eye-fill"
      viewBox="0 0 16 16"
    >
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    </svg>
  );
};
