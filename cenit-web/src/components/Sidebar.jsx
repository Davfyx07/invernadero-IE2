import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";

// Puedes importar o añadir otro icono
const iconAudit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const NAV_LINKS = [
  { to: "/", labelKey: "nav.dashboard", icon: iconDashboard },
  { to: "/invernaderos", labelKey: "nav.invernaderos", icon: iconInvernadero },
  { to: "/zonas", labelKey: "nav.zonas", icon: iconZona },
  { to: "/cultivos", labelKey: "nav.cultivos", icon: iconCultivo },
  { to: "/insumos", labelKey: "nav.insumos", icon: iconInsumo },
  { to: "/registros", labelKey: "nav.registros", icon: iconRegistro },
  { to: "/sensores", labelKey: "nav.sensores", icon: iconSensor },
  { to: "/erd", labelKey: "nav.erd", icon: iconErd, adminOnly: true },
  { to: "/admin-reports", labelKey: "Auditoría CI/CD", icon: iconAudit, adminOnly: true },
  { to: "/usuarios", labelKey: "nav.usuarios", icon: iconUsuario, section: "nav.parametrizacion", adminOnly: true },
  { to: "/parametros", labelKey: "nav.parametrizacion", icon: iconSettings, section: "nav.parametrizacion", adminOnly: true },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuth();
  const { t } = useI18n();
  const { pathname } = useLocation();

  const isActive = (to) => (to === "/" ? pathname === "/" : pathname.startsWith(to));
  const isAdmin = user?.rol === "ADMIN";
  const visibleLinks = NAV_LINKS.filter((l) => !l.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-white border border-cenit-200 shadow-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="8" x2="20" y2="8" />
          <line x1="4" y1="16" x2="20" y2="16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={[
          "fixed lg:sticky top-0 left-0 z-40 h-screen bg-[#0F172A] text-white flex flex-col border-r border-white/5 transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 20A7 7 0 0 1 9.8 6.5C13.5 5 17 7.5 17 11c0 2-1 3.5-2.5 4.5" />
              <path d="M11 20c-3.5 0-6.5-2.5-8-5 2.5-2.5 6-2.5 8 0" />
              <path d="M11 20v-6" />
            </svg>
          </div>
          {!collapsed && <span className="text-lg font-semibold tracking-tight">Cenit</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={[
                "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive(link.to)
                  ? "bg-emerald-700/20 text-emerald-300"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              ].join(" ")}
              title={collapsed ? t(link.labelKey) : undefined}
            >
              <span className="shrink-0 w-5 h-5">{link.icon()}</span>
              {!collapsed && <span className="truncate">{link.labelKey.includes('nav.') ? t(link.labelKey) : link.labelKey}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-2">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition"
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            <svg
              className={["w-4 h-4 transition", collapsed ? "rotate-180" : ""].join(" ")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {!collapsed && <span>{t("nav.collapse")}</span>}
          </button>

          <button
            onClick={logout}
            className="mt-2 w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition"
            title={collapsed ? t("nav.logout") : undefined}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            {!collapsed && <span className="truncate">{t("nav.logout")}</span>}
          </button>

          {!collapsed && user && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-semibold">
                {user.nombre?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{user.nombre}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.rol}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/* ─── Icon components (inline SVGs) ───────────────────────────────────────── */
function iconDashboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
function iconInvernadero() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35" />
      <path d="M22 8.35 12 2 2 8.35" />
      <path d="M6 20v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8" />
    </svg>
  );
}
function iconZona() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}
function iconCultivo() {
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
function iconInsumo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
function iconRegistro() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
function iconErd() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
function iconUsuario() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function iconSensor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4" />
      <path d="m4.93 4.93 2.83 2.83" />
      <path d="M2 12h4" />
      <path d="m4.93 19.07 2.83-2.83" />
      <path d="M12 18v4" />
      <path d="m19.07 19.07-2.83-2.83" />
      <path d="M18 12h4" />
      <path d="m19.07 4.93-2.83 2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function iconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
