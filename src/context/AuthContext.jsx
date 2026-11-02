import { createContext, useContext, useMemo, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "expense_tracker_token";
const USER_KEY = "expense_tracker_user";

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);

  async function login(credentials) {
    const response = await authService.login(credentials);

    if (!response?.token) {
      throw new Error("The login response did not contain a JWT token.");
    }

    const userDetails = {
      id: response.id,
      name: response.name,
      email: response.email,
    };

    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(userDetails));

    setToken(response.token);
    setUser(userDetails);

    return response;
  }

  async function register(details) {
    return authService.register(details);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
