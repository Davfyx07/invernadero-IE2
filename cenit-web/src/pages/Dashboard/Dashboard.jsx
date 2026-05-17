import { useEffect, useState } from "react";
import { getAllCultivos } from "../../api/CultivoApi";
import { getAllRegistroActividads } from "../../api/RegistroActividadApi";
import { getAllInsumos } from "../../api/InsumoApi";

// ─── Datos mock para preview sin backend ────────────────────────────────────
const MOCK_CULTIVOS = [
  { id: 1, especie: "Tomate", variedad: "Roma", estado: "ACTIVO", fechaSiembra: "2025-01-10", zona_id: 1, usuario_id: 1 },
  { id: 2, especie: "Lechuga", variedad: "Iceberg", estado: "ACTIVO", fechaSiembra: "2025-02-05", zona_id: 2, usuario_id: 1 },
  { id: 3, especie: "Pimiento", variedad: "California", estado: "COSECHADO", fechaSiembra: "2024-11-20", zona_id: 1, usuario_id: 2 },
  { id: 4, especie: "Cilantro", variedad: "Slow Bolt", estado: "ACTIVO", fechaSiembra: "2025-03-01", zona_id: 3, usuario_id: 1 },
  { id: 5, especie: "Espinaca", variedad: "Bloomsdale", estado: "PERDIDO", fechaSiembra: "2024-12-15", zona_id: 2, usuario_id: 2 },
  { id: 6, especie: "Fresa", variedad: "Albion", estado: "ACTIVO", fechaSiembra: "2025-01-25", zona_id: 1, usuario_id: 1 },
];

const MOCK_REGISTROS = [
  { id: 1, tipo: "RIEGO", fecha: "2025-05-12", cantidad: 15.5, notas: "Riego matutino", cultivo_id: 1, insumo_id: 3, usuario_id: 1 },
  { id: 2, tipo: "FERTILIZACION", fecha: "2025-05-12", cantidad: 2.0, notas: "Fertilizante NPK", cultivo_id: 2, insumo_id: 1, usuario_id: 1 },
  { id: 3, tipo: "INSPECCION", fecha: "2025-05-11", cantidad: 0, notas: "Revisión general", cultivo_id: 1, insumo_id: null, usuario_id: 1 },
  { id: 4, tipo: "FUMIGACION", fecha: "2025-05-10", cantidad: 1.2, notas: "Control de plagas", cultivo_id: 4, insumo_id: 2, usuario_id: 2 },
  { id: 5, tipo: "RIEGO", fecha: "2025-05-10", cantidad: 12.0, notas: "Riego vespertino", cultivo_id: 6, insumo_id: 3, usuario_id: 1 },
  { id: 6, tipo: "FERTILIZACION", fecha: "2025-05-09", cantidad: 1.5, notas: "Micronutrientes", cultivo_id: 2, insumo_id: 1, usuario_id: 1 },
  { id: 7, tipo: "RIEGO", fecha: "2025-05-09", cantidad: 18.0, notas: "Riego profundo", cultivo_id: 1, insumo_id: 3, usuario_id: 2 },
];

const MOCK_INSUMOS = [
  { id: 1, nombre: "Fertilizante NPK", tipo: "FERTILIZANTE", unidadMedida: "kg", stockActual: 45 },
  { id: 2, nombre: "Pesticida orgánico", tipo: "PESTICIDA", unidadMedida: "L", stockActual: 8 },
  { id: 3, nombre: "Agua de riego", tipo: "AGUA", unidadMedida: "L", stockActual: 1200 },
  { id: 4, nombre: "Sustrato premium", tipo: "OTRO", unidadMedida: "kg", stockActual: 3 },
  { id: 5, nombre: "Calcio líquido", tipo: "FERTILIZANTE", unidadMedida: "L", stockActual: 2 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function isToday(iso) {
  const d = new Date(iso);
  const today = new Date();
  return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}

function countByType(items, key) {
  return items.reduce((acc, item) => {
    const t = item[key];
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
}

// ─── Componente ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [cultivos, setCultivos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [cRes, rRes, iRes] = await Promise.all([
          getAllCultivos(0, 1000),
          getAllRegistroActividads(0, 1000),
          getAllInsumos(0, 1000),
        ]);
        if (!cancelled) {
          setCultivos(cRes.data?.content ?? cRes.data ?? []);
          setRegistros(rRes.data?.content ?? rRes.data ?? []);
          setInsumos(iRes.data?.content ?? iRes.data ?? []);
        }
      } catch {
        // Fallback a mock para desarrollo sin backend
        if (!cancelled) {
          setCultivos(MOCK_CULTIVOS);
          setRegistros(MOCK_REGISTROS);
          setInsumos(MOCK_INSUMOS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  // Métricas
  const cultivosActivos = cultivos.filter((c) => c.estado === "ACTIVO").length;
  const registrosHoy = registros.filter((r) => isToday(r.fecha)).length;
  const insumosBajos = insumos.filter((i) => i.stockActual < 10).length;

  // Actividades recientes (últimas 5)
  const recientes = [...registros]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  // Gráfica: actividades por tipo
  const actPorTipo = countByType(registros, "tipo");
  const tiposOrdenados = Object.entries(actPorTipo).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, ...Object.values(actPorTipo));

  const tipoColors = {
    RIEGO: "bg-sky-500",
    FERTILIZACION: "bg-emerald-500",
    FUMIGACION: "bg-rose-500",
    INSPECCION: "bg-amber-500",
    OTRO: "bg-slate-500",
  };

  const tipoLabels = {
    RIEGO: "Riego",
    FERTILIZACION: "Fertilización",
    FUMIGACION: "Fumigación",
    INSPECCION: "Inspección",
    OTRO: "Otro",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Resumen del invernadero</p>
        </div>
        <span className="text-xs text-slate-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">
          {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Cultivos activos"
          value={loading ? "—" : cultivosActivos}
          icon="🌱"
          color="border-l-4 border-emerald-500"
        />
        <SummaryCard
          label="Registros hoy"
          value={loading ? "—" : registrosHoy}
          icon="📋"
          color="border-l-4 border-sky-500"
        />
        <SummaryCard
          label="Insumos bajos"
          value={loading ? "—" : insumosBajos}
          icon="⚠️"
          color="border-l-4 border-rose-500"
        />
      </div>

      {/* Contenido inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas actividades */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Últimas actividades
          </h2>
          {loading ? (
            <SkeletonRows count={5} />
          ) : recientes.length === 0 ? (
            <EmptyState message="No hay actividades registradas" />
          ) : (
            <ul className="space-y-3">
              {recientes.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 border border-white/5 px-4 py-3 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "w-2 h-2 rounded-full shrink-0",
                        tipoColors[r.tipo] || "bg-slate-500",
                      ].join(" ")}
                    />
                    <div>
                      <p className="text-sm text-white font-medium">
                        {tipoLabels[r.tipo] || r.tipo}
                      </p>
                      <p className="text-xs text-slate-400">
                        {r.notas || "Sin notas"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    {formatDate(r.fecha)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Gráfica de barras */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Actividades por tipo
          </h2>
          {loading ? (
            <SkeletonBars count={5} />
          ) : tiposOrdenados.length === 0 ? (
            <EmptyState message="Sin datos para mostrar" />
          ) : (
            <div className="space-y-4">
              {tiposOrdenados.map(([tipo, count]) => {
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={tipo}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300">
                        {tipoLabels[tipo] || tipo}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {count}
                      </span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={[
                          "h-full rounded-full transition-all duration-700",
                          tipoColors[tipo] || "bg-slate-500",
                        ].join(" ")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────
function SummaryCard({ label, value, icon, color }) {
  return (
    <div className={["bg-white/5 border border-white/10 rounded-xl p-5", color].join(" ")}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
    </div>
  );
}

function SkeletonRows({ count }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-14 bg-white/5 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

function SkeletonBars({ count }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between">
            <div className="w-24 h-3 bg-white/5 rounded animate-pulse" />
            <div className="w-8 h-3 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-white/5 rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-slate-500">
      <span className="text-2xl mb-2">📭</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
