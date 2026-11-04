
import axios from "axios";

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach the current user's JWT to protected API requests.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("expense_tracker_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export function getApiErrorMessage(error) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (error?.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }

  if (!error?.response) {
    return "Unable to connect to the server. Check that the backend is running.";
  }

  return "Something went wrong. Please try again.";
}

export default api;
