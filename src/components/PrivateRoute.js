import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.usersauth);

  return userInfo ? <Outlet /> : <Navigate to="/signin" replace />;
  //   return (
  //     <div>PrivateRoute</div>
  //   )
};

export default PrivateRoute;
