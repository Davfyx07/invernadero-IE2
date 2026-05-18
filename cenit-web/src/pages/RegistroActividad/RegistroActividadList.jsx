import CrudList from "../../components/CrudList";
import { getAllRegistroActividads, getRegistroActividadById, createRegistroActividad, updateRegistroActividad, deleteRegistroActividad } from "../../api/RegistroActividadApi";
import { FK_RELATIONS } from "../../api/entityRegistry";

const TIPO_COLORS = {
  RIEGO: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  FERTILIZACION: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  FUMIGACION: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  INSPECCION: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  OTRO: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
};

const COLUMNS = [
  { key: "tipo", header: "Tipo", type: "enum", enumColors: TIPO_COLORS },
  { key: "cultivo_id", header: "Cultivo", type: "fk" },
  { key: "fecha", header: "Fecha", type: "datetime" },
  { key: "cantidad", header: "Cantidad", type: "number" },
];

const API = { getAll: getAllRegistroActividads, getById: getRegistroActividadById, create: createRegistroActividad, update: updateRegistroActividad, delete: deleteRegistroActividad };

const TIPO_OPTIONS = [
  { value: "RIEGO", label: "Riego" },
  { value: "FERTILIZACION", label: "Fertilización" },
  { value: "FUMIGACION", label: "Fumigación" },
  { value: "INSPECCION", label: "Inspección" },
  { value: "OTRO", label: "Otro" },
];

const FIELDS = [
  { name: "tipo", label: "Tipo", type: "parametro", paramTipo: "TIPO_ACTIVIDAD", required: true },
  { name: "fecha", label: "Fecha", type: "datetime", required: true },
  { name: "cantidad", label: "Cantidad", type: "number" },
  { name: "notas", label: "Notas", type: "textarea" },
  { name: "cultivo_id", label: "Cultivo", type: "fk", required: true },
  { name: "insumo_id", label: "Insumo", type: "fk" },
  { name: "usuario_id", label: "Responsable", type: "fk", required: true },
];

const FK_MAP = { cultivo_id: "cultivo", insumo_id: "insumo", usuario_id: "usuario" };
const FK_ENTITIES = Object.values(FK_RELATIONS.RegistroActividad);

export default function RegistroActividadList() {
  return <CrudList entity="Registros" columns={COLUMNS} api={API} formFields={FIELDS} fkMap={FK_MAP} fkEntities={FK_ENTITIES} />;
}
