import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axiosConfig";
import PasswordInput from "../../components/PasswordInput";
import { useToast } from "../../components/Toast";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { show } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isFirstLogin = location.state?.firstLogin === true;
  const isRecovery = location.state?.recovery === true;
  const email = location.state?.email || "";
  const code = location.state?.code || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      if (isRecovery) {
        await api.post("/auth/reset-password", { email, code, newPassword });
      } else {
        await api.post("/auth/change-password", {
          currentPassword,
          newPassword,
        });
      }
      setSuccess(true);
      show("Contraseña actualizada correctamente", "success");
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cenit-50 dark:bg-cenit-950">
        <div className="w-full max-w-md bg-white dark:bg-cenit-800 rounded-2xl border border-cenit-100 dark:border-cenit-700 p-8 shadow-sm text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-cenit-800 dark:text-white mb-2">
            {isRecovery ? "Contraseña restablecida" : "Contraseña actualizada"}
          </h2>
          <p className="text-sm text-cenit-500 dark:text-cenit-300 mb-6">
            Tu contraseña se ha cambiado correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-sm font-medium transition"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

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
            {isFirstLogin ? "Cambia tu contraseña" : isRecovery ? "Nueva contraseña" : "Cambiar contraseña"}
          </h2>
          <p className="text-sm text-cenit-500 dark:text-cenit-300 mt-1">
            {isFirstLogin
              ? "Es obligatorio cambiar tu contraseña temporal antes de continuar."
              : "Crea una contraseña segura para tu cuenta."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isRecovery && (
            <PasswordInput
              label="Contraseña actual"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          )}
          <PasswordInput
            label="Nueva contraseña"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <PasswordInput
            label="Confirmar nueva contraseña"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
