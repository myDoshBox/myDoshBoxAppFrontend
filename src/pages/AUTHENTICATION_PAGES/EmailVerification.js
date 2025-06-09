/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useVerifyUserMutation } from "../../redux/slices/userSlices/allUsersAPISlice";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyUser, { isLoading }] = useVerifyUserMutation();

  const getQueryParameter = (param) => {
    const params = new URLSearchParams(location.search);
    return params.get(param);
  };

  const token = getQueryParameter("token");
  // console.log("yyyyyyy", token);

  const verifyEmail = async () => {
    if (!token) {
      toast.error("Token is missing.");
      return;
    }

    try {
      const res = await verifyUser(token).unwrap();
      // if (res?.status === "true") {
      //   dispatch(setCredentials({ ...res }));
      //   navigate("/userdashboard");
      // }

      if (res?.status === "false") {
        toast.error(res?.message);
        // navigate("/signin");
      } else {
        toast.success(res?.message);
        navigate("/signin");
      }
    } catch (err) {
      console.error(err);
      // toast.error(err?.data?.message || err?.error);
      toast.error(err?.data?.message);
    }

    // try {
    //   const response = await verifyUser(token).unwrap();
    //   console.log(response);
    //   toast.success(response?.message);
    //   navigate("/signin");
    // } catch (error) {
    //   console.error("Error response:", error);
    //   toast.error(error?.data?.message);
    // }
  };

  useEffect(() => {
    verifyEmail();
  }, [token, navigate, verifyUser]);

  return (
    <div>
      <ToastContainer />
      <h1>Email Verification</h1>
      {isLoading ? (
        <p>Verifying...</p>
      ) : (
        <>
          <p>
            Your email has been successfully verified. Please proceed to login.
          </p>
          <Link
            to="/signin"
            className="text-decoration-none ms-1 btn btn-success"
            style={{ fontSize: "14px" }}
          >
            Sign In
          </Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
