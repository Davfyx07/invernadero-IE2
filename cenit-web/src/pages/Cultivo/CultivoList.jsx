import CrudList from "../../components/CrudList";
import { getAllCultivos, getCultivoById, createCultivo, updateCultivo, deleteCultivo } from "../../api/CultivoApi";
import { FK_RELATIONS } from "../../api/entityRegistry";

const ESTADO_COLORS = {
  ACTIVO: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  COSECHADO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  PERDIDO: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const COLUMNS = [
  { key: "especie", header: "Especie", type: "text" },
  { key: "variedad", header: "Variedad", type: "text" },
  { key: "estado", header: "Estado", type: "enum", enumColors: ESTADO_COLORS },
  { key: "fechaSiembra", header: "Siembra", type: "date" },
];

const API = { getAll: getAllCultivos, getById: getCultivoById, create: createCultivo, update: updateCultivo, delete: deleteCultivo };

const ESTADO_OPTIONS = [
  { value: "ACTIVO", label: "Activo" },
  { value: "COSECHADO", label: "Cosechado" },
  { value: "PERDIDO", label: "Perdido" },
];

const FIELDS = [
  { name: "especie", label: "Especie", type: "text", required: true },
  { name: "variedad", label: "Variedad", type: "text" },
  { name: "estado", label: "Estado", type: "parametro", paramTipo: "ESTADO_CULTIVO", required: true },
  { name: "fechaSiembra", label: "Fecha de siembra", type: "date", required: true },
  { name: "fechaCosecha", label: "Fecha de cosecha", type: "date" },
  { name: "zona_id", label: "Zona", type: "fk", required: true },
  { name: "usuario_id", label: "Responsable", type: "fk", required: true },
];

const FK_MAP = { zona_id: "zona", usuario_id: "usuario" };
const FK_ENTITIES = Object.values(FK_RELATIONS.Cultivo);

export default function CultivoList() {
  return <CrudList entity="Cultivos" columns={COLUMNS} api={API} formFields={FIELDS} fkMap={FK_MAP} fkEntities={FK_ENTITIES} />;
}
