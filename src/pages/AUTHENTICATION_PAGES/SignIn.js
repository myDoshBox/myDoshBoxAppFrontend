import { useState, useEffect } from "react";
import logo from "../../images/doshlogolight.png";
import {
  SignInButton,
  // GoogleSignInButton,
} from "../../components/ButtonsComponent/AuthenticationButtons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { addUser, setCredentials } from "../../redux/slices/authSlice";
import { useLoginMutation } from "../../redux/slices/userSlices/allUsersAPISlice";
import { setCredentials } from "../../redux/slices/userSlices/allUsersAuthSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
// import OAuthLogin from "../../components/GoogleAuth/OAuthLogin";
// import OAuth from "../../components/GoogleAuth/OAuth";
// import forgetPassword from "../AUTHENTICATION_PAGES/forgetPassword";

const SignInPage = () => {
  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0 w-100 vh-100">
        {/* Left Column - Green Side */}
        <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-start p-4 p-md-5 bg-success text-white min-vh-50 min-vh-md-100">
          <Link to="/" className="mb-3">
            <img
              src={logo}
              alt="MyDoshBox Logo"
              className="img-fluid"
              style={{ maxWidth: "140px" }}
            />
          </Link>
          <div>
            <h2 className="fw-bold">Start your journey with us.</h2>
            <p className="mt-3 text-white">
              Secure, smart, and simplified transactions powered by MyDoshBox.
            </p>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4 bg-white min-vh-50 min-vh-md-100">
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export const SignInForm = () => {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.usersauth);

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) navigate("/userdashboard");
  }, [navigate, userInfo]);

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const handleShowHide = (e) => {
    e.preventDefault();
    setPasswordToggle(!passwordToggle);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await login({ ...user }).unwrap();

      if (res.status !== "success") {
        toast.error(res.message || "Login failed");
        return;
      }

      const credentials = {
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      };

      dispatch(setCredentials(credentials)); // Pass structured credentials
      toast.success("Login successful!");
      navigate("/userdashboard");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.error || "Login failed");
    }
  };

  // Show loader if logging in
  if (isLoading) return <Loader />;

  return (
    <div className="w-100" style={{ maxWidth: "600px" }}>
      <h3 className="text-center fw-bold mb-3">Sign In</h3>
      <p className="text-center text-muted mb-4">
        Welcome back to MyDoshBox! Please enter your credentials.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="form-control form-control-lg"
            placeholder="Email address"
            required
          />
        </div>

        <div className="mb-3 input-group">
          <input
            type={passwordToggle ? "text" : "password"}
            name="password"
            value={user.password}
            onChange={handleChange}
            className="form-control form-control-lg"
            placeholder="Password"
            required
          />
          <button
            className="btn btn-outline-secondary"
            onClick={handleShowHide}
            type="button">
            {passwordToggle ? <HidePassWordIcon /> : <ShowPassWordIcon />}
          </button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
            />
            <label className="form-check-label text-muted" htmlFor="rememberMe">
              Remember me
            </label>
          </div>
          <Link to="/ForgotPassword" className="text-success fw-semibold">
            Forgot Password?
          </Link>
        </div>

        <div className="d-grid mb-3">
          <SignInButton />
        </div>

        <p className="text-center">
          Don't have an account?{" "}
          <Link to="../signup" className="text-success fw-semibold">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

const ShowPassWordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    fill="gray"
    className="bi bi-eye-slash-fill"
    viewBox="0 0 16 16">
    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
  </svg>
);

const HidePassWordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    fill="gray"
    className="bi bi-eye-fill"
    viewBox="0 0 16 16">
    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
  </svg>
);

export default SignInPage;

// const SignInPage = () => {
//   return (
//     <>
//       <div className="contestPage">
//         <div className="row">
//           <div className="col-lg-6 col-sm-12">
//             <Side />
//           </div>
//           <div className="col-lg-6 col-sm-12 container">
//             <SignInForm />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export const SignInForm = () => {
//   const [passwordToggle, setpasswordToggle] = useState(false);
//   const [user, setUser] = useState({ email: "", user_password: "" });

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [login, { isLoading }] = useLoginMutation();
//   const [loading, setLoading] = useState(false);

//   const { userInfo } = useSelector((state) => state.usersauth);
//   // console.log(userInfo);

//   useEffect(() => {
//     if (userInfo) {
//       navigate("/userdashboard");
//     }
//   }, [navigate, userInfo]);

//   const handleChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     setUser({ ...user, [name]: value });
//   };

//   const handleShowHide = (e) => {
//     e.preventDefault();
//     setpasswordToggle(!passwordToggle);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     if (!user.email || !user.user_password) {
//       return toast.error("all fields are required");
//     }

//     try {
//       const res = await login({ ...user }).unwrap();
//       // if (res?.status === "true") {
//       //   dispatch(setCredentials({ ...res }));
//       //   navigate("/userdashboard");
//       // }

//       if (res?.status === "false") {
//         toast.error(res?.message);
//         navigate("/signin");
//         // setLoading(false);
//       } else {
//         dispatch(setCredentials({ ...res }));
//         navigate("/userdashboard");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.data?.message || err?.error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <>
//       <div className="mt-5">
//         <h3 className="titleStyle text-center">Sign In</h3>
//         <p className="text-center mb-4">
//           Welcome back to MyDoshBox! Please enter your details
//         </p>
//         <form className="container form" onSubmit={handleSubmit}>
//           <div className="form-outline mb-2">
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={user.email}
//               onChange={handleChange}
//               className="border rounded p-2 w-100 labelStyle"
//               placeholder="Email"
//             />
//           </div>
//           <div className="form-outline mb-2 d-flex">
//             <input
//               type={passwordToggle ? "text" : "password"}
//               id="user_password"
//               name="user_password"
//               value={user.user_password}
//               onChange={handleChange}
//               className="border border-end-0 rounded-start p-2 w-100 labelStyle"
//               placeholder="Password"
//             />
//             <button
//               className="border rounded-end border-start-0 px-2 bg-transparent"
//               onClick={handleShowHide}
//             >
//               {passwordToggle ? <HidePassWordIcon /> : <ShowPassWordIcon />}
//             </button>
//           </div>
//           <div className="d-flex justify-content-between align-items-center">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 value=""
//                 id="flexCheckDefault"
//                 // onClick={dontSubmit}
//               />
//               <label className="text-success" htmlFor="flexCheckDefault">
//                 Remember Information
//               </label>
//             </div>
//             <Link
//               to={"../VerifyEmailForm"}
//               className="text-success text-decoration-none"
//               style={{ fontSize: "14px" }}
//             >
//               Forgot Password?
//             </Link>
//           </div>
//           <div className="d-flex flex-column mt-4">
//             <div className="mx-auto mb-2">
//               <SignInButton />
//             </div>
//           </div>
//           {/* <div className="d-flex justify-content-center ">

//             <OAuth />
//           </div> */}

//           <div className="d-flex justify-content-center mt-2">
//             <p>
//               <span style={{ fontSize: "14px" }}>Don't have an account?</span>
//               <Link
//                 to={"../signup"}
//                 className="text-decoration-none ms-1 text-success"
//                 style={{ fontSize: "14px" }}
//               >
//                 Sign Up
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// const Side = () => {
//   return (
//     <div className="pe-lg-5 signUp-bg text-white">
//       <Link to="/">
//         <img src={logo} alt="" className="p-4" />
//       </Link>
//       <div className="p-md-5 p-3">
//         <h1 className="text-white">Start your journey with us.</h1>
//         <p className="text-white">
//           Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et
//         </p>
//       </div>
//     </div>
//   );
// };

// const ShowPassWordIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="25"
//       fill="gray"
//       className="bi bi-eye-slash-fill"
//       viewBox="0 0 16 16"
//     >
//       <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
//       <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
//     </svg>
//   );
// };
// const HidePassWordIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="25"
//       fill="gray"
//       className="bi bi-eye-fill"
//       viewBox="0 0 16 16"
//     >
//       <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
//       <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
//     </svg>
//   );
// };

// export default SignInPage;
