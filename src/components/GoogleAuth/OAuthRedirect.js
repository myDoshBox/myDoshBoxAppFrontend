const OAuthRedirect = () => {
  const handleGoogleOAuth = () => {
    const clientId =
      "523049804056-br4u17er496b94oqc2s22jj5gv1mk009.apps.googleusercontent.com";
    // const redirectUri = "http://localhost:5000/auth/individual/oauth/callback";
    const redirectUri = "https://mydoshbox.vercel.app/userdashboard";
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
    );
    const responseType = "code";
    const authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=consent`;

    console.log(authorizeUrl);

    window.location.href = authorizeUrl;
  };

  return <button onClick={handleGoogleOAuth}>Sign in with Google</button>;
};

export default OAuthRedirect;
