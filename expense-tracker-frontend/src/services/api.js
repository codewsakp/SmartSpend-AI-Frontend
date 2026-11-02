import axios from "axios";
import { TOKEN_KEY, UNAUTHORIZED_EVENT } from "../utils/constants";

// Empty base URL (the default) means "same origin": in development Vite
// proxies /api/* to the backend. Set VITE_API_BASE_URL for a deployed backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach the signed-in user's JWT. The backend identifies the user from the
// token; the frontend never sends a user id.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 on a protected call means the token is missing, invalid or expired.
// (Login/register 401s are normal "wrong password" cases and are ignored.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const isAuthCall = url.startsWith("/api/auth/");

    if (status === 401 && !isAuthCall && localStorage.getItem(TOKEN_KEY)) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return Promise.reject(error);
  }
);

// Backend errors use ApiErrorResponse: { status, error, message, validationErrors }
export function getApiErrorMessage(error) {
  const data = error?.response?.data;
  const status = error?.response?.status;

  if (data?.validationErrors && Object.keys(data.validationErrors).length > 0) {
    return Object.values(data.validationErrors).join(". ");
  }
  if (typeof data === "object" && data?.message && data.message !== "No message available") {
    return data.message;
  }
  if (typeof data === "string" && data.trim()) return data;

  if (error?.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }
  if (!error?.response) {
    return error?.message && !error.isAxiosError
      ? error.message
      : "Unable to reach the server. Check that the backend is running.";
  }
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 404) return "The requested item was not found.";
  if (status >= 500) return "The server ran into a problem. Please try again.";

  return "Something went wrong. Please try again.";
}

// Field-level messages from the backend's validation handler, if any.
export function getFieldErrors(error) {
  return error?.response?.data?.validationErrors || {};
}

export default api;
