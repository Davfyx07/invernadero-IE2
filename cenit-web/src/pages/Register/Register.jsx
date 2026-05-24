import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { useI18n } from "../../hooks/useI18n";
import { useApiError } from "../../hooks/useApiError";
import PasswordInput from "../../components/PasswordInput";
import LanguageSelector from "../../components/LanguageSelector";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { theme } = useTheme();
  const { t } = useI18n();
  const { handleError } = useApiError();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError(t("register.error.passwordMatch"));
      return;
    }
    if (!form.terms) {
      setError(t("register.error.terms"));
      return;
    }

    setLoading(true);
    try {
      await register({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        telefono: form.telefono,
      });
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      handleError(err, { setFormError: setError, fallbackKey: "common.error.generic" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/api$/, "");
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  const inputClass =
    "w-full rounded-xl border border-cenit-200 dark:border-cenit-600 bg-cenit-50 dark:bg-cenit-900 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-cenit-800 dark:text-white";

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${theme === "dark" ? "bg-cenit-900" : "bg-cenit-50"}`}>
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-cenit-800 border border-cenit-100 dark:border-cenit-700 relative">
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>

        {/* Left brand */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400" fill="none">
            <g opacity="0.4">
              <path d="M50 350 Q100 200 200 150 Q300 200 350 350" stroke="white" strokeWidth="2" />
              <path d="M80 360 Q130 220 220 170 Q310 220 360 360" stroke="white" strokeWidth="1.5" />
              <path d="M110 370 Q160 240 240 190 Q320 240 370 370" stroke="white" strokeWidth="1" />
              <circle cx="200" cy="150" r="60" stroke="white" strokeWidth="1.5" />
              <circle cx="220" cy="170" r="45" stroke="white" strokeWidth="1" />
            </g>
          </svg>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Cenit</h1>
            </div>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-sm">
              {t("app.subtitle")}
            </p>
          </div>
          <div className="relative z-10 text-sm text-emerald-200/80">
            © 2026 Cenit Agricultural Systems
          </div>
        </div>

        {/* Right form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-cenit-800 dark:text-white mb-2">{t("register.title")}</h2>
            <p className="text-cenit-400">{t("register.subtitle")}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-cenit-700 dark:text-cenit-200 mb-1.5">{t("register.nombre")}</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-cenit-700 dark:text-cenit-200 mb-1.5">{t("register.apellido")}</label>
                <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cenit-700 dark:text-cenit-200 mb-1.5">{t("register.email")}</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <PasswordInput
                label={t("register.password")}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <PasswordInput
                label={t("register.confirmPassword")}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cenit-700 dark:text-cenit-200 mb-1.5">{t("register.telefono")}</label>
              <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} />
            </div>

            <label className="flex items-start gap-2 text-sm text-cenit-500 dark:text-cenit-300">
              <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} className="mt-0.5 rounded border-cenit-300 text-emerald-600 focus:ring-emerald-500" />
              <span>{t("register.terms")}</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-800 transition active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? t("common.loading") : t("register.submit")}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-cenit-100 dark:bg-cenit-700"></div>
            <span className="text-xs text-cenit-400 uppercase tracking-wider">{t("register.or")}</span>
            <div className="h-px flex-1 bg-cenit-100 dark:bg-cenit-700"></div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full rounded-xl border border-cenit-200 dark:border-cenit-600 bg-white dark:bg-cenit-800 px-4 py-3 text-sm font-medium text-cenit-700 dark:text-cenit-200 shadow-sm hover:bg-cenit-50 dark:hover:bg-cenit-700 transition flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.19 3.33v2.77h3.54c2.08-1.92 3.28-4.74 3.28-8.11z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.54-2.77c-.98.66-2.23 1.06-3.74 1.06-2.87 0-5.3-1.94-6.17-4.54H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.83 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.65 2.84c.87-2.6 3.3-4.53 6.17-4.53z" fill="#EA4335" />
            </svg>
            {t("register.google")}
          </button>

          <p className="mt-8 text-center text-sm text-cenit-400">
            {t("register.hasAccount")}{' '}
            <Link to="/login" className="font-medium text-emerald-700 hover:text-emerald-800">{t("register.login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
