import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useToast } from "../../components/Toast";
import { useI18n } from "../../hooks/useI18n";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { show } = useToast();
  const { t } = useI18n();
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
      show(t("common.success"), "success");
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || t("common.error.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError(t("verify.error.codeLength"));
      return;
    }
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
            {step === "email" ? t("forgot.title") : t("forgot.title")}
          </h2>
          <p className="text-sm text-cenit-500 dark:text-cenit-300 mt-1">
            {step === "email"
              ? t("forgot.subtitle")
              : t("forgot.verifySubtitle", email)}
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
                {t("login.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.emailPlaceholder")}
                className="w-full rounded-xl border border-cenit-200 dark:border-cenit-600 bg-cenit-50 dark:bg-cenit-900 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-cenit-800 dark:text-white placeholder:text-cenit-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60"
            >
              {loading ? t("forgot.sending") : t("forgot.sendBtn")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-sm text-cenit-500 dark:text-cenit-300 hover:text-cenit-700 dark:hover:text-cenit-200 transition"
            >
              {t("forgot.backToLogin")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cenit-700 dark:text-cenit-200 mb-1.5">
                {t("verify.codeLabel")}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder={t("verify.codePlaceholder")}
                className="w-full rounded-xl border border-cenit-200 dark:border-cenit-600 bg-cenit-50 dark:bg-cenit-900 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-cenit-800 dark:text-white placeholder:text-cenit-300 text-center tracking-[0.5em] font-mono"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60"
            >
              {t("forgot.continueBtn")}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm text-cenit-500 dark:text-cenit-300 hover:text-cenit-700 dark:hover:text-cenit-200 transition"
            >
              {t("forgot.useOtherEmail")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
