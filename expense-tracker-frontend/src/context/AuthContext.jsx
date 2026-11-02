import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import authService from "../services/authService";
import { TOKEN_KEY, UNAUTHORIZED_EVENT, USER_KEY } from "../utils/constants";
import { isTokenExpired } from "../utils/jwt";

const AuthContext = createContext(null);

function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function readStoredSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");

    if (!token || !user || isTokenExpired(token)) {
      clearStoredSession();
      return { token: null, user: null };
    }
    return { token, user };
  } catch {
    clearStoredSession();
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession({ token: null, user: null });
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);

    if (!response?.token) {
      throw new Error("The server did not return a login token.");
    }

    // Only non-sensitive profile details are kept next to the token.
    const user = { id: response.id, name: response.name, email: response.email };

    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setSession({ token: response.token, user });

    return user;
  }, []);

  const register = useCallback((details) => authService.register(details), []);

  // Signed out automatically when the API reports an expired/invalid token.
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      token: session.token,
      user: session.user,
      isAuthenticated: Boolean(session.token),
      login,
      register,
      logout,
    }),
    [session, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }
  return context;
}
