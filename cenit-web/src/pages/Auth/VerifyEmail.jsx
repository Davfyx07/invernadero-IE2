import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useToast } from "../../components/Toast";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { show } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("Ingresa el código de 6 dígitos");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, code });
      show("Correo verificado correctamente", "success");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Código incorrecto");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post("/auth/resend-otp?email=" + encodeURIComponent(email));
      show("Código reenviado", "success");
    } catch {
      show("Error al reenviar", "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cenit-50 dark:bg-cenit-950">
      <div className="w-full max-w-md bg-white dark:bg-cenit-800 rounded-2xl border border-cenit-100 dark:border-cenit-700 p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-cenit-800 dark:text-white">Verifica tu correo</h2>
          <p className="text-sm text-cenit-500 dark:text-cenit-300 mt-1">
            Enviamos un código de 6 dígitos a <span className="font-medium text-cenit-700 dark:text-cenit-200">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cenit-700 dark:text-cenit-200 mb-1.5">
              Código de verificación
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full rounded-xl border border-cenit-200 dark:border-cenit-600 bg-cenit-50 dark:bg-cenit-900 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-cenit-800 dark:text-white placeholder:text-cenit-300 text-center tracking-[0.5em] font-mono"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-emerald-700 dark:text-emerald-300 hover:underline disabled:opacity-60"
          >
            {resending ? "Reenviando..." : "Reenviar código"}
          </button>
        </div>
      </div>
    </div>
  );
}
