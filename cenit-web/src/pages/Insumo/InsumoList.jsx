import CrudList from "../../components/CrudList";
import { getAllInsumos, getInsumoById, createInsumo, updateInsumo, deleteInsumo } from "../../api/InsumoApi";

const TIPO_COLORS = {
  FERTILIZANTE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  PESTICIDA: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  AGUA: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  OTRO: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
};

const COLUMNS = [
  { key: "nombre", header: "Nombre", type: "text" },
  { key: "tipo", header: "Tipo", type: "enum", enumColors: TIPO_COLORS },
  { key: "unidadMedida", header: "Unidad", type: "text" },
  { key: "stockActual", header: "Stock", type: "number" },
];

const API = { getAll: getAllInsumos, getById: getInsumoById, create: createInsumo, update: updateInsumo, delete: deleteInsumo };

const TIPO_OPTIONS = [
  { value: "FERTILIZANTE", label: "Fertilizante" },
  { value: "PESTICIDA", label: "Pesticida" },
  { value: "AGUA", label: "Agua" },
  { value: "OTRO", label: "Otro" },
];

const FIELDS = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "tipo", label: "Tipo", type: "parametro", paramTipo: "TIPO_INSUMO", required: true },
  { name: "unidadMedida", label: "Unidad de medida", type: "parametro", paramTipo: "UNIDAD_MEDIDA", required: true },
  { name: "stockActual", label: "Stock actual", type: "number", required: true },
];

export default function InsumoList() {
  return <CrudList entity="Insumos" columns={COLUMNS} api={API} formFields={FIELDS} />;
}
