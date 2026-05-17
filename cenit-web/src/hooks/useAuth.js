import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        // Intenta un endpoint protegido como ping de sesión
        const res = await api.get("/usuarios?page=0&size=1");
        if (!cancelled) setUser(res.data?.content?.[0] ?? true);
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
        } else {
          // Backend no disponible → asume autenticado para no bloquear dev
          setUser(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    check();
    return () => { cancelled = true; };
  }, []);

  const logout = () => {
    window.location.href = "http://localhost:8080/logout";
  };

  return { user, loading, logout };
}
