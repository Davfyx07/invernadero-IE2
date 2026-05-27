import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosConfig";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("cenit_token");
  const setToken = (t) => localStorage.setItem("cenit_token", t);
  const clearToken = () => localStorage.removeItem("cenit_token");

  const fetchMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }
    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    await fetchMe();
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    // No hacemos login automático — el usuario debe verificar email primeroee
    return res.data;
  };

  const logout = () => {
    clearToken();
    setUser(null);
    window.location.href = "/login";
  };

  const oauthLogin = (token) => {
    setToken(token);
    window.location.href = "/";
  };

  return { user, loading, login, register, logout, oauthLogin, getToken, refresh: fetchMe };
}
