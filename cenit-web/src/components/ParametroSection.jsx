import { useState, useEffect, useCallback } from "react";
import { useToast } from "./Toast";
import DataTable from "./DataTable";
import CrudForm from "./CrudForm";
import ConfirmDialog from "./ConfirmDialog";
import { boolBadge } from "../utils/formatters";
import {
  getParametrosByTipo,
  getParametroById,
  createParametro,
  updateParametro,
  deleteParametro,
} from "../api/ParametroApi";

const COLUMNS = [
  { key: "codigo", header: "Código", type: "text" },
  { key: "nombre", header: "Nombre", type: "text" },
  { key: "activo", header: "Estado", type: "bool" },
];

export default function ParametroSection({ tipo, title, icon }) {
  const { show } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getParametrosByTipo(tipo);
      setItems(res.data || []);
    } catch {
      show("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  }, [tipo, show]);

  useEffect(() => {
    load();
  }, [load]);

  const api = {
    getAll: () => getParametrosByTipo(tipo),
    getById: getParametroById,
    create: createParametro,
    update: updateParametro,
    delete: deleteParametro,
  };

  const fields = [
    { name: "tipo", label: "Tipo", type: "hidden", defaultValue: tipo },
    { name: "codigo", label: "Código", type: "text", required: true },
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "activo", label: "Activo", type: "bool", defaultValue: true },
  ];

  const handleToggle = async (item) => {
    try {
      if (item.activo) {
        await deleteParametro(item.id);
        show("Desactivado correctamente", "success");
      } else {
        await updateParametro(item.id, { ...item, activo: true });
        show("Reactivado correctamente", "success");
      }
      load();
    } catch {
      show("Error al cambiar estado", "error");
    } finally {
      setConfirmToggle(null);
    }
  };

  const cols = [...COLUMNS, { key: "actions", header: "Acciones" }];

  return (
    <div className="bg-white dark:bg-cenit-800 rounded-2xl border border-cenit-100 dark:border-cenit-700 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-cenit-100 dark:border-cenit-700">
        <div className="flex items-center gap-3">
          {icon && <span className="w-5 h-5 text-cenit-500 dark:text-cenit-300">{icon}</span>}
          <h3 className="text-base font-semibold text-cenit-800 dark:text-white">{title}</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cenit-100 dark:bg-cenit-700 text-cenit-600 dark:text-cenit-300">
            {items.length}
          </span>
        </div>
        <button
          onClick={() => { setEditingId(null); setModalOpen(true); }}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition active:scale-[0.98]"
        >
          + Nuevo
        </button>
      </div>

      <div className="p-4">
        <DataTable
          columns={cols}
          data={items}
          keyExtractor={(row) => row.id}
          searchPlaceholder={`Buscar ${title.toLowerCase()}...`}
          loading={loading}
          renderRow={(item) => (
            <>
              <td className="py-2.5 text-sm text-cenit-600 dark:text-cenit-300 font-medium">{item.codigo}</td>
              <td className="py-2.5 text-sm text-cenit-500 dark:text-cenit-300">{item.nombre}</td>
              <td className="py-2.5">
                <span className={["inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold", boolBadge(item.activo)].join(" ")}>
                  {item.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="py-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingId(item.id); setModalOpen(true); }}
                    className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => item.activo ? setConfirmToggle(item) : handleToggle(item)}
                    className={[
                      "px-2.5 py-1 rounded-lg text-[11px] font-medium transition",
                      item.activo
                        ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40"
                        : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
                    ].join(" ")}
                  >
                    {item.activo ? "Desactivar" : "Reactivar"}
                  </button>
                </div>
              </td>
            </>
          )}
        />
      </div>

      {modalOpen && (
        <CrudForm
          entity={title}
          fields={fields}
          api={api}
          itemId={editingId}
          onSaved={() => { load(); setModalOpen(false); setEditingId(null); }}
          onClose={() => { setModalOpen(false); setEditingId(null); }}
        />
      )}

      {confirmToggle && (
        <ConfirmDialog
          open={true}
          title="Confirmar desactivación"
          message={`¿Desactivar "${confirmToggle.nombre}"? Podrás reactivarlo después.`}
          confirmLabel="Desactivar"
          confirmColor="bg-red-600 hover:bg-red-700"
          onConfirm={() => handleToggle(confirmToggle)}
          onCancel={() => setConfirmToggle(null)}
        />
      )}
    </div>
  );
}
