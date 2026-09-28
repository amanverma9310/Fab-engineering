import axios from "axios";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

function getCsrfToken() {
  const match = document.cookie.match(new RegExp(`(^| )${CSRF_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] : null;
}

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const unsafeMethods = ["post", "put", "patch", "delete"];
  if (unsafeMethods.includes(config.method?.toLowerCase())) {
    const token = getCsrfToken();
    if (token) {
      config.headers[CSRF_HEADER_NAME] = token;
    }
  }
  return config;
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
