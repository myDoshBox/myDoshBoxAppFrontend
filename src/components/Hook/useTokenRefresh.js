import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshTokenMutation } from "../../redux/slices/userSlices/allUsersAPISlice";
import {
  setCredentials,
  logout,
} from "../../redux/slices/userSlices/allUsersAuthSlice";

export const useTokenRefresh = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.usersauth);
  const [refreshToken] = useRefreshTokenMutation();
  const refreshTimerRef = useRef(null);

  useEffect(() => {
    if (!userInfo?.token) return;

    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Refresh token 1 minute before expiry (14 minutes for a 15-minute token)
    const REFRESH_TIME = 14 * 60 * 1000; // 14 minutes in milliseconds

    const scheduleRefresh = async () => {
      refreshTimerRef.current = setTimeout(async () => {
        try {
          console.log("Refreshing token...");
          const response = await refreshToken().unwrap();

          if (response.status === "success") {
            dispatch(setCredentials(response));
            console.log("Token refreshed successfully");
            // Schedule next refresh
            scheduleRefresh();
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
          dispatch(logout());
          window.location.href = "/signin";
        }
      }, REFRESH_TIME);
    };

    scheduleRefresh();

    // Cleanup on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [userInfo, refreshToken, dispatch]);
};
