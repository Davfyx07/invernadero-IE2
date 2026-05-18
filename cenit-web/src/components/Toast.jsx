import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-80">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}

function ToastItem({ toast, onDismiss }) {
  const colors = {
    success: "bg-emerald-700",
    error: "bg-red-700",
    info: "bg-blue-700",
    warning: "bg-orange-700",
  };

  return (
    <div className={["flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-lg animate-toast-in", colors[toast.type] || colors.info].join(" ")}>
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button onClick={onDismiss} className="opacity-80 hover:opacity-100">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
