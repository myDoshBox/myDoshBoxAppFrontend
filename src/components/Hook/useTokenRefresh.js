import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshTokenMutation } from "../../redux/slices/userSlices/allUsersAPISlice";
import {
  setCredentials,
  logout,
} from "../../redux/slices/userSlices/allUsersAuthSlice";
import { jwtDecode } from "jwt-decode";

export const useTokenRefresh = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.usersauth);
  const [refreshToken] = useRefreshTokenMutation();
  const refreshTimerRef = useRef(null);
  const isRefreshingRef = useRef(false);

  // Clear timer helper
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const performRefresh = useCallback(async () => {
    if (isRefreshingRef.current) {
      console.log("🔒 Refresh already in progress, skipping...");
      return null;
    }

    isRefreshingRef.current = true;

    try {
      console.log("🔄 Refreshing token...");
      const response = await refreshToken().unwrap();

      if (response.status === "success") {
        dispatch(setCredentials(response));
        console.log("✅ Token refreshed successfully");
        // Return the new token so we can use it immediately
        return response.accessToken;
      }
      return null;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      dispatch(logout());
      window.location.href = "/signin";
      return null;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [refreshToken, dispatch]);

  useEffect(() => {
    if (!userInfo?.token) {
      clearRefreshTimer();
      return;
    }

    const scheduleNextRefresh = (token) => {
      clearRefreshTimer();

      try {
        const decoded = jwtDecode(token);
        const expiresAt = decoded.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        // Refresh 1 minute before expiry
        const refreshTime = timeUntilExpiry - 60 * 1000;

        if (refreshTime <= 0) {
          console.log("⚠️ Token already expired or expiring very soon");
          return;
        }

        console.log(
          `⏰ Token expires in ${Math.round(timeUntilExpiry / 1000)}s, ` +
            `scheduling refresh in ${Math.round(refreshTime / 1000)}s`
        );

        refreshTimerRef.current = setTimeout(async () => {
          const newToken = await performRefresh();
          if (newToken) {
            // Use the NEW token to schedule, not the old one from closure
            scheduleNextRefresh(newToken);
          }
        }, refreshTime);
      } catch (error) {
        console.error("❌ Error decoding token:", error);
      }
    };

    const checkAndRefreshToken = async () => {
      try {
        const decoded = jwtDecode(userInfo.token);
        const expiresAt = decoded.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        console.log(
          `🔍 Token expires in ${Math.round(timeUntilExpiry / 1000)} seconds`
        );

        // If token is expired or expires within 1 minute, refresh immediately
        if (timeUntilExpiry < 60 * 1000) {
          console.log(
            "⚠️ Token expired or expiring soon, refreshing immediately..."
          );
          const newToken = await performRefresh();
          if (newToken) {
            scheduleNextRefresh(newToken);
          }
        } else {
          // Token is still valid, schedule refresh
          scheduleNextRefresh(userInfo.token);
        }
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        await performRefresh();
      }
    };

    // Check token on mount
    checkAndRefreshToken();

    // Handle tab visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("👁️ Tab became visible, checking token...");
        checkAndRefreshToken();
      }
    };

    // Handle coming back online
    const handleOnline = () => {
      console.log("🌐 Back online, checking token...");
      checkAndRefreshToken();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    return () => {
      clearRefreshTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
    };
  }, [userInfo?.token, performRefresh, clearRefreshTimer]);
};
