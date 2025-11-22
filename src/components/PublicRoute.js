// src/components/PublicRoute.jsx
// Redirects logged-in users away from auth pages (signin, signup)

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { userInfo } = useSelector((state) => state.usersauth);
  return userInfo ? <Navigate to="/userdashboard" replace /> : <Outlet />;
};

export default PublicRoute;
