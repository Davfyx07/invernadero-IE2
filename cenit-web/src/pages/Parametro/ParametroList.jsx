import CrudList from "../../components/CrudList";
import { getAllParametros, getParametroById, createParametro, updateParametro, deleteParametro } from "../../api/ParametroApi";

const COLUMNS = [
  { key: "codigo", header: "Código", type: "text" },
  { key: "nombre", header: "Nombre", type: "text" },
  { key: "activo", header: "Activo", type: "bool" },
];

const API = { getAll: getAllParametros, getById: getParametroById, create: createParametro, update: updateParametro, delete: deleteParametro };

const FIELDS = [
  { name: "codigo", label: "Código", type: "text", required: true },
  { name: "nombre", label: "Nombre", type: "text", required: true },
];

export default function ParametroList() {
  return <CrudList entity="Parámetros" columns={COLUMNS} api={API} formFields={FIELDS} />;
}
