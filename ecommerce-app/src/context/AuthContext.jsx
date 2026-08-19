import { createContext, useContext, useState, useCallback } from "react";
import { login as apiLogin } from "../api/fakeStoreApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [username, setUsername] = useState(() => sessionStorage.getItem("username"));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (user, pass) => {
    setLoading(true);
    setError(null);
    try {
      const jwt = await apiLogin(user, pass);
      // sessionStorage (not localStorage): token dies with the tab/session,
      // reducing the XSS/token-theft exposure window on a public-facing SPA.
      sessionStorage.setItem("token", jwt);
      sessionStorage.setItem("username", user);
      setToken(jwt);
      setUsername(user);
      return true;
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Identifiants invalides."
          : "Le service d'authentification est indisponible."
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, username, isAuthenticated: Boolean(token), login, logout, error, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
