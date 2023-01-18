import { useState } from "react";
import { GoogleButton } from "../../components/ButtonsComponent/Button";
import { GoogleIcon } from "../../components/IconComponent/SocialMediaIcons";
import image from "../../images/SignInPageImage.png";
import logo from "../../images/doshlogo.jpg";
import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row mx-auto flex-column-reverse flex-md-row">
          <div className="col-sm-12 col-lg-1"></div>
          <div className="col-sm-12 col-lg-6 px-lg-5 my-5">
            <Link to={"/"}>
              <img
                src={logo}
                alt="doshboxlogo"
                className="position-fixed start-0 top-0 px-4 py-3"
              />
            </Link>
            <SignInForm />
          </div>
          {/* <div className="col-sm-12 col-lg-1"></div> */}
          <div className="col-sm-12 col-lg-5">
            <img
              src={image}
              alt="signIn image"
              style={{ height: "100vh", width: "100%" }}
              className="img-fluid d-none d-lg-block"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const SignInForm = () => {
  const [passwordToggle, setpasswordToggle] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const [userDetails, setUserDetails] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleShowHide = (e) => {
    e.preventDefault();
    setpasswordToggle(!passwordToggle);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.email && user.password) {
      setUserDetails([...userDetails, user]);
      setUser({ email: "", password: "" });
    }
  };

  //   const dontSubmit = (e) => {
  //     e.preventDefault();
  //   };

  return (
    <>
      <div className="mt-5">
        <h3 className="titleStyle text-center">Sign In</h3>
        <p className="text-center mb-4">
          Welcome back to MyDoshBox! Please enter your details
        </p>
        <form className="container form" onSubmit={handleSubmit}>
          <div className="form-outline mb-2">
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="border rounded p-2 w-100 labelStyle"
              placeholder="Email"
            />
          </div>
          <div className="form-outline mb-2 d-flex">
            <input
              type={passwordToggle ? "text" : "password"}
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="border border-end-0 rounded-start p-2 w-100 labelStyle"
              placeholder="Password"
            />
            <button
              className="border rounded-end border-start-0 px-2 bg-transparent"
              onClick={handleShowHide}
            >
              {passwordToggle ? <HidePassWordIcon /> : <ShowPassWordIcon />}
            </button>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                // onClick={dontSubmit}
              />
              <label className="text-success" for="flexCheckDefault">
                Remember Information
              </label>
            </div>
            <a
              href=""
              className="text-success text-decoration-none"
              style={{ fontSize: "14px" }}
            >
              Forgot Password?
            </a>
          </div>
          <div className="d-flex flex-column mt-4">
            <div className="mx-auto mb-2">
              <button
                type="submit"
                className="GeneralBtnStyle1 btn all-btn text-white"
                style={{ width: "210px" }}
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
        <div className="d-flex justify-content-center">
          <GoogleButton text="Sign In With Google" icon={<GoogleIcon />} />
        </div>
        <div className="d-flex justify-content-center mt-2">
          <p>
            <span style={{ fontSize: "14px" }}>Don't have an account?</span>
            <a
              href="#"
              className="text-decoration-none ms-1 text-success"
              style={{ fontSize: "14px" }}
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

const ShowPassWordIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
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
      width="25"
      fill="gray"
      className="bi bi-eye-fill"
      viewBox="0 0 16 16"
    >
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    </svg>
  );
};

export default SignInPage;
