import axios from "axios";

const CSRF_HEADER_NAME = "x-csrf-token";

let csrfToken = null;
let csrfTokenPromise = null;

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  if (csrfTokenPromise) return csrfTokenPromise;

  csrfTokenPromise = (async () => {
    try {
      const res = await axios.get(`${API_URL}/csrf-token`, { withCredentials: true });
      csrfToken = res.data?.csrfToken || null;
      return csrfToken;
    } catch {
      csrfToken = null;
      return null;
    } finally {
      csrfTokenPromise = null;
    }
  })();

  return csrfTokenPromise;
}

function clearCsrfToken() {
  csrfToken = null;
  csrfTokenPromise = null;
}

api.interceptors.request.use(async (config) => {
  const unsafeMethods = ["post", "put", "patch", "delete"];
  if (unsafeMethods.includes(config.method?.toLowerCase())) {
    const token = await ensureCsrfToken();
    if (token) {
      config.headers[CSRF_HEADER_NAME] = token;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 403 && err.response?.data?.message === "Invalid CSRF token") {
      clearCsrfToken();
    }
    const message =
      err.response?.data?.message ||
      (err.request ? "Can't reach the server. Please try again shortly." : err.message);
    return Promise.reject({ message, status: err.response?.status });
  }
);

export { ensureCsrfToken, clearCsrfToken };
export default api;
