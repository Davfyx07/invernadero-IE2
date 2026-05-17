import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/invernaderos", label: "Invernaderos" },
  { to: "/zonas", label: "Zonas" },
  { to: "/cultivos", label: "Cultivos" },
  { to: "/insumos", label: "Insumos" },
  { to: "/registros", label: "Registros" },
  { to: "/erd", label: "ERD" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav className="bg-primary-900 border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🌿</span>
            <span className="text-white font-bold text-lg tracking-tight">Cenit</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={[
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-800 text-white"
                      : "text-primary-100 hover:bg-primary-800/60 hover:text-white",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop logout */}
          <div className="hidden md:block">
            <button
              onClick={logout}
              className="text-sm text-primary-100 hover:text-white px-3 py-1.5 rounded-md hover:bg-primary-800/60 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-primary-100 hover:text-white hover:bg-primary-800/60"
            aria-label="Menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-primary-900/95 backdrop-blur">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={[
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    active
                      ? "bg-primary-800 text-white"
                      : "text-primary-100 hover:bg-primary-800/60 hover:text-white",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary-100 hover:bg-primary-800/60 hover:text-white transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
