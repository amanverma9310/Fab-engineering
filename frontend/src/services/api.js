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

// Public endpoints that don't require CSRF (protected by Origin/Referer validation)
const PUBLIC_MUTATION_ENDPOINTS = ["/contact", "/inquiries"];

function isPublicMutationEndpoint(url) {
  if (!url) return false;
  const pathname = url.split("?")[0];
  return PUBLIC_MUTATION_ENDPOINTS.some((endpoint) => pathname === endpoint || pathname.startsWith(endpoint + "/"));
}

// Clear old cookies that may conflict with new CSRF/origin setup
function clearLegacyCookies() {
  const cookiesToClear = ["csrf_token", "token"];
  cookiesToClear.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
  });
}

// Run once on module load to clean up stale cookies
if (typeof window !== "undefined") {
  clearLegacyCookies();
}

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
  const method = config.method?.toLowerCase();
  const url = config.url || "";

  if (unsafeMethods.includes(method) && !isPublicMutationEndpoint(url)) {
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
    // Log actual error for debugging
    if (err.response) {
      console.error("[API Error]", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("[API Network Error]", err.message);
    }
    return Promise.reject({ message, status: err.response?.status });
  }
);

export { ensureCsrfToken, clearCsrfToken, clearLegacyCookies };
export default api;
