import { useEffect } from "react";
import { useLazyCreateIndividualGoogleQuery } from "../../redux/slices/userSlices/allUsersAPISlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/userSlices/allUsersAuthSlice";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const [triggerGoogleAuth, { data, error, isLoading }] =
    useLazyCreateIndividualGoogleQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log(code);

    if (code) {
      triggerGoogleAuth(code);
    }
  }, [triggerGoogleAuth]);

  useEffect(() => {
    if (data) {
      dispatch(setCredentials(data));
      navigate("/userdashboard"); // Redirect to your app's main page after login
    }
  }, [data, dispatch, navigate]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Logging you in...</div>;
};

export default OAuthCallback;
