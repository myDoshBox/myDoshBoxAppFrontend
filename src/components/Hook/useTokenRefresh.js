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
  const lastRefreshAttemptRef = useRef(0);
  const mountedRef = useRef(true);

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

    const now = Date.now();
    if (now - lastRefreshAttemptRef.current < 5000) {
      console.log("⏱️ Too soon since last refresh attempt, skipping...");
      return null;
    }

    isRefreshingRef.current = true;
    lastRefreshAttemptRef.current = now;

    try {
      console.log("🔄 Refreshing token via RTK Query...");

      const refreshTokenValue = userInfo?.refreshToken;

      console.log("📤 Refresh attempt:", {
        hasCookies: true,
        hasBodyFallback: !!refreshTokenValue,
        tokenLength: refreshTokenValue?.length || 0,
      });

      // Send refresh token in body as fallback (in case cookies are blocked)
      const response = await refreshToken(
        refreshTokenValue ? { refreshToken: refreshTokenValue } : undefined
      ).unwrap();

      if (!mountedRef.current) {
        console.log("⚠️ Component unmounted, skipping state update");
        return null;
      }

      console.log("Refresh response:", {
        status: response.status,
        hasAccessToken: !!response.accessToken,
        hasRefreshToken: !!response.refreshToken,
      });

      if (response.status === "success" && response.accessToken) {
        dispatch(
          setCredentials({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user,
          })
        );
        console.log("Token refreshed and stored successfully");
        return response.accessToken;
      } else {
        console.error("❌ Unexpected refresh response format:", response);
        return null;
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", {
        error,
        status: error?.status,
        data: error?.data,
        message: error?.data?.message || error?.message,
      });

      if (!mountedRef.current) {
        return null;
      }

      // Only logout on auth errors
      if (
        error?.status === 401 ||
        error?.status === 403 ||
        error?.originalStatus === 401 ||
        error?.originalStatus === 403
      ) {
        console.log("🚪 Authentication failed, logging out...");
        dispatch(logout());
        window.location.href = "/signin";
      } else if (error?.status === 500) {
        // Server error - don't logout immediately, will retry
        console.log("⚠️ Server error during refresh, will retry later");
      } else {
        console.log("⚠️ Network/server error, will retry later");
      }
      return null;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [refreshToken, dispatch, userInfo]);

  const scheduleNextRefresh = useCallback(
    (token) => {
      clearRefreshTimer();

      if (!token) {
        console.log("⚠️ No token provided to schedule refresh");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const expiresAt = decoded.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        // Refresh 2 minutes before expiry
        const bufferTime = 2 * 60 * 1000;
        const refreshTime = Math.max(0, timeUntilExpiry - bufferTime);

        if (timeUntilExpiry <= 0) {
          console.log("⚠️ Token already expired, refreshing immediately");
          performRefresh();
          return;
        }

        if (refreshTime === 0) {
          console.log("⚠️ Token expiring very soon, refreshing immediately");
          performRefresh().then((newToken) => {
            if (newToken && mountedRef.current) {
              scheduleNextRefresh(newToken);
            }
          });
          return;
        }

        const expiryMinutes = Math.floor(timeUntilExpiry / 60000);
        const refreshMinutes = Math.floor(refreshTime / 60000);

        console.log(
          `⏰ Token expires in ${expiryMinutes}m, scheduling refresh in ${refreshMinutes}m`
        );

        refreshTimerRef.current = setTimeout(async () => {
          if (!mountedRef.current) return;

          const newToken = await performRefresh();
          if (newToken && mountedRef.current) {
            scheduleNextRefresh(newToken);
          }
        }, refreshTime);
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        // Token is invalid, logout
        dispatch(logout());
        window.location.href = "/signin";
      }
    },
    [clearRefreshTimer, performRefresh, dispatch]
  );

  const checkAndRefreshToken = useCallback(async () => {
    const currentToken = userInfo?.token || userInfo?.accessToken;

    if (!currentToken) {
      console.log("⚠️ No token found in userInfo");
      return;
    }

    try {
      const decoded = jwtDecode(currentToken);
      const expiresAt = decoded.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      const minutes = Math.floor(timeUntilExpiry / 60000);
      const seconds = Math.round((timeUntilExpiry % 60000) / 1000);

      console.log(`🔍 Token expires in ${minutes}m ${seconds}s`);

      // If token expired or expiring soon (< 3 min)
      if (timeUntilExpiry < 3 * 60 * 1000) {
        console.log("⚠️ Token expired or expiring soon, refreshing...");
        const newToken = await performRefresh();
        if (newToken && mountedRef.current) {
          scheduleNextRefresh(newToken);
        }
      } else if (!refreshTimerRef.current) {
        // Token valid, schedule future refresh
        scheduleNextRefresh(currentToken);
      }
    } catch (error) {
      console.error("❌ Error checking token:", error);
      const newToken = await performRefresh();
      if (newToken && mountedRef.current) {
        scheduleNextRefresh(newToken);
      }
    }
  }, [userInfo, performRefresh, scheduleNextRefresh]);

  useEffect(() => {
    mountedRef.current = true;

    if (!userInfo?.token && !userInfo?.accessToken) {
      clearRefreshTimer();
      return;
    }

    console.log("🚀 Token refresh hook initialized");
    checkAndRefreshToken();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && mountedRef.current) {
        console.log("👁️ Tab visible, checking token...");
        if (!refreshTimerRef.current) {
          checkAndRefreshToken();
        }
      }
    };

    const handleOnline = () => {
      if (mountedRef.current) {
        console.log("🌐 Back online, checking token...");
        checkAndRefreshToken();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    return () => {
      mountedRef.current = false;
      clearRefreshTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
    };
  }, [
    userInfo?.token,
    userInfo?.accessToken,
    checkAndRefreshToken,
    clearRefreshTimer,
  ]);

  return null;
};
