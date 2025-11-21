const backendURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_URL
    : "https://mydoshbox-be.vercel.app";

export default backendURL;
