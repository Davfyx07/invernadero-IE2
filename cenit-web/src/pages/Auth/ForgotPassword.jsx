import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useToast } from "../../components/Toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { show } = useToast();
  const [step, setStep] = useState("email"); // email | otp
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      show("Código enviado a tu correo", "success");
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Correo no registrado");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("Ingresa el código de 6 dígitos");
      return;
    }
    // Verificamos OTP llamando a verify-otp con tipo PASSWORD_RECOVERY
    // Pero el backend no tiene un endpoint específico para esto.
    // Mejor: pasamos directo a cambiar contraseña y el backend valida allí
    navigate("/change-password", { state: { recovery: true, email, code } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cenit-50 dark:bg-cenit-950">
      <div className="w-full max-w-md bg-white dark:bg-cenit-800 rounded-2xl border border-cenit-100 dark:border-cenit-700 p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-cenit-800 dark:text-white">
            {step === "email" ? "Recuperar contraseña" : "Verificar código"}
          </h2>
          <p className="text-sm text-cenit-500 dark:text-cenit-300 mt-1">
            {step === "email"
              ? "Ingresa tu correo y te enviaremos un código de recuperación."
              : `Ingresa el código de 6 dígitos enviado a ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cenit-700 dark:text-cenit-200 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                className="w-full rounded-xl border border-cenit-200 dark:border-cenit-600 bg-cenit-50 dark:bg-cenit-900 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-cenit-800 dark:text-white placeholder:text-cenit-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-sm text-cenit-500 dark:text-cenit-300 hover:text-cenit-700 dark:hover:text-cenit-200 transition"
            >
              Volver al inicio de sesión
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cenit-700 dark:text-cenit-200 mb-1.5">
                Código de recuperación
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
              Continuar
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm text-cenit-500 dark:text-cenit-300 hover:text-cenit-700 dark:hover:text-cenit-200 transition"
            >
              Usar otro correo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
