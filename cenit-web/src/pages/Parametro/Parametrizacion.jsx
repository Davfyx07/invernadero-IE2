import { useI18n } from "../../hooks/useI18n";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import ParametroSection from "../../components/ParametroSection";

function iconScale() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m16 16 3-8 3 8c-.87.63-1.92 1-3 1s-2.13-.37-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.63-1.92 1-3 1s-2.13-.37-3-1Z" />
      <path d="M7 21h10" />
    </svg>
  );
}

function iconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function iconSprout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 20h10" />
      <path d="M10 20c0-4.5 2-8 7-10" />
      <path d="M7 20c0-3.5 1.5-6 5-8" />
      <path d="M12 20V4" />
      <path d="M12 4c0 0 3 2 3 6" />
      <path d="M12 4c0 0-3 2-3 6" />
    </svg>
  );
}

export default function Parametrizacion() {
  const { t } = useI18n();
  const { user, loading, refresh } = useAuth();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin = user?.rol === "ADMIN";
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-16 bg-white dark:bg-cenit-800 border-b border-cenit-100 dark:border-cenit-700 flex items-center px-6">
        <div>
          <h2 className="text-lg font-semibold text-cenit-800 dark:text-white">{t("nav.parametrizacion")}</h2>
          <p className="text-xs text-cenit-400">Gestión de catálogos del sistema</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <ParametroSection
          tipo="UNIDAD_MEDIDA"
          title="Unidades de Medida"
          icon={iconScale()}
        />
        <ParametroSection
          tipo="TIPO_INSUMO"
          title="Tipos de Insumo"
          icon={iconBox()}
        />
        <ParametroSection
          tipo="ESTADO_CULTIVO"
          title="Estados de Cultivo"
          icon={iconSprout()}
        />
      </main>
    </div>
  );
}
