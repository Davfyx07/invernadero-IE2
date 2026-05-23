import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/axiosConfig";
import { useI18n } from "../hooks/useI18n";

export default function NotificationBell() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        api.get("/notificaciones/count"),
        api.get("/notificaciones/unread"),
      ]);
      setCount(countRes.data);
      setNotifs(listRes.data || []);
    } catch {
      // silently fail if not authenticated
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, [fetchData]);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const marcarLeida = async (id) => {
    try {
      await api.put(`/notificaciones/${id}/leer`);
      setNotifs((prev) => prev.filter((n) => n.id !== id));
      setCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((v) => !v); if (!open) fetchData(); }}
        className="relative p-2 rounded-xl hover:bg-cenit-50 dark:hover:bg-cenit-700 transition"
        aria-label={t("notification.title")}
      >
        <svg
          className="w-5 h-5 text-cenit-600 dark:text-cenit-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-red-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white dark:ring-cenit-800">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-cenit-900 rounded-xl shadow-2xl border border-cenit-100 dark:border-cenit-700 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-cenit-100 dark:border-cenit-700 flex items-center justify-between">
            <span className="text-sm font-semibold text-cenit-800 dark:text-white">
              {t("notification.title")}
            </span>
            {count > 0 && (
              <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-full font-medium">
                {count} {t("notification.unread")}
              </span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-cenit-400">{t("notification.loading")}</div>
            ) : notifs.length === 0 ? (
              <div className="p-6 text-center text-sm text-cenit-400">
                {t("notification.empty")}
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 hover:bg-cenit-50 dark:hover:bg-cenit-800/50 border-b border-cenit-50 dark:border-cenit-800 last:border-0 transition cursor-pointer"
                  onClick={() => marcarLeida(n.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cenit-800 dark:text-cenit-100 truncate">
                        {n.titulo}
                      </p>
                      <p className="text-xs text-cenit-500 dark:text-cenit-400 mt-0.5 line-clamp-2">
                        {n.mensaje}
                      </p>
                      <p className="text-[10px] text-cenit-300 dark:text-cenit-500 mt-1">
                        {n.creadoEn
                          ? new Date(n.creadoEn).toLocaleString("es-ES", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
