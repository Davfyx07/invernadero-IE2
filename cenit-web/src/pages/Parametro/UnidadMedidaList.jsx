import CrudList from "../../components/CrudList";
import { getParametrosByTipo, getParametroById, createParametro, updateParametro, deleteParametro } from "../../api/ParametroApi";

const TIPO = "UNIDAD_MEDIDA";

const API = {
  getAll: () => getParametrosByTipo(TIPO),
  getById: getParametroById,
  create: createParametro,
  update: updateParametro,
  delete: deleteParametro,
};

const COLUMNS = [
  { key: "codigo", header: "Código", type: "text" },
  { key: "nombre", header: "Nombre", type: "text" },
  { key: "activo", header: "Activo", type: "bool" },
];

const FIELDS = [
  { name: "tipo", label: "Tipo", type: "hidden", defaultValue: TIPO },
  { name: "codigo", label: "Código", type: "text", required: true },
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "activo", label: "Activo", type: "bool", defaultValue: true },
];

export default function UnidadMedidaList() {
  return <CrudList entity="Unidades de Medida" columns={COLUMNS} api={API} formFields={FIELDS} />;
}
