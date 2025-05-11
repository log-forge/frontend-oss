import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer
  ? `${process.env.VITE_BACKEND_SERVICE_HOST}:${process.env.VITE_BACKEND_SERVICE_PORT}`
  : `${window.location.protocol}//${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}`;
console.log("Base URL:", baseURL);

// Create an Axios instance
const axiosClient = axios.create({ baseURL });
// only run this in the browser
if (!isServer) {
  // Add a request interceptor to include the CSRF token in headers
  axiosClient.interceptors.request.use(async (config) => {
    // Add token to request body for POST/PUT/PATCH methods
    if (config.method?.toLowerCase() !== "get" && config.data) {
      // Fetch CSRF token from a meta tag or cookie
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

      if (!csrfToken) {
        console.warn("CSRF token not found. This request may fail validation.");
      }

      if (csrfToken) {
        // Add token to body with correct key name
        if (config.data instanceof FormData) {
          // For FormData, append the token
          config.data.append("csrf", csrfToken);
        } else if (typeof config.data === "string") {
          // For URL encoded data
          const searchParams = new URLSearchParams(config.data);
          searchParams.append("csrf", csrfToken);
          config.data = searchParams.toString();
        } else {
          // For JSON data
          config.data = {
            ...config.data,
            csrf: csrfToken,
          };
        }
      }
    }

    return config;
  });
}

export default axiosClient;
