import { useEffect, useState, useMemo } from "react";
import { useToast } from "./Toast";
import Modal from "./Modal";
import baseApi from "../api/axiosConfig";
import { fetchFkOptions } from "../api/entityRegistry";

function FieldInput({ field, value, onChange, fkOptions, paramOptions }) {
  const t = field.type || "text";
  const cls =
    "w-full rounded-xl border border-cenit-200 dark:border-cenit-600 bg-cenit-50 dark:bg-cenit-900 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-cenit-800 dark:text-white placeholder:text-cenit-300";

  if (t === "hidden") {
    return <input type="hidden" name={field.name} value={value || ""} onChange={onChange} />;
  }

  if (t === "bool" || t === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name={field.name}
          checked={Boolean(value)}
          onChange={(e) => onChange({ target: { name: field.name, value: e.target.checked } })}
          className="w-4 h-4 rounded border-cenit-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span className="text-sm text-cenit-600 dark:text-cenit-300">{field.label || field.name}</span>
      </label>
    );
  }

  if (t === "enum") {
    return (
      <select name={field.name} value={value || ""} onChange={onChange} className={cls}>
        <option value="">Seleccionar...</option>
        {field.options?.map((o) => (
          <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
        ))}
      </select>
    );
  }

  if (t === "fk") {
    const opts = fkOptions[field.name] || [];
    return (
      <select name={field.name} value={value || ""} onChange={onChange} className={cls}>
        <option value="">Seleccionar...</option>
        {opts.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    );
  }

  if (t === "parametro") {
    const opts = paramOptions[field.paramTipo || field.name] || [];
    return (
      <select name={field.name} value={value || ""} onChange={onChange} className={cls}>
        <option value="">Seleccionar...</option>
        {opts.map((o) => (
          <option key={o.codigo} value={o.codigo}>{o.nombre || o.codigo}</option>
        ))}
      </select>
    );
  }

  if (t === "date") return <input type="date" name={field.name} value={value?.toString().substring(0, 10) || ""} onChange={onChange} className={cls} />;
  if (t === "datetime") return <input type="datetime-local" name={field.name} value={value?.toString().substring(0, 16) || ""} onChange={onChange} className={cls} />;
  if (t === "textarea") return <textarea name={field.name} value={value || ""} onChange={onChange} rows={3} className={cls} />;
  if (t === "number" || t === "double" || t === "integer") return <input type="number" step="any" name={field.name} value={value ?? ""} onChange={onChange} className={cls} />;

  return <input type="text" name={field.name} value={value || ""} onChange={onChange} className={cls} />;
}

export default function CrudForm({ entity, fields, api, fkMap, itemId, onSaved, onClose }) {
  const { show } = useToast();
  const isEdit = Boolean(itemId);
  const [form, setForm] = useState({});
  const [fkOptions, setFkOptions] = useState({});
  const [paramOptions, setParamOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const fieldsSig = useMemo(() => fields.map((f) => `${f.name}:${f.type}:${f.defaultValue ?? ""}`).join("|"), [fields]);

  useEffect(() => {
    if (!isEdit) {
      const init = {};
      fields.forEach((f) => { init[f.name] = f.defaultValue ?? ""; });
      setForm(init);
    }
  }, [fieldsSig, isEdit]);

  useEffect(() => {
    if (isEdit && api.getById) {
      api.getById(itemId).then((res) => {
        const patched = {};
        fields.forEach((f) => {
          let v = res.data?.[f.name];
          if ((f.type === "date" || f.type === "datetime") && v) v = String(v);
          patched[f.name] = v ?? "";
        });
        setForm(patched);
        setReady(true);
      }).catch(() => {
        show("Error al cargar", "error");
        setReady(true);
      });
    } else {
      setReady(true);
    }
  }, [itemId, isEdit, api, fields, show]);

  useEffect(() => {
    if (!fkMap) { setReady((r) => r || true); return; }
    const load = async () => {
      const cache = {};
      for (const [key, fkEntity] of Object.entries(fkMap)) {
        cache[key] = await fetchFkOptions(fkEntity);
      }
      setFkOptions(cache);
    };
    load();
  }, [fkMap]);

  useEffect(() => {
    const paramFields = fields.filter((f) => f.type === "parametro");
    if (paramFields.length === 0) return;
    const load = async () => {
      const cache = {};
      for (const f of paramFields) {
        const tipo = f.paramTipo || f.name;
        if (cache[tipo]) continue;
        try {
          const res = await baseApi.get("/parametros/by-tipo", { params: { tipo } });
          cache[tipo] = (res.data || []).filter((p) => p.activo !== false);
        } catch {
          cache[tipo] = [];
        }
      }
      setParamOptions(cache);
    };
    load();
  }, [fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    for (const f of fields) {
      if (f.required && !form[f.name] && String(form[f.name]) !== "0") {
        setError(`El campo "${f.label || f.name}" es obligatorio`);
        return;
      }
    }
    setLoading(true);
    try {
      const payload = { ...form };
      fields.forEach((f) => {
        if (f.type === "fk" || f.type === "number" || f.type === "double" || f.type === "integer") {
          const v = payload[f.name];
          payload[f.name] = (v !== "" && v !== null && v !== undefined) ? Number(v) : null;
        }
      });
      if (isEdit) {
        await api.update(itemId, payload);
        show("Actualizado correctamente", "success");
      } else {
        await api.create(payload);
        show("Creado correctamente", "success");
      }
      onSaved?.();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al guardar";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <Modal
      open={true}
      title={`${isEdit ? "Editar" : "Nuevo"} ${entity}`}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-xl border border-cenit-200 dark:border-cenit-600 bg-white dark:bg-cenit-700 px-5 py-2.5 text-sm font-medium text-cenit-600 dark:text-cenit-200 hover:bg-cenit-50 dark:hover:bg-cenit-600 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </button>
        </>
      }
    >
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-fade-in-up">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((f) => (
          f.type === "hidden" ? (
            <FieldInput key={f.name} field={f} value={form[f.name]} onChange={handleChange} fkOptions={fkOptions} paramOptions={paramOptions} />
          ) : (
            <div key={f.name}>
              <label className="block text-sm font-medium text-cenit-700 dark:text-cenit-200 mb-1.5">
                {f.label || f.name}
                {f.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <FieldInput field={f} value={form[f.name]} onChange={handleChange} fkOptions={fkOptions} paramOptions={paramOptions} />
            </div>
          )
        ))}
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
