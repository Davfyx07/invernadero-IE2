import { useEffect, useState } from "react";
import { useI18n } from "../../hooks/useI18n";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";
import api from "../../api/axiosConfig";
import KpiCard from "../../components/KpiCard";
import PieChart from "../../components/PieChart";
import AreaChart from "../../components/AreaChart";
import DataTable from "../../components/DataTable";
import NotificationBell from "../../components/NotificationBell";

const KPI_CONFIG = [
  { key: "invernaderos", gradient: "from-emerald-50 to-white", border: "border-emerald-100", iconBg: "bg-emerald-50", iconColor: "text-emerald-700", svg: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35"/><path d="M22 8.35 12 2 2 8.35"/><path d="M6 20v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"/></svg>' },
  { key: "zonas", gradient: "from-blue-50 to-white", border: "border-blue-100", iconBg: "bg-blue-50", iconColor: "text-blue-700", svg: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>' },
  { key: "alertas", gradient: "from-orange-50 to-white", border: "border-orange-100", iconBg: "bg-orange-50", iconColor: "text-orange-700", svg: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>' },
  { key: "criticos", gradient: "from-red-50 to-white", border: "border-red-100", iconBg: "bg-red-50", iconColor: "text-red-700", svg: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>' },
];

const TIPO_COLORS = {
  RIEGO: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  FERTILIZACION: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  FUMIGACION: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  INSPECCION: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  OTRO: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
};

const ESTADO_COLORS = {
  Completado: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Pendiente: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Cancelado: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export default function Dashboard() {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { show } = useToast();
  const [kpiData, setKpiData] = useState([0, 0, 0, 0]);
  const [activities, setActivities] = useState([]);
  const [phaseData, setPhaseData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let gotData = false;
    const load = async () => {
      try {
        const [inv, zon, cul, ins, act, sens] = await Promise.all([
          api.get("/invernaderos?page=0&size=1"),
          api.get("/zonas?page=0&size=1"),
          api.get("/cultivos?page=0&size=500"),
          api.get("/insumos?page=0&size=1"),
          api.get("/registroactividads?page=0&size=10"),
          api.get("/lecturas-sensores/latest"),
        ]);
        if (!cancelled) {
          gotData = true;
          const cultivos = cul.data?.content ?? cul.data ?? [];
          const alertas = cultivos.filter((c) => c.estado === "PERDIDO")?.length ?? 0;
          const criticos = ins.data.content?.filter((i) => i.stockActual < 10)?.length ?? 0;
          setKpiData([
            inv.data.totalElements ?? inv.data.content?.length ?? 0,
            zon.data.totalElements ?? zon.data.content?.length ?? 0,
            alertas,
            criticos,
          ]);
          // Gráfico de cultivos por estado
          const estados = {};
          cultivos.forEach((c) => { estados[c.estado] = (estados[c.estado] || 0) + 1; });
          setPhaseData(Object.entries(estados).map(([name, value]) => ({ name, value })));
          // Lecturas de sensores para gráfico de condiciones
          const lecturas = sens.data || [];
          setZoneData(lecturas.map((l) => ({ zona: `Zona ${l.zona_id}`, humedad: l.humedad, temp: l.temperatura })));
          const rawActs = act.data?.content ?? act.data ?? [];
          setActivities(rawActs.map((a) => ({ ...a, actividad: a.notas || a.tipo, responsable: a.usuario_id, zona: a.cultivo_id, estado: "Completado" })));
        }
      } catch {
        // sin datos = dashboard vacío con estado inicial
      } finally {
        if (!cancelled) {
          setLoading(false);
          if (gotData) {
            setTimeout(() => { if (!cancelled) show("Datos cargados", "success"); }, 600);
          }
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [show]);

  const kpiValues = [
    { title: t("dashboard.kpi.invernaderos"), value: kpiData[0] },
    { title: t("dashboard.kpi.zonas"), value: kpiData[1] },
    { title: t("dashboard.kpi.alertas"), value: kpiData[2] },
    { title: t("dashboard.kpi.criticos"), value: kpiData[3] },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top header */}
      <header className="h-16 bg-white dark:bg-cenit-800 border-b border-cenit-100 dark:border-cenit-700 flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-base font-semibold text-cenit-800 dark:text-white">{t("dashboard.title")}</h2>
            <p className="text-xs text-cenit-400">{t("dashboard.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-cenit-50 dark:hover:bg-cenit-700 transition">
            {theme === "light" ? (
              <svg className="w-5 h-5 text-cenit-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg className="w-5 h-5 text-cenit-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>
          {/* Language */}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="text-sm rounded-lg border border-cenit-200 dark:border-cenit-700 bg-white dark:bg-cenit-900 px-2 py-1 outline-none dark:text-white"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="it">IT</option>
          </select>
          {/* Notifications */}
          <NotificationBell />
          {/* Avatar */}
          <div className="flex items-center gap-2 pl-3 border-l border-cenit-100 dark:border-cenit-700">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-semibold">
              {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium leading-tight text-cenit-800 dark:text-white">{user?.nombre || "Usuario"}</p>
              <p className="text-xs text-cenit-400 leading-tight">{user?.rol || "OPERARIO"}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto scroll-hide">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiValues.map((k, i) => (
            <KpiCard
              key={i}
              title={k.title}
              value={k.value}
              change={k.change}
              positive={k.positive}
              gradient={KPI_CONFIG[i].gradient}
              border={KPI_CONFIG[i].border}
              iconBg={KPI_CONFIG[i].iconBg}
              iconColor={KPI_CONFIG[i].iconColor}
              iconSvg={KPI_CONFIG[i].svg}
              delay={i}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="bg-white dark:bg-cenit-800 rounded-2xl border border-cenit-100 dark:border-cenit-700 p-6 shadow-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-cenit-800 dark:text-white">{t("dashboard.charts.estados")}</h3>
                <p className="text-xs text-cenit-400">{t("dashboard.charts.estadosDesc")}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 20h10" /><path d="M10 20c0-4.5 2-8 7-10" /><path d="M7 20c0-3.5 1.5-6 5-8" /><path d="M12 20V4" /><path d="M12 4c0 0 3 2 3 6" /><path d="M12 4c0 0-3 2-3 6" />
                </svg>
              </div>
            </div>
            <PieChart data={phaseData} totalLabel="cultivos" />
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {phaseData.map((d, i) => {
                const colors = ["#059669", "#34D399", "#3B82F6", "#F97316", "#94A3B8", "#EF4444"];
                return (
                  <div key={i} className="flex items-center gap-2 text-xs text-cenit-500 dark:text-cenit-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i % colors.length] }}></span>
                    <span>{d.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-cenit-800 rounded-2xl border border-cenit-100 dark:border-cenit-700 p-6 shadow-sm animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-cenit-800 dark:text-white">{t("dashboard.charts.condiciones")}</h3>
                <p className="text-xs text-cenit-400">{t("dashboard.charts.condicionesDesc")}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                </svg>
              </div>
            </div>
            <AreaChart data={zoneData.length ? zoneData : [{ zona: "Sin datos", humedad: 0, temp: 0 }]} />
          </div>
        </div>

        {/* Activities Table */}
        <DataTable
          columns={[
            { key: "actividad", header: t("dashboard.activities.columns.actividad"), accessor: "actividad" },
            { key: "tipo", header: t("dashboard.activities.columns.tipo"), accessor: "tipo" },
            { key: "zona", header: t("dashboard.activities.columns.zona"), accessor: "zona" },
            { key: "responsable", header: t("dashboard.activities.columns.responsable"), accessor: "responsable" },
            { key: "fecha", header: t("dashboard.activities.columns.fecha"), accessor: "fecha" },
            { key: "estado", header: t("dashboard.activities.columns.estado"), accessor: "estado" },
          ]}
          data={activities}
          keyExtractor={(row) => row.id}
          searchPlaceholder={t("dashboard.activities.search")}
          filterOptions={[
            { label: "Todos", value: "" },
            { label: "Riego", value: "Riego" },
            { label: "Fertilización", value: "Fertilización" },
            { label: "Poda", value: "Poda" },
            { label: "Cosecha", value: "Cosecha" },
          ]}
          loading={loading}
          renderRow={(row) => (
            <>
              <td className="py-3 font-medium text-cenit-800 dark:text-white">{row.actividad}</td>
              <td className="py-3">
                <span className={["inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold", TIPO_COLORS[row.tipo] || "bg-cenit-100 text-cenit-600"].join(" ")}>
                  {row.tipo}
                </span>
              </td>
              <td className="py-3 text-cenit-500 dark:text-cenit-300">{row.zona}</td>
              <td className="py-3 text-cenit-500 dark:text-cenit-300">{row.responsable}</td>
              <td className="py-3 text-cenit-500 dark:text-cenit-300">{row.fecha}</td>
              <td className="py-3">
                <span className={["inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold", ESTADO_COLORS[row.estado] || "bg-cenit-100 text-cenit-600"].join(" ")}>
                  {row.estado}
                </span>
              </td>
            </>
          )}
        />
      </main>
    </div>
  );
}
