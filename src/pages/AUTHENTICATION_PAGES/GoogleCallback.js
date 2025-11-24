// src/pages/auth/GoogleCallback.jsx
import { useEffect } from "react";

const GoogleCallback = () => {
  useEffect(() => {
    try {
      // Get the hash fragment from URL
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const idToken = params.get("id_token");
      const error = params.get("error");

      if (error) {
        console.error("Google OAuth error:", error);
        // Send error to parent
        if (window.opener) {
          window.opener.postMessage(
            { type: "GOOGLE_AUTH_ERROR", error },
            window.location.origin
          );
        }
        setTimeout(() => window.close(), 1000);
        return;
      }

      if (idToken) {
        // Send token to parent window
        if (window.opener) {
          window.opener.postMessage(
            { type: "GOOGLE_AUTH_SUCCESS", idToken },
            window.location.origin
          );
          // Close popup after sending message
          setTimeout(() => window.close(), 500);
        } else {
          // If not in popup, redirect to signin
          console.error("Not opened in popup window");
          window.location.href = "/signin";
        }
      } else {
        console.error("No id_token found in URL");
        setTimeout(() => window.close(), 1000);
      }
    } catch (error) {
      console.error("Error in callback:", error);
      if (window.opener) {
        window.opener.postMessage(
          { type: "GOOGLE_AUTH_ERROR", error: error.message },
          window.location.origin
        );
      }
      setTimeout(() => window.close(), 1000);
    }
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <div
          className="spinner-border text-success mb-3"
          role="status"
          style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted">Completing sign in...</h5>
        <p className="text-muted small">This window will close automatically</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
