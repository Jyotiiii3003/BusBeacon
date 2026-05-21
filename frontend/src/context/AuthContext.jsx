import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const token = localStorage.getItem("busbeacon_token");

  useEffect(() => {
    async function load() {
      if (!token) {
        setBooting(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("busbeacon_token");
      } finally {
        setBooting(false);
      }
    }
    load();
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    booting,
    async login(email, password) {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("busbeacon_token", data.token);
      setUser(data.user);
    },
    logout() {
      localStorage.removeItem("busbeacon_token");
      setUser(null);
    }
  }), [user, token, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
