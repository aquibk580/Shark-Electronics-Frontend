import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://shark-electronics.vercel.app"
      : "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use((config) => {
  let auth = localStorage.getItem("auth");
  if (auth) {
    try {
      auth = JSON.parse(auth);
      const token = auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to parse auth from localStorage:", error);
    }
  }
  return config;
});


// Add a response interceptor to handle token expiration globally
api.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    // Check if the error is due to an expired token
    if (error.response?.status === 401 && error.response?.data?.logout) {
      localStorage.removeItem("token"); // Remove token from storage
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error); // Reject error for further handling
  }
);

export default api;
