import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase";

const OAuth = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    if (isSigningIn) return; // Prevent multiple requests

    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      //   console.log("OAuth Callback Response:", { token, user });
      // Handle successful login
    } catch (error) {
      if (error.code === "auth/cancelled-popup-request") {
        console.warn("Popup request was cancelled.");
      } else {
        console.error("Error during OAuth callback:", error);
      }
    } finally {
      setIsSigningIn(false); // Re-enable the button after the request completes
    }
  };

  return (
    <button onClick={handleLogin} disabled={isSigningIn}>
      {isSigningIn ? "Signing in..." : "Login with Google"}
    </button>
  );
};

export default OAuth;
