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

function renderCell(item, col, entity, fkCache, t) {
  const v = item[col.accessor || col.key];
  const type = col.type || "text";
  if (type === "date") return formatDate(v);
  if (type === "datetime") return formatDateTime(v);
  if (type === "bool" || type === "boolean")
    return (
      <span className={["inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold", boolBadge(Boolean(v))].join(" ")}>
        {v ? t("common.yes") : t("common.no")}
      </span>
    );
  if (type === "enum")
    return (
      <span className={["inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold", enumBadge(v, col.enumColors || {})].join(" ")}>
        {col.enumLabels?.[v] || v}
      </span>
    );
  if (type === "fk") return resolveFkName(entity, col.key, v, fkCache);
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
      show(t("crud.errorLoad"), "error");
    } finally {
      setLoading(false);
    }
  }, [api.getAll, show, t]);

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
      show(t("crud.deleted"), "success");
      load();
    } catch {
      show(t("crud.errorDelete"), "error");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleToggleActivo = async (item) => {
    const nuevoEstado = !item.activo;
    try {
      if (nuevoEstado) {
        await api.update(item.id, { ...item, activo: true });
        show(t("crud.reactivated"), "success");
      } else {
        await api.delete(item.id);
        show(t("crud.deactivated"), "success");
      }
      load();
    } catch {
      show(t("crud.toggleError"), "error");
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
  cols.push({ key: "actions", header: t("common.actions") || "Acciones" });

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
              {t("crud.new")}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <DataTable
          columns={cols}
          data={items}
          keyExtractor={(item) => item.id}
          searchPlaceholder={t("crud.search")}
          loading={loading}
          renderRow={(item) => (
            <>
              {columns.map((c) => (
                <td key={c.key || c.accessor} className="py-3 text-cenit-500 dark:text-cenit-300">
                  {renderCell(item, c, entity, fkCache, t)}
                </td>
              ))}
              <td className="py-3">
                <div className="flex items-center gap-2">
                  {hasForm !== false && canCrud && (
                    <button
                      onClick={() => navigate(`${routeBase}/${item.id}/editar`)}
                      className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                    >
                      {t("common.edit")}
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
                      {item.activo ? t("common.delete") : t("crud.reactivated")}
                    </button>
                  )}
                  {canCrud && item.activo === undefined && (
                    <button
                      onClick={() => setConfirmDelete(item)}
                      className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                    >
                      {t("common.delete")}
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
            title={t("crud.confirmDeleteTitle")}
            message={t("crud.confirmDeleteBody")}
            confirmLabel={t("common.delete")}
            confirmColor="bg-red-600 hover:bg-red-700"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
        {confirmToggle && (
          <ConfirmDialog
            open={true}
            title={t("crud.confirmDeactivateTitle")}
            message={t("crud.confirmDeactivateBody")}
            confirmLabel={t("common.delete")}
            confirmColor="bg-red-600 hover:bg-red-700"
            onConfirm={() => handleToggleActivo(confirmToggle)}
            onCancel={() => setConfirmToggle(null)}
          />
        )}
    </div>
  );
}
