import { useState, useEffect, useCallback } from "react";
import logo from "../../images/doshlogolight.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/slices/userSlices/allUsersAPISlice";
import {
  setCredentials,
  logout,
} from "../../redux/slices/userSlices/allUsersAuthSlice";
import { toast } from "react-toastify";
import backendURL from "../../components/utils/config";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

const SignInPage = () => {
  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0 w-100 vh-100">
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
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-4 bg-white min-vh-50 min-vh-md-100">
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

const ButtonSpinner = () => (
  <span
    className="spinner-border spinner-border-sm me-2"
    role="status"
    aria-hidden="true"></span>
);

export const SignInForm = () => {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [facebookReady, setFacebookReady] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.usersauth);

  useEffect(() => {
    if (userInfo) navigate("/userdashboard");
  }, [navigate, userInfo]);

  useEffect(() => {
    const wasRedirected = sessionStorage.getItem("auth_redirect");
    if (!wasRedirected) dispatch(logout());
    sessionStorage.removeItem("auth_redirect");
  }, [dispatch]);

  const processGoogleResponse = useCallback(
    async (credential) => {
      setSocialLoading((prev) => ({ ...prev, google: true }));
      try {
        const res = await fetch(`${backendURL}/auth/individual/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ credential }),
        });
        const data = await res.json();

        if (data.status === "success") {
          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            })
          );
          toast.success("Google login successful!");
          navigate("/userdashboard");
        } else {
          toast.error(data.message || "Google login failed");
        }
      } catch (err) {
        toast.error("Network error. Please try again.");
      } finally {
        setSocialLoading((prev) => ({ ...prev, google: false }));
      }
    },
    [dispatch, navigate]
  );

  const processFacebookResponse = useCallback(
    async (accessToken) => {
      try {
        const res = await fetch(`${backendURL}/auth/individual/facebook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ accessToken }),
        });
        const data = await res.json();

        if (data.status === "success") {
          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            })
          );
          toast.success("Facebook login successful!");
          navigate("/userdashboard");
        } else {
          toast.error(data.message || "Facebook login failed");
        }
      } catch (err) {
        toast.error("Network error. Please try again.");
      } finally {
        setSocialLoading((prev) => ({ ...prev, facebook: false }));
      }
    },
    [dispatch, navigate]
  );

  // Initialize Facebook SDK
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
      setFacebookReady(true);
    };

    if (window.FB) {
      setFacebookReady(true);
    } else if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // Google OAuth using popup window (more reliable than FedCM)
  const handleGoogleClick = () => {
    setSocialLoading((prev) => ({ ...prev, google: true }));

    const redirectUri = window.location.origin + "/auth/google/callback";
    const scope = "openid email profile";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token id_token&scope=${encodeURIComponent(
      scope
    )}&nonce=${Date.now()}`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      "Google Sign In",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for the callback
    const checkPopup = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          setSocialLoading((prev) => ({ ...prev, google: false }));
          return;
        }

        // Check if redirected to our callback URL
        if (popup.location.href.includes(redirectUri)) {
          clearInterval(checkPopup);
          const hash = popup.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const idToken = params.get("id_token");
          popup.close();

          if (idToken) {
            processGoogleResponse(idToken);
          } else {
            toast.error("Google login failed. Please try again.");
            setSocialLoading((prev) => ({ ...prev, google: false }));
          }
        }
      } catch (e) {
        // Cross-origin error - popup is on Google's domain, keep waiting
      }
    }, 500);

    // Timeout after 2 minutes
    setTimeout(() => {
      clearInterval(checkPopup);
      if (popup && !popup.closed) popup.close();
      setSocialLoading((prev) => ({ ...prev, google: false }));
    }, 120000);
  };

  const handleFacebookClick = () => {
    if (!facebookReady || !window.FB) {
      toast.info("Facebook Sign-In is loading. Please wait...");
      return;
    }
    setSocialLoading((prev) => ({ ...prev, facebook: true }));

    try {
      window.FB.login(
        (response) => {
          if (response.authResponse) {
            processFacebookResponse(response.authResponse.accessToken);
          } else {
            toast.error("Facebook login cancelled or failed");
            setSocialLoading((prev) => ({ ...prev, facebook: false }));
          }
        },
        { scope: "email,public_profile", return_scopes: true }
      );
    } catch (err) {
      console.error("Facebook login error:", err);
      toast.error("Facebook login failed. Please try again later.");
      setSocialLoading((prev) => ({ ...prev, facebook: false }));
    }
  };

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });
  const handleShowHide = (e) => {
    e.preventDefault();
    setPasswordToggle(!passwordToggle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }

    setFormLoading(true);
    try {
      const res = await login({ ...user }).unwrap();
      if (res.status !== "success") {
        toast.error(res.message || "Login failed");
        setFormLoading(false);
        return;
      }
      dispatch(
        setCredentials({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      );
      toast.success("Login successful!");
      navigate("/userdashboard");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Login failed");
      setFormLoading(false);
    }
  };

  const isAnyLoading =
    formLoading || socialLoading.google || socialLoading.facebook;

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
            disabled={isAnyLoading}
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
            disabled={isAnyLoading}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={handleShowHide}
            type="button"
            disabled={isAnyLoading}>
            {passwordToggle ? <HidePassWordIcon /> : <ShowPassWordIcon />}
          </button>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              disabled={isAnyLoading}
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
          <button
            type="submit"
            className="btn btn-success btn-lg"
            disabled={isAnyLoading}>
            {formLoading ? (
              <>
                <ButtonSpinner />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="../signup" className="text-success fw-semibold">
            Sign Up
          </Link>
        </p>
      </form>

      <div className="d-flex align-items-center my-4">
        <hr className="flex-grow-1" />
        <span className="px-3 text-muted">or</span>
        <hr className="flex-grow-1" />
      </div>

      <div className="d-flex flex-column gap-2">
        <button
          onClick={handleGoogleClick}
          className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 py-2"
          type="button"
          disabled={isAnyLoading}>
          {socialLoading.google ? <ButtonSpinner /> : <GoogleIcon />}
          {socialLoading.google ? "Connecting..." : "Continue with Google"}
        </button>
        <button
          onClick={handleFacebookClick}
          className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 py-2"
          type="button"
          disabled={isAnyLoading}>
          {socialLoading.facebook ? <ButtonSpinner /> : <FacebookIcon />}
          {socialLoading.facebook ? "Connecting..." : "Continue with Facebook"}
        </button>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ShowPassWordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    fill="gray"
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
