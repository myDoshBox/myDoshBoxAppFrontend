// src/pages/auth/GoogleCallback.jsx
// This is a simple callback page that just closes itself
// The parent window handles extracting the token from the URL

import { useEffect } from "react";

const GoogleCallback = () => {
  useEffect(() => {
    // This page is loaded in a popup
    // The parent window will read the URL hash and extract the token
    // We just need to keep this page open briefly so parent can read it
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-success mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
