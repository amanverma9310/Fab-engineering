import axios from "axios";

// Single source of truth for the backend base URL — never hardcode it in
// components. Falls back to localhost for local development.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// The origin (no /api suffix) — used to resolve locally-uploaded file paths
// like "/uploads/products/xyz.jpg" into a full URL.
export const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send/receive the httpOnly admin auth cookie
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message ||
      (err.request ? "Can't reach the server. Please try again shortly." : err.message);
    return Promise.reject({ message, status: err.response?.status });
  }
);

export default api;
