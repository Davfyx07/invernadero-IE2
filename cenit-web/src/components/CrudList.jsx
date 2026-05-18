import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useI18n } from "../hooks/useI18n";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "./Toast";
import CrudForm from "./CrudForm";
import ConfirmDialog from "./ConfirmDialog";
import DataTable from "./DataTable";
import { formatDate, formatDateTime, enumBadge, boolBadge } from "../utils/formatters";
import { fetchFkOptions, findFkLabel, FK_RELATIONS } from "../api/entityRegistry";

function resolveFkName(entity, key, id, fkCache) {
  const map = FK_RELATIONS[entity];
  if (!map || !map[key]) return `ID ${id || "—"}`;
  const fkEntity = map[key];
  const cache = fkCache[fkEntity];
  return cache ? findFkLabel(fkEntity, id, cache) : `ID ${id || "—"}`;
}

function renderCell(item, col, entity, fkCache) {
  const v = item[col.accessor || col.key];
  const t = col.type || "text";
  if (t === "date") return formatDate(v);
  if (t === "datetime") return formatDateTime(v);
  if (t === "bool" || t === "boolean")
    return (
      <span className={["inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold", boolBadge(Boolean(v))].join(" ")}>
        {v ? "Sí" : "No"}
      </span>
    );
  if (t === "enum")
    return (
      <span className={["inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold", enumBadge(v, col.enumColors || {})].join(" ")}>
        {col.enumLabels?.[v] || v}
      </span>
    );
  if (t === "fk") return resolveFkName(entity, col.key, v, fkCache);
  return v != null ? String(v) : "—";
}

export default function CrudList({ entity, columns, api, fkEntities, hasForm, formFields, fkMap }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fkCache, setFkCache] = useState({});
  const isAdmin = user?.rol === "ADMIN";
  const isRegistros = entity === "Registros";
  const canCrud = isAdmin || isRegistros;
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);

  const splat = params["*"] || "";
  const createMatch = splat === "nuevo";
  const editMatch = splat.match(/^(\d+)\/editar$/);
  const editId = editMatch ? editMatch[1] : null;
  const routeBase = location.pathname.replace(/\/(nuevo|\d+\/editar)$/, "");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAll(0, 500);
      setItems(res.data?.content ?? res.data ?? []);
    } catch {
      show("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  }, [api.getAll, show]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!fkEntities || fkEntities.length === 0) return;
    const loadFk = async () => {
      const cache = {};
      for (const e of fkEntities) {
        cache[e] = await fetchFkOptions(e);
      }
      setFkCache(cache);
    };
    loadFk();
  }, [fkEntities?.join(",")]);

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(confirmDelete.id);
      show(confirmDelete.activo !== false ? "Desactivado correctamente" : "Eliminado correctamente", "success");
      load();
    } catch {
      show("Error al cambiar estado", "error");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleToggleActivo = async (item) => {
    const nuevoEstado = !item.activo;
    try {
      if (nuevoEstado) {
        await api.update(item.id, { ...item, activo: true });
        show("Reactivado correctamente", "success");
      } else {
        await api.delete(item.id);
        show("Desactivado correctamente", "success");
      }
      load();
    } catch {
      show("Error al cambiar estado", "error");
    } finally {
      setConfirmToggle(null);
    }
  };

  const handleFormClose = () => navigate(routeBase);
  const handleFormSaved = () => { load(); navigate(routeBase); };

  const cols = columns.map((c) => ({
    key: c.key || c.accessor,
    header: c.header || c.key,
    accessor: c.accessor || c.key,
    type: c.type,
    enumColors: c.enumColors,
    enumLabels: c.enumLabels,
  }));
  cols.push({ key: "actions", header: "Acciones" });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-16 bg-white dark:bg-cenit-800 border-b border-cenit-100 dark:border-cenit-700 flex items-center px-6">
        <div>
          <h2 className="text-lg font-semibold text-cenit-800 dark:text-white">{entity}</h2>
          <p className="text-xs text-cenit-400">CRUD de {entity.toLowerCase()}</p>
        </div>
        <div className="ml-auto">
          {hasForm !== false && canCrud && (
            <button
              onClick={() => navigate(`${routeBase}/nuevo`)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition active:scale-[0.98]"
            >
              + Nuevo
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <DataTable
          columns={cols}
          data={items}
          keyExtractor={(item) => item.id}
          searchPlaceholder={`Buscar ${entity.toLowerCase()}...`}
          loading={loading}
          renderRow={(item) => (
            <>
              {columns.map((c) => (
                <td key={c.key || c.accessor} className="py-3 text-cenit-500 dark:text-cenit-300">
                  {renderCell(item, c, entity, fkCache)}
                </td>
              ))}
              <td className="py-3">
                <div className="flex items-center gap-2">
                  {hasForm !== false && canCrud && (
                    <button
                      onClick={() => navigate(`${routeBase}/${item.id}/editar`)}
                      className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                    >
                      Editar
                    </button>
                  )}
                  {canCrud && item.activo !== undefined && (
                    <button
                      onClick={() => item.activo ? setConfirmToggle(item) : handleToggleActivo(item)}
                      className={[
                        "px-3 py-1 rounded-lg text-xs font-medium transition",
                        item.activo
                          ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40"
                          : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
                      ].join(" ")}
                    >
                      {item.activo ? "Desactivar" : "Reactivar"}
                    </button>
                  )}
                  {canCrud && item.activo === undefined && (
                    <button
                      onClick={() => setConfirmDelete(item)}
                      className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            </>
          )}
        />
      </main>

      {canCrud && (createMatch || editMatch) && formFields && (
        <CrudForm
          entity={entity}
          fields={formFields}
          api={api}
          fkMap={fkMap}
          itemId={editId}
          onSaved={handleFormSaved}
          onClose={handleFormClose}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          open={true}
          title="Confirmar eliminación"
          message={`¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          confirmColor="bg-red-600 hover:bg-red-700"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {confirmToggle && (
        <ConfirmDialog
          open={true}
          title="Confirmar desactivación"
          message={`¿Estás seguro de desactivar este registro? Podrás reactivarlo después.`}
          confirmLabel="Desactivar"
          confirmColor="bg-red-600 hover:bg-red-700"
          onConfirm={() => handleToggleActivo(confirmToggle)}
          onCancel={() => setConfirmToggle(null)}
        />
      )}
    </div>
  );
}
